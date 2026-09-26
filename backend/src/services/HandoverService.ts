import { crewRepository } from "../repositories/CrewRepository";
import { repairTicketRepository } from "../repositories/RepairTicketRepository";
import { sparePartUsageRepository } from "../repositories/SparePartUsageRepository";
import { arrivalRecordRepository } from "../repositories/ArrivalRecordRepository";
import { handoverRecordRepository } from "../repositories/HandoverRecordRepository";
import { faultReportRepository } from "../repositories/FaultReportRepository";
import { PART_PENDING_PICKUP } from "../constants/PartUsageStatus";
import { ERROR_CODES } from "../constants/errorCodes";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import { LOG_TEMPLATES } from "../constants/logTemplates";
import { ServiceError } from "../utils/ServiceError";
import { takeSnapshot, restoreSnapshot } from "../utils/handoverSnapshot";
import { collectRequiredSkills, evaluateCandidate, evaluateTicket } from "./handoverEligibility";
import type { HandoverExecutePayload, HandoverPreview } from "../types/HandoverPayload";
import type { HandoverRecord } from "../models/HandoverRecord";

const audit = (template: string, detail: unknown) => console.info("audit", template, JSON.stringify(detail));

const buildPreview = (fromCrewId: number): HandoverPreview => {
  const fromCrew = crewRepository.findById(fromCrewId);
  if (!fromCrew) {
    throw new ServiceError(404, ERROR_CODES.HANDOVER_CREW_NOT_FOUND, ERROR_MESSAGES.HANDOVER_CREW_NOT_FOUND, { crew_id: fromCrewId });
  }

  // 原班组名下全部未完工单
  const openTickets = repairTicketRepository.findByCrew(fromCrewId).filter((ticket) =>
    ["WAIT_DISPATCH", "ASSIGNED", "ARRIVED", "REPAIRING"].includes(ticket.status)
  );

  const ticketBlocks = openTickets.map((ticket) => {
    const evaluation = evaluateTicket(ticket, fromCrewId);
    return { ticket_id: ticket.id, status: ticket.status, ...evaluation };
  });
  const transferableTickets = openTickets.filter(
    (ticket) => ticketBlocks.find((block) => block.ticket_id === ticket.id)?.transferable
  );

  // 待领用备件申请（随可转移工单一起走）
  const transferableTicketIds = transferableTickets.map((ticket) => ticket.id);
  const pendingParts = sparePartUsageRepository
    .findByTickets(transferableTicketIds)
    .filter((part) => part.usage_status === PART_PENDING_PICKUP);

  // 未闭环到场记录随班组值班责任一起移交
  const openArrivals = arrivalRecordRepository.findOpenByCrew(fromCrewId);

  const requiredSkills = collectRequiredSkills(transferableTickets, faultReportRepository.findAll());

  const candidates = crewRepository.findAll().map((candidate) => ({
    crew_id: candidate.id,
    eligible: evaluateCandidate(candidate, { fromCrewId, requiredSkills }).length === 0,
    reasons: evaluateCandidate(candidate, { fromCrewId, requiredSkills })
  }));

  return {
    from_crew_id: fromCrewId,
    from_crew_name: fromCrew.name,
    open_ticket_ids: openTickets.map((ticket) => ticket.id),
    transferable_ticket_ids: transferableTicketIds,
    ticket_blocks: ticketBlocks,
    part_ids: pendingParts.map((part) => part.id),
    arrival_ids: openArrivals.map((arrival) => arrival.id),
    required_skills: requiredSkills,
    candidates,
    global_blocked: transferableTickets.length !== openTickets.length
  };
};

const persistAttempt = (record: Omit<HandoverRecord, "id">): HandoverRecord => {
  const saved = handoverRecordRepository.insert(record);
  audit(LOG_TEMPLATES.HandoverRecord[record.status === "SUCCESS" ? 1 : 2], saved);
  return saved;
};

export const handoverService = {
  preview: (fromCrewId: number): HandoverPreview => {
    audit(LOG_TEMPLATES.HandoverRecord[0], { from_crew_id: fromCrewId });
    return buildPreview(fromCrewId);
  },

  listRecords: (crewId?: number): HandoverRecord[] => {
    audit(LOG_TEMPLATES.HandoverRecord[3], { crew_id: crewId });
    const all = handoverRecordRepository.findAll();
    return crewId ? all.filter((row) => row.from_crew_id === crewId || row.to_crew_id === crewId) : all;
  },

  execute: (payload: HandoverExecutePayload): HandoverRecord => {
    const fromCrewId = Number(payload.from_crew_id);
    const toCrewId = Number(payload.to_crew_id);
    const handoverOperator = (payload.handover_operator ?? "").trim();
    const receiverOperator = (payload.receiver_operator ?? "").trim();

    if (!Number.isInteger(fromCrewId) || !Number.isInteger(toCrewId) || !handoverOperator || !receiverOperator) {
      throw new ServiceError(400, ERROR_CODES.VALIDATION_FAILED, ERROR_MESSAGES.VALIDATION_FAILED, {
        required: ["from_crew_id", "to_crew_id", "handover_operator", "receiver_operator"]
      });
    }

    const fromCrew = crewRepository.findById(fromCrewId);
    const toCrew = crewRepository.findById(toCrewId);
    if (!fromCrew) {
      throw new ServiceError(404, ERROR_CODES.HANDOVER_CREW_NOT_FOUND, ERROR_MESSAGES.HANDOVER_CREW_NOT_FOUND, { crew_id: fromCrewId });
    }
    if (!toCrew) {
      throw new ServiceError(404, ERROR_CODES.HANDOVER_CREW_NOT_FOUND, ERROR_MESSAGES.HANDOVER_CREW_NOT_FOUND, { crew_id: toCrewId });
    }

    // 执行前重新计算，避免预览后状态漂移
    const preview = buildPreview(fromCrewId);
    const candidate = preview.candidates.find((row) => row.crew_id === toCrewId);

    // 已到场任务阻断：整体失败，列出阻断原因，原记录不动
    if (preview.global_blocked) {
      const record = persistAttempt({
        from_crew_id: fromCrewId,
        to_crew_id: toCrewId,
        handover_operator: handoverOperator,
        receiver_operator: receiverOperator,
        status: "FAILED",
        ticket_ids: preview.open_ticket_ids,
        part_ids: [],
        arrival_ids: [],
        block_reasons: preview.ticket_blocks.filter((block) => !block.transferable).flatMap((block) => block.reasons),
        remark: payload.remark ?? "",
        created_at: new Date().toISOString()
      });
      throw new ServiceError(409, ERROR_CODES.HANDOVER_BLOCKED, ERROR_MESSAGES.HANDOVER_BLOCKED, { record, preview });
    }

    // 接班班组校验：技能匹配、无未结工单、非离岗、且不是自己
    if (!candidate || !candidate.eligible) {
      const record = persistAttempt({
        from_crew_id: fromCrewId,
        to_crew_id: toCrewId,
        handover_operator: handoverOperator,
        receiver_operator: receiverOperator,
        status: "FAILED",
        ticket_ids: preview.transferable_ticket_ids,
        part_ids: [],
        arrival_ids: [],
        block_reasons: candidate?.reasons ?? ["TEAM_NOT_FOUND"],
        remark: payload.remark ?? "",
        created_at: new Date().toISOString()
      });
      throw new ServiceError(409, ERROR_CODES.HANDOVER_TARGET_INVALID, ERROR_MESSAGES.HANDOVER_TARGET_INVALID, { record, preview });
    }

    // 原子交接：快照 -> 转移 -> 失败回滚
    const stores = {
      crew: crewRepository.findAll(),
      repairTicket: repairTicketRepository.findAll(),
      sparePartUsage: sparePartUsageRepository.findAll(),
      arrivalRecord: arrivalRecordRepository.findAll()
    };
    const snapshot = takeSnapshot(stores);

    try {
      // 1. 未完工单转到新班组
      for (const ticketId of preview.transferable_ticket_ids) {
        const updated = repairTicketRepository.update(ticketId, { team_id: toCrewId });
        if (!updated || updated.team_id !== toCrewId) {
          throw new ServiceError(409, ERROR_CODES.HANDOVER_CONFLICT, ERROR_MESSAGES.HANDOVER_CONFLICT, { ticket_id: ticketId });
        }
        audit(LOG_TEMPLATES.RepairTicket[4], { ticket_id: ticketId, from_crew_id: fromCrewId, to_crew_id: toCrewId });
      }

      // 2. 待领用备件申请随工单转移（备件仍挂在工单上，无需改 team，但记录交接日志）
      for (const partId of preview.part_ids) {
        const part = sparePartUsageRepository.findById(partId);
        if (!part || !preview.transferable_ticket_ids.includes(part.ticket_id)) {
          throw new ServiceError(409, ERROR_CODES.HANDOVER_CONFLICT, ERROR_MESSAGES.HANDOVER_CONFLICT, { part_id: partId });
        }
        audit(LOG_TEMPLATES.SparePartUsage[4], { part_id: partId, ticket_id: part.ticket_id, to_crew_id: toCrewId });
      }

      // 3. 未闭环到场记录转到新班组
      for (const arrivalId of preview.arrival_ids) {
        const updated = arrivalRecordRepository.update(arrivalId, { crew_id: toCrewId });
        if (!updated || updated.crew_id !== toCrewId) {
          throw new ServiceError(409, ERROR_CODES.HANDOVER_CONFLICT, ERROR_MESSAGES.HANDOVER_CONFLICT, { arrival_id: arrivalId });
        }
        audit(LOG_TEMPLATES.ArrivalRecord[3], { arrival_id: arrivalId, from_crew_id: fromCrewId, to_crew_id: toCrewId });
      }

      // 4. 原班组释放（无未结工单）；接班班组承接首张工单为当前工单
      const released = crewRepository.update(fromCrewId, { current_ticket_id: null });
      const firstTicketId = preview.transferable_ticket_ids[0] ?? null;
      const takeover = crewRepository.update(toCrewId, { current_ticket_id: firstTicketId });
      if (!released || !takeover || released.current_ticket_id !== null) {
        throw new ServiceError(409, ERROR_CODES.HANDOVER_CONFLICT, ERROR_MESSAGES.HANDOVER_CONFLICT, { from_crew_id: fromCrewId });
      }
      audit(LOG_TEMPLATES.Crew[4], { crew_id: fromCrewId });
      audit(LOG_TEMPLATES.Crew[5], { crew_id: toCrewId, ticket_ids: preview.transferable_ticket_ids });

      return persistAttempt({
        from_crew_id: fromCrewId,
        to_crew_id: toCrewId,
        handover_operator: handoverOperator,
        receiver_operator: receiverOperator,
        status: "SUCCESS",
        ticket_ids: preview.transferable_ticket_ids,
        part_ids: preview.part_ids,
        arrival_ids: preview.arrival_ids,
        block_reasons: [],
        remark: payload.remark ?? "",
        created_at: new Date().toISOString()
      });
    } catch (error) {
      // 交接失败：恢复快照，原班组、工单、备件申请、到场记录全部保留
      restoreSnapshot(stores, snapshot);
      if (error instanceof ServiceError) throw error;
      throw new ServiceError(500, ERROR_CODES.HANDOVER_CONFLICT, ERROR_MESSAGES.HANDOVER_CONFLICT, { cause: String(error) });
    }
  }
};

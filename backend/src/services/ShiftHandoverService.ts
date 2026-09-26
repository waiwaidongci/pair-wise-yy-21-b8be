import { crewRepository } from "../repositories/CrewRepository";
import { repairTicketRepository } from "../repositories/RepairTicketRepository";
import { sparePartUsageRepository } from "../repositories/SparePartUsageRepository";
import { arrivalRecordRepository } from "../repositories/ArrivalRecordRepository";
import { shiftHandoverRepository } from "../repositories/ShiftHandoverRepository";
import { createShiftHandoverDto } from "../constructors/ShiftHandoverDtoFactory";
import { ERROR_CODES } from "../constants/errorCodes";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import { LOG_TEMPLATES } from "../constants/logTemplates";
import { HANDOVER_BLOCK_STATUS } from "../constants/TicketStatus";
import { CrewDutyStatus } from "../constants/CrewDutyStatus";
import type { ShiftHandoverPayload } from "../types/ShiftHandoverPayload";

const fail = (status: number, code: string, message: string, details: string[] = []) =>
  Object.assign(new Error(message), { status, code, details });

const splitSkillTags = (tags: string): string[] => tags.split(/[,，、\s/]+/).map((tag) => tag.trim()).filter(Boolean);

const buildPreview = (fromTeamId: number) => {
  if (!Number.isFinite(fromTeamId)) throw fail(400, ERROR_CODES.VALIDATION_FAILED, ERROR_MESSAGES.VALIDATION_FAILED);
  const fromCrew = crewRepository.findById(fromTeamId);
  if (!fromCrew) throw fail(404, ERROR_CODES.CREW_NOT_FOUND, ERROR_MESSAGES.CREW_NOT_FOUND);

  const openTickets = repairTicketRepository.findOpenByTeam(fromTeamId);
  const blockReasons = openTickets
    .filter((ticket) => (HANDOVER_BLOCK_STATUS as readonly string[]).includes(ticket.status))
    .map((ticket) => `工单#${ticket.id} 已到达现场（${ticket.status}），不得换班`);
  const openTicketIds = openTickets.map((ticket) => ticket.id);
  const pendingSpareParts = sparePartUsageRepository.findPendingByTicketIds(openTicketIds);
  const arrivalRecords = arrivalRecordRepository.findByTicketIds(openTicketIds);
  const requiredSkills = splitSkillTags(fromCrew.skill_tags);

  const candidates = crewRepository.findAll()
    .filter((crew) => crew.id !== fromTeamId)
    .map((crew) => {
      const reasons: string[] = [];
      if (crew.duty_status === CrewDutyStatus.OFF_DUTY) reasons.push("班组已离岗，不能接班");
      const busyTickets = repairTicketRepository.findOpenByTeam(crew.id);
      if (busyTickets.length > 0) reasons.push(`当前存在未结工单：${busyTickets.map((ticket) => `#${ticket.id}`).join("、")}`);
      const skills = splitSkillTags(crew.skill_tags);
      if (!requiredSkills.some((tag) => skills.includes(tag))) reasons.push(`技能标签不匹配（需覆盖：${requiredSkills.join("、")}）`);
      return { crew, eligible: reasons.length === 0, reasons };
    });

  return {
    from_team_id: fromTeamId,
    from_team_name: fromCrew.name,
    open_tickets: openTickets,
    blocked: blockReasons.length > 0,
    block_reasons: blockReasons,
    pending_spare_part_ids: pendingSpareParts.map((row) => row.id),
    arrival_record_ids: arrivalRecords.map((row) => row.id),
    candidates
  };
};

export const shiftHandoverService = {
  list: () => shiftHandoverRepository.findAll(),
  preview: (teamId: number) => buildPreview(teamId),
  handover: (payload: ShiftHandoverPayload & { operator_id?: number }) => {
    const preview = buildPreview(Number(payload.from_team_id));
    // 已到达现场的任务不得换班：先抛出阻断原因，不改动任何原始记录
    if (preview.block_reasons.length > 0) {
      throw fail(409, ERROR_CODES.HANDOVER_BLOCKED, ERROR_MESSAGES.HANDOVER_BLOCKED, preview.block_reasons);
    }
    const target = preview.candidates.find((candidate) => candidate.crew.id === Number(payload.to_team_id));
    if (!target) throw fail(404, ERROR_CODES.CREW_NOT_FOUND, ERROR_MESSAGES.CREW_NOT_FOUND);
    if (!target.eligible) {
      throw fail(409, ERROR_CODES.HANDOVER_TARGET_INVALID, ERROR_MESSAGES.HANDOVER_TARGET_INVALID, target.reasons);
    }

    // 全部校验通过后才落库：未完工单、待领用备件申请、到场记录一起转到新班组
    const ticketIds = preview.open_tickets.map((ticket) => ticket.id);
    repairTicketRepository.transferTeam(ticketIds, target.crew.id);
    arrivalRecordRepository.transferTeam(ticketIds, target.crew.id);
    crewRepository.update(preview.from_team_id, { current_ticket_id: 0 });
    crewRepository.update(target.crew.id, { current_ticket_id: ticketIds[0] ?? 0 });

    const record = shiftHandoverRepository.save(createShiftHandoverDto({
      from_team_id: preview.from_team_id,
      to_team_id: target.crew.id,
      operator_id: payload.operator_id ?? 0,
      operator_name: payload.operator_name?.trim() || `调度员#${payload.operator_id ?? 0}`,
      ticket_ids: ticketIds,
      spare_part_usage_ids: preview.pending_spare_part_ids,
      arrival_record_ids: preview.arrival_record_ids
    }));
    console.info(LOG_TEMPLATES.RepairTicket[4], record.id, `${preview.from_team_name} -> ${target.crew.name}`);
    console.info(LOG_TEMPLATES.Crew[4], record.id, record.operator_name);
    return record;
  }
};

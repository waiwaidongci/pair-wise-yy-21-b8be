import type { ArrivalRecord } from "../types/ArrivalRecord";
import type { Crew } from "../types/Crew";
import type { RepairTicket } from "../types/RepairTicket";
import type { SparePartUsage } from "../types/SparePartUsage";
import type { ShiftHandoverPayload, ShiftHandoverPreview, ShiftHandoverRecord } from "../types/ShiftHandover";
import { HandoverBlockStatus, OpenTicketStatus } from "../constants/TicketStatus";
import { CrewDutyStatus } from "../constants/CrewDutyStatus";
import { PENDING_USAGE_STATUS } from "../constants/SparePartUsageStatus";

export const splitSkillTags = (tags: string): string[] =>
  tags.split(/[,，、\s/]+/).map((tag) => tag.trim()).filter(Boolean);

interface HandoverSource {
  crews: readonly Crew[];
  tickets: readonly RepairTicket[];
  spareParts: readonly SparePartUsage[];
  arrivalRecords: readonly ArrivalRecord[];
}

// 与后端 ShiftHandoverService 相同的交接规则，供本地 mock 降级使用
export function buildShiftHandoverPreview(source: HandoverSource, fromTeamId: number): ShiftHandoverPreview {
  const fromCrew = source.crews.find((crew) => crew.id === fromTeamId);
  const openTickets = source.tickets.filter(
    (ticket) => ticket.team_id === fromTeamId && (OpenTicketStatus as readonly string[]).includes(ticket.status)
  );
  const blockReasons = openTickets
    .filter((ticket) => (HandoverBlockStatus as readonly string[]).includes(ticket.status))
    .map((ticket) => `工单#${ticket.id} 已到达现场（${ticket.status}），不得换班`);
  const openTicketIds = openTickets.map((ticket) => ticket.id);
  const requiredSkills = splitSkillTags(fromCrew?.skill_tags ?? "");
  const candidates = source.crews
    .filter((crew) => crew.id !== fromTeamId)
    .map((crew) => {
      const reasons: string[] = [];
      if (crew.duty_status === CrewDutyStatus.OFF_DUTY) reasons.push("班组已离岗，不能接班");
      const busyTickets = source.tickets.filter(
        (ticket) => ticket.team_id === crew.id && (OpenTicketStatus as readonly string[]).includes(ticket.status)
      );
      if (busyTickets.length > 0) reasons.push(`当前存在未结工单：${busyTickets.map((ticket) => `#${ticket.id}`).join("、")}`);
      const skills = splitSkillTags(crew.skill_tags);
      if (!requiredSkills.some((tag) => skills.includes(tag))) reasons.push(`技能标签不匹配（需覆盖：${requiredSkills.join("、")}）`);
      return { crew, eligible: reasons.length === 0, reasons };
    });
  return {
    from_team_id: fromTeamId,
    from_team_name: fromCrew?.name ?? `#${fromTeamId}`,
    open_tickets: [...openTickets],
    blocked: blockReasons.length > 0,
    block_reasons: blockReasons,
    pending_spare_part_ids: source.spareParts
      .filter((row) => openTicketIds.includes(row.ticket_id) && row.usage_status === PENDING_USAGE_STATUS)
      .map((row) => row.id),
    arrival_record_ids: source.arrivalRecords.filter((row) => openTicketIds.includes(row.ticket_id)).map((row) => row.id),
    candidates
  };
}

export const createDefaultShiftHandover = (overrides: Partial<ShiftHandoverRecord> = {}): ShiftHandoverRecord => ({
  id: 0,
  from_team_id: 0,
  to_team_id: 0,
  operator_id: 0,
  operator_name: "",
  ticket_ids: [],
  spare_part_usage_ids: [],
  arrival_record_ids: [],
  created_at: new Date().toISOString(),
  ...overrides
});

export const createShiftHandoverForm = (overrides: Partial<ShiftHandoverPayload> = {}): ShiftHandoverPayload => ({
  from_team_id: 0,
  to_team_id: 0,
  operator_name: "",
  ...overrides
});

export const createShiftHandoverRecord = (payload: ShiftHandoverPayload): ShiftHandoverRecord =>
  createDefaultShiftHandover({ ...payload, id: Date.now() });

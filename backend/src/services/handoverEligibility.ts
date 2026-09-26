import type { Crew } from "../models/Crew";
import type { FaultReport } from "../models/FaultReport";
import type { RepairTicket } from "../models/RepairTicket";
import { FAULT_SKILL_REQUIREMENT } from "../constants/FaultType";
import { AVAILABLE_DUTY_STATUS } from "../constants/DutyStatus";
import { isOnSiteTicket, isOpenTicket } from "../constants/TicketStatus";

// 技能标签以逗号分隔存储
export const parseSkillTags = (raw: string): string[] =>
  raw.split(/[,，]/).map((tag) => tag.trim()).filter(Boolean);

// 由工单关联的故障类型推导本次交接所需技能集合
export const collectRequiredSkills = (
  tickets: RepairTicket[],
  faults: FaultReport[]
): string[] => {
  const skills = new Set<string>();
  for (const ticket of tickets) {
    const fault = faults.find((row) => row.id === ticket.fault_report_id);
    if (fault) skills.add(FAULT_SKILL_REQUIREMENT[fault.fault_type as keyof typeof FAULT_SKILL_REQUIREMENT]);
  }
  return [...skills];
};

// 班组技能是否覆盖所需技能
export const hasMatchingSkill = (crew: Crew, requiredSkills: string[]): boolean => {
  const owned = new Set(parseSkillTags(crew.skill_tags));
  return requiredSkills.every((skill) => owned.has(skill));
};

// 班组当前是否持有未结工单（current_ticket_id 非空即视为占用）
export const hasOpenTicketInHand = (crew: Crew): boolean => crew.current_ticket_id !== null && crew.current_ticket_id !== undefined;

// 班组是否处于可接班的值班状态（非离岗）
export const isAvailableDuty = (crew: Crew): boolean =>
  (AVAILABLE_DUTY_STATUS as readonly string[]).includes(crew.duty_status);

// 计算一个接班候选班组的全部阻断原因
export const evaluateCandidate = (
  candidate: Crew,
  context: { fromCrewId: number; requiredSkills: string[] }
): string[] => {
  const reasons: string[] = [];
  if (candidate.id === context.fromCrewId) reasons.push("SAME_TEAM");
  if (!isAvailableDuty(candidate)) reasons.push("TEAM_OFF_DUTY");
  if (!hasMatchingSkill(candidate, context.requiredSkills)) reasons.push("SKILL_NOT_MATCH");
  if (hasOpenTicketInHand(candidate)) reasons.push("TEAM_BUSY");
  return reasons;
};

// 单张工单是否可交接：未完工且未到场
export const evaluateTicket = (ticket: RepairTicket, ownerCrewId: number): { transferable: boolean; reasons: string[] } => {
  const reasons: string[] = [];
  if (ticket.team_id !== ownerCrewId) reasons.push("TICKET_NOT_OWNED");
  if (!isOpenTicket(ticket.status)) reasons.push("TICKET_NOT_OPEN");
  if (isOnSiteTicket(ticket.status)) reasons.push("TICKET_ON_SITE");
  return { transferable: reasons.length === 0, reasons };
};

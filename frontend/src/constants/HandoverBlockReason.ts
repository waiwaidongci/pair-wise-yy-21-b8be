// 换班交接阻断原因码（前后端一致），页面据此列出具体阻断原因
export const HandoverBlockReason = [
  "SAME_TEAM",
  "TEAM_NOT_FOUND",
  "TEAM_OFF_DUTY",
  "SKILL_NOT_MATCH",
  "TEAM_BUSY",
  "TICKET_ON_SITE",
  "TICKET_NOT_OPEN",
  "TICKET_NOT_OWNED",
  "HANDOVER_IN_PROGRESS"
] as const;
export type HandoverBlockReason = (typeof HandoverBlockReason)[number];

export const HandoverBlockReasonText: Record<HandoverBlockReason, string> = {
  SAME_TEAM: "接班班组不能是原班组",
  TEAM_NOT_FOUND: "接班班组不存在",
  TEAM_OFF_DUTY: "班组已离岗，不能接班",
  SKILL_NOT_MATCH: "班组技能不匹配故障类型",
  TEAM_BUSY: "班组当前持有未结工单",
  TICKET_ON_SITE: "任务已到达现场，不得换班",
  TICKET_NOT_OPEN: "工单已完工，无需交接",
  TICKET_NOT_OWNED: "工单不属于该交出班组",
  HANDOVER_IN_PROGRESS: "交接执行中状态已变化，请刷新后重试"
};

export const describeBlockReasons = (reasons: readonly string[]): string[] =>
  reasons.map((reason) => HandoverBlockReasonText[reason as HandoverBlockReason] ?? reason);

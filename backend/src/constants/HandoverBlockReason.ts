// 换班交接阻断原因码：选择接班班组的校验项与工单级阻断原因共用
export const HandoverBlockReason = [
  "SAME_TEAM",              // 接班班组就是原班组
  "TEAM_NOT_FOUND",         // 接班班组不存在
  "TEAM_OFF_DUTY",          // 班组处于离岗状态
  "SKILL_NOT_MATCH",        // 班组技能不匹配故障类型
  "TEAM_BUSY",              // 班组当前有未结工单
  "TICKET_ON_SITE",         // 工单已到达现场，禁止换班
  "TICKET_NOT_OPEN",        // 工单已完工，无需交接
  "TICKET_NOT_OWNED",       // 工单不属于交出班组
  "HANDOVER_IN_PROGRESS"    // 交接执行中状态已变化
] as const;
export type HandoverBlockReason = (typeof HandoverBlockReason)[number];

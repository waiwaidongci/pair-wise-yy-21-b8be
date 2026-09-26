export const TicketStatus = ["WAIT_DISPATCH","ASSIGNED","ARRIVED","REPAIRING","RESTORED","CLOSED"] as const;
export type TicketStatus = (typeof TicketStatus)[number];
export const TicketStatusText: Record<TicketStatus, string> = {
  WAIT_DISPATCH: "待派工",
  ASSIGNED: "已派工",
  ARRIVED: "已到场",
  REPAIRING: "抢修中",
  RESTORED: "已复电",
  CLOSED: "已关闭"
};
// 未结工单：换班交接时随班组一起转移的工单状态范围
export const OpenTicketStatus = ["WAIT_DISPATCH","ASSIGNED","ARRIVED","REPAIRING"] as const;
// 已到达现场及之后的任务不得换班
export const HandoverBlockStatus = ["ARRIVED","REPAIRING"] as const;

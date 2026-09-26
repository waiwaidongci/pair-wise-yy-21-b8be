export const TicketStatus = ["WAIT_DISPATCH","ASSIGNED","ARRIVED","REPAIRING","RESTORED","CLOSED"] as const;
export type TicketStatus = (typeof TicketStatus)[number];
// 未结工单：换班交接时随班组一起转移的工单状态范围
export const OPEN_TICKET_STATUS = ["WAIT_DISPATCH","ASSIGNED","ARRIVED","REPAIRING"] as const;
// 已到达现场及之后的任务不得换班
export const HANDOVER_BLOCK_STATUS = ["ARRIVED","REPAIRING"] as const;

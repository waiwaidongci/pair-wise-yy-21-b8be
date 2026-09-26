export const TicketStatus = ["WAIT_DISPATCH","ASSIGNED","ARRIVED","REPAIRING","RESTORED","CLOSED"] as const;
export type TicketStatus = (typeof TicketStatus)[number];
export const TicketStatusText: Record<TicketStatus, string> = {
  WAIT_DISPATCH: "待派工",
  ASSIGNED: "已派工（到场途中）",
  ARRIVED: "已到达现场",
  REPAIRING: "抢修中",
  RESTORED: "已复电",
  CLOSED: "已关单"
};

// 未完工：尚未复电、尚未关单
export const OPEN_TICKET_STATUS: TicketStatus[] = ["WAIT_DISPATCH", "ASSIGNED", "ARRIVED", "REPAIRING"];
// 已到达现场：到场后对现场负责，禁止换班
export const ON_SITE_TICKET_STATUS: TicketStatus[] = ["ARRIVED", "REPAIRING"];

export const isOpenTicket = (status: string): boolean => OPEN_TICKET_STATUS.includes(status as TicketStatus);
export const isOnSiteTicket = (status: string): boolean => ON_SITE_TICKET_STATUS.includes(status as TicketStatus);

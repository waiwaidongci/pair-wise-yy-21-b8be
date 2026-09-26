export const TicketStatus = ["WAIT_DISPATCH","ASSIGNED","ARRIVED","REPAIRING","RESTORED","CLOSED"] as const;
export type TicketStatus = (typeof TicketStatus)[number];

// 未完工：尚未复电、尚未关单的状态
export const OPEN_TICKET_STATUS: TicketStatus[] = ["WAIT_DISPATCH", "ASSIGNED", "ARRIVED", "REPAIRING"];
// 已到达现场：到场后即对现场负责，禁止换班
export const ON_SITE_TICKET_STATUS: TicketStatus[] = ["ARRIVED", "REPAIRING"];

export const isOpenTicket = (status: string): boolean => OPEN_TICKET_STATUS.includes(status as TicketStatus);
export const isOnSiteTicket = (status: string): boolean => ON_SITE_TICKET_STATUS.includes(status as TicketStatus);

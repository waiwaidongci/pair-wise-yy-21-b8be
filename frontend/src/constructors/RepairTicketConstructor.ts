import type { RepairTicket } from "../types/RepairTicket";

export const createDefaultRepairTicket = (overrides: Partial<RepairTicket> = {}): RepairTicket => ({
  id: 1,
  fault_report_id: 1,
  team_id: 1,
  dispatcher_id: 1,
  priority: "HIGH",
  status: "ASSIGNED",
  assigned_at: "2026-09-26T20:10:00Z",
  restored_at: null,
  ...overrides
});

export const createRepairTicketForm = createDefaultRepairTicket;
export const createRepairTicketResponse = createDefaultRepairTicket;

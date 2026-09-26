import type { ArrivalRecord } from "../models/ArrivalRecord";

export const createArrivalRecordDto = (overrides: Partial<ArrivalRecord> = {}): ArrivalRecord => ({
  id: 1,
  crew_id: 1,
  ticket_id: null,
  site_name: "城东夜巡值守点",
  arrived_at: "2026-09-26T20:00:00Z",
  note: "",
  status: "OPEN",
  ...overrides
});

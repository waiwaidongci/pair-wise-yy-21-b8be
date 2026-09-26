import type { HandoverRecord } from "../models/HandoverRecord";

export const createHandoverRecordDto = (overrides: Partial<HandoverRecord> = {}): HandoverRecord => ({
  id: 1,
  from_crew_id: 1,
  to_crew_id: 3,
  handover_operator: "班组长-马涛（交班）",
  receiver_operator: "班组长-赵磊（接班）",
  status: "SUCCESS",
  ticket_ids: [],
  part_ids: [],
  arrival_ids: [],
  block_reasons: [],
  remark: "",
  created_at: "2026-09-26T08:30:00Z",
  ...overrides
});

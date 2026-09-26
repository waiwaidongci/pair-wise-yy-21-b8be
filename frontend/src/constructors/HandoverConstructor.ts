import type { HandoverRecord, HandoverExecutePayload } from "../types/Handover";

export const createDefaultHandoverRecord = (overrides: Partial<HandoverRecord> = {}): HandoverRecord => ({
  id: 1,
  from_crew_id: 1,
  to_crew_id: 3,
  handover_operator: "",
  receiver_operator: "",
  status: "SUCCESS",
  ticket_ids: [],
  part_ids: [],
  arrival_ids: [],
  block_reasons: [],
  remark: "",
  created_at: "2026-09-26T08:30:00Z",
  ...overrides
});

// 交接表单默认对象
export const createHandoverForm = (overrides: Partial<HandoverExecutePayload> = {}): HandoverExecutePayload => ({
  from_crew_id: 1,
  to_crew_id: 3,
  handover_operator: "",
  receiver_operator: "",
  remark: "",
  ...overrides
});

export const createHandoverResponse = createDefaultHandoverRecord;

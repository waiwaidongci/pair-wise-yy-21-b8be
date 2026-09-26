// 换班交接记录：成功与失败均留痕，保留前后班组与交接/接班人
export interface HandoverRecord {
  id: number;
  from_crew_id: number;
  to_crew_id: number;
  handover_operator: string;
  receiver_operator: string;
  status: string; // SUCCESS / FAILED
  ticket_ids: number[];
  part_ids: number[];
  arrival_ids: number[];
  block_reasons: string[];
  remark: string;
  created_at: string;
}

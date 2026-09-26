// 换班交接留痕：成功/失败均记录，保留前后班组与交接/接班人
export interface HandoverRecord {
  id: number;
  from_crew_id: number;
  to_crew_id: number;
  handover_operator: string;
  receiver_operator: string;
  status: string;
  ticket_ids: number[];
  part_ids: number[];
  arrival_ids: number[];
  block_reasons: string[];
  remark: string;
  created_at: string;
}

export interface CrewCandidateBlock {
  crew_id: number;
  eligible: boolean;
  reasons: string[];
}

export interface TicketBlock {
  ticket_id: number;
  status: string;
  transferable: boolean;
  reasons: string[];
}

export interface HandoverPreview {
  from_crew_id: number;
  from_crew_name: string;
  open_ticket_ids: number[];
  transferable_ticket_ids: number[];
  ticket_blocks: TicketBlock[];
  part_ids: number[];
  arrival_ids: number[];
  required_skills: string[];
  candidates: CrewCandidateBlock[];
  global_blocked: boolean;
}

export interface HandoverExecutePayload {
  from_crew_id: number;
  to_crew_id: number;
  handover_operator: string;
  receiver_operator: string;
  remark?: string;
}

// 后端 409 错误的 details 结构
export interface HandoverErrorDetails {
  record?: HandoverRecord;
  preview?: HandoverPreview;
}

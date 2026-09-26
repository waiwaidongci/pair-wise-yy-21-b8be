// 换班交接执行请求
export interface HandoverExecutePayload {
  from_crew_id?: number;
  to_crew_id?: number;
  handover_operator?: string; // 交出方交接人（原班组长）
  receiver_operator?: string; // 接班方交接人
  remark?: string;
}

// 单个接班候选班组的阻断原因
export interface CrewCandidateBlock {
  crew_id: number;
  eligible: boolean;
  reasons: string[];
}

// 单张工单的阻断原因（已到达现场等）
export interface TicketBlock {
  ticket_id: number;
  status: string;
  transferable: boolean;
  reasons: string[];
}

// 交接预览结果
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

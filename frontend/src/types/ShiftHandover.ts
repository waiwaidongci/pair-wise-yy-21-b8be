import type { Crew } from "./Crew";
import type { RepairTicket } from "./RepairTicket";

export interface ShiftHandoverCandidate {
  crew: Crew;
  eligible: boolean;
  reasons: string[];
}

export interface ShiftHandoverPreview {
  from_team_id: number;
  from_team_name: string;
  open_tickets: RepairTicket[];
  blocked: boolean;
  block_reasons: string[];
  pending_spare_part_ids: number[];
  arrival_record_ids: number[];
  candidates: ShiftHandoverCandidate[];
}

export interface ShiftHandoverRecord {
  id: number;
  from_team_id: number;
  to_team_id: number;
  operator_id: number;
  operator_name: string;
  ticket_ids: number[];
  spare_part_usage_ids: number[];
  arrival_record_ids: number[];
  created_at: string;
}

export interface ShiftHandoverPayload {
  from_team_id: number;
  to_team_id: number;
  operator_name: string;
}

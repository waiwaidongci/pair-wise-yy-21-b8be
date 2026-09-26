// 到场记录：班组到达故障现场的签到/到场台账，随班组值班责任移交
export interface ArrivalRecord {
  id: number;
  crew_id: number;
  ticket_id: number | null;
  site_name: string;
  arrived_at: string;
  note: string;
  status: string; // OPEN / CLOSED
}

import { seed } from "../seed";
import type { ArrivalRecord } from "../models/ArrivalRecord";

const rows: ArrivalRecord[] = seed.arrivalRecord.map((row) => ({ ...row }));

export const arrivalRecordRepository = {
  findAll: () => rows,
  findByTicketIds: (ticketIds: number[]) => rows.filter((row) => ticketIds.includes(row.ticket_id)),
  transferTeam: (ticketIds: number[], toTeamId: number) => { rows.forEach((row) => { if (ticketIds.includes(row.ticket_id)) row.team_id = toTeamId; }); }
};

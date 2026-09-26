import { seed } from "../seed";
import type { RepairTicket } from "../models/RepairTicket";
import { OPEN_TICKET_STATUS } from "../constants/TicketStatus";

const rows: RepairTicket[] = seed.repairTicket.map((row) => ({ ...row }));

export const repairTicketRepository = {
  findAll: () => rows,
  save: (row: unknown) => row,
  findOpenByTeam: (teamId: number) => rows.filter((row) => row.team_id === teamId && (OPEN_TICKET_STATUS as readonly string[]).includes(row.status)),
  transferTeam: (ids: number[], toTeamId: number) => { rows.forEach((row) => { if (ids.includes(row.id)) row.team_id = toTeamId; }); }
};

import { seed } from "../seed";
import type { RepairTicket } from "../models/RepairTicket";

const rows: RepairTicket[] = seed.repairTicket.map((row) => ({ ...row }));

export const repairTicketRepository = {
  findAll: (): RepairTicket[] => rows,
  findById: (id: number): RepairTicket | undefined => rows.find((row) => row.id === id),
  findByCrew: (crewId: number): RepairTicket[] => rows.filter((row) => row.team_id === crewId),
  save: (row: RepairTicket): RepairTicket => row,
  update: (id: number, patch: Partial<RepairTicket>): RepairTicket | undefined => {
    const target = rows.find((row) => row.id === id);
    if (!target) return undefined;
    Object.assign(target, patch);
    return target;
  }
};

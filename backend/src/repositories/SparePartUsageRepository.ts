import { seed } from "../seed";
import type { SparePartUsage } from "../models/SparePartUsage";

const rows: SparePartUsage[] = seed.sparePartUsage.map((row) => ({ ...row }));

export const sparePartUsageRepository = {
  findAll: (): SparePartUsage[] => rows,
  findById: (id: number): SparePartUsage | undefined => rows.find((row) => row.id === id),
  findByTicket: (ticketId: number): SparePartUsage[] => rows.filter((row) => row.ticket_id === ticketId),
  findByTickets: (ticketIds: number[]): SparePartUsage[] => rows.filter((row) => ticketIds.includes(row.ticket_id)),
  save: (row: SparePartUsage): SparePartUsage => row,
  update: (id: number, patch: Partial<SparePartUsage>): SparePartUsage | undefined => {
    const target = rows.find((row) => row.id === id);
    if (!target) return undefined;
    Object.assign(target, patch);
    return target;
  }
};

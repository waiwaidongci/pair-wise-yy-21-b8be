import { seed } from "../seed";
import type { SparePartUsage } from "../models/SparePartUsage";
import { PENDING_USAGE_STATUS } from "../constants/SparePartUsageStatus";

const rows: SparePartUsage[] = seed.sparePartUsage.map((row) => ({ ...row }));

export const sparePartUsageRepository = {
  findAll: () => rows,
  save: (row: unknown) => row,
  findPendingByTicketIds: (ticketIds: number[]) => rows.filter((row) => ticketIds.includes(row.ticket_id) && row.usage_status === PENDING_USAGE_STATUS)
};

import { seed } from "../seed";
import type { ArrivalRecord } from "../models/ArrivalRecord";

const rows: ArrivalRecord[] = seed.arrivalRecord.map((row) => ({ ...row }));

export const arrivalRecordRepository = {
  findAll: (): ArrivalRecord[] => rows,
  findById: (id: number): ArrivalRecord | undefined => rows.find((row) => row.id === id),
  findOpenByCrew: (crewId: number): ArrivalRecord[] =>
    rows.filter((row) => row.crew_id === crewId && row.status === "OPEN"),
  save: (row: ArrivalRecord): ArrivalRecord => row,
  update: (id: number, patch: Partial<ArrivalRecord>): ArrivalRecord | undefined => {
    const target = rows.find((row) => row.id === id);
    if (!target) return undefined;
    Object.assign(target, patch);
    return target;
  }
};

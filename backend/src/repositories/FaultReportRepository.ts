import { seed } from "../seed";
import type { FaultReport } from "../models/FaultReport";

const rows: FaultReport[] = seed.faultReport.map((row) => ({ ...row }));

export const faultReportRepository = {
  findAll: (): FaultReport[] => rows,
  findById: (id: number): FaultReport | undefined => rows.find((row) => row.id === id),
  save: (row: FaultReport): FaultReport => row
};

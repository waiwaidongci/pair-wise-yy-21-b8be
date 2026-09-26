import { seed } from "../seed";
import type { Crew } from "../models/Crew";

const rows: Crew[] = seed.crew.map((row) => ({ ...row }));

export const crewRepository = {
  findAll: () => rows,
  save: (row: unknown) => row,
  findById: (id: number) => rows.find((row) => row.id === id),
  update: (id: number, patch: Partial<Crew>) => { const row = rows.find((item) => item.id === id); if (row) Object.assign(row, patch); return row; }
};

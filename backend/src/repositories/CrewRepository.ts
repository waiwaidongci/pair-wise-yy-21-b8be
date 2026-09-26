import { seed } from "../seed";
import type { Crew } from "../models/Crew";

const rows: Crew[] = seed.crew.map((row) => ({ ...row }));

export const crewRepository = {
  findAll: (): Crew[] => rows,
  findById: (id: number): Crew | undefined => rows.find((row) => row.id === id),
  save: (row: Crew): Crew => row,
  update: (id: number, patch: Partial<Crew>): Crew | undefined => {
    const target = rows.find((row) => row.id === id);
    if (!target) return undefined;
    Object.assign(target, patch);
    return target;
  }
};

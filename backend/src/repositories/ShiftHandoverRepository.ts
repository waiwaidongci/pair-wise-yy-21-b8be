import type { ShiftHandover } from "../models/ShiftHandover";

const rows: ShiftHandover[] = [];

export const shiftHandoverRepository = {
  findAll: () => rows,
  save: (row: Omit<ShiftHandover, "id">) => { const record: ShiftHandover = { ...row, id: rows.length + 1 }; rows.push(record); return record; }
};

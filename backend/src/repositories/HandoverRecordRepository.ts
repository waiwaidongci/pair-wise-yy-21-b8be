import { seed } from "../seed";
import type { HandoverRecord } from "../models/HandoverRecord";

const rows: HandoverRecord[] = seed.handoverRecord.map((row) => ({
  ...row,
  ticket_ids: [...row.ticket_ids],
  part_ids: [...row.part_ids],
  arrival_ids: [...row.arrival_ids],
  block_reasons: [...row.block_reasons]
}));

const nextId = () => rows.reduce((max, row) => Math.max(max, row.id), 0) + 1;

export const handoverRecordRepository = {
  findAll: (): HandoverRecord[] => [...rows].sort((a, b) => b.created_at.localeCompare(a.created_at)),
  findById: (id: number): HandoverRecord | undefined => rows.find((row) => row.id === id),
  insert: (record: Omit<HandoverRecord, "id">): HandoverRecord => {
    const saved: HandoverRecord = { ...record, id: nextId() };
    rows.push(saved);
    return saved;
  }
};

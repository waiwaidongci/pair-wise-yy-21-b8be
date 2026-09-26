// 交接必须原子完成：先对涉及的全部表做深拷贝快照，任一步失败即整体回滚，
// 保证“交接失败时原记录不能丢失”。
export interface HandoverSnapshot {
  crew: unknown[];
  repairTicket: unknown[];
  sparePartUsage: unknown[];
  arrivalRecord: unknown[];
}

export const takeSnapshot = (stores: { crew: unknown[]; repairTicket: unknown[]; sparePartUsage: unknown[]; arrivalRecord: unknown[] }): HandoverSnapshot =>
  ({
    crew: stores.crew.map((row) => structuredClone(row)),
    repairTicket: stores.repairTicket.map((row) => structuredClone(row)),
    sparePartUsage: stores.sparePartUsage.map((row) => structuredClone(row)),
    arrivalRecord: stores.arrivalRecord.map((row) => structuredClone(row))
  });

export const restoreSnapshot = (
  stores: { crew: unknown[]; repairTicket: unknown[]; sparePartUsage: unknown[]; arrivalRecord: unknown[] },
  snapshot: HandoverSnapshot
): void => {
  stores.crew.splice(0, stores.crew.length, ...snapshot.crew.map((row) => structuredClone(row)));
  stores.repairTicket.splice(0, stores.repairTicket.length, ...snapshot.repairTicket.map((row) => structuredClone(row)));
  stores.sparePartUsage.splice(0, stores.sparePartUsage.length, ...snapshot.sparePartUsage.map((row) => structuredClone(row)));
  stores.arrivalRecord.splice(0, stores.arrivalRecord.length, ...snapshot.arrivalRecord.map((row) => structuredClone(row)));
};

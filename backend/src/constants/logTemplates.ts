export const LOG_TEMPLATES = {
  GridAsset: ["GridAsset.create", "GridAsset.update", "GridAsset.status", "GridAsset.export"],
  FaultReport: ["FaultReport.create", "FaultReport.update", "FaultReport.status", "FaultReport.export"],
  RepairTicket: ["RepairTicket.create", "RepairTicket.update", "RepairTicket.status", "RepairTicket.export", "RepairTicket.handover"],
  Crew: ["Crew.create", "Crew.update", "Crew.status", "Crew.export", "Crew.release", "Crew.takeover"],
  SparePartUsage: ["SparePartUsage.create", "SparePartUsage.update", "SparePartUsage.status", "SparePartUsage.export", "SparePartUsage.transfer"],
  ArrivalRecord: ["ArrivalRecord.create", "ArrivalRecord.update", "ArrivalRecord.close", "ArrivalRecord.transfer"],
  HandoverRecord: ["HandoverRecord.preview", "HandoverRecord.execute", "HandoverRecord.blocked", "HandoverRecord.list"]
};

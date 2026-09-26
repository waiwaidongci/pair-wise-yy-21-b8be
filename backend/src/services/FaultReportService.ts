import { faultReportRepository } from "../repositories/FaultReportRepository";
import type { FaultReport } from "../models/FaultReport";
export const faultReportService = { list: () => faultReportRepository.findAll(), create: (row: FaultReport) => faultReportRepository.save(row) };

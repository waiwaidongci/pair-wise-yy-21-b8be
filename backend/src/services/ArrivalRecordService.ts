import { arrivalRecordRepository } from "../repositories/ArrivalRecordRepository";
import { LOG_TEMPLATES } from "../constants/logTemplates";

export const arrivalRecordService = {
  list: (crewId?: number) => {
    const rows = arrivalRecordRepository.findAll();
    return crewId ? rows.filter((row) => row.crew_id === crewId) : rows;
  },
  create: (row: unknown) => {
    console.info("audit", LOG_TEMPLATES.ArrivalRecord[0], row);
    return arrivalRecordRepository.save(row as never);
  }
};

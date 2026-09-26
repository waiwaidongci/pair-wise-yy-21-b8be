import { handoverService } from "./HandoverService";

// 交接记录的查询统一走 HandoverService，保证与执行逻辑同一数据源
export const handoverRecordService = {
  list: (crewId?: number) => handoverService.listRecords(crewId)
};

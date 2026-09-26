export const SparePartUsageStatus = ["PENDING","APPROVED","CONSUMED","RETURNED"] as const;
export type SparePartUsageStatus = (typeof SparePartUsageStatus)[number];
// 待领用：换班交接时随工单一起转到新班组的备件申请状态
export const PENDING_USAGE_STATUS = "PENDING";

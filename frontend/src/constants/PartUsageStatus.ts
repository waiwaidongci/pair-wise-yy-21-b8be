// 备件领用单状态（usage_status 枚举）
export const PartUsageStatus = ["PENDING_PICKUP", "PICKED_UP", "CONSUMED", "RETURNED", "REJECTED"] as const;
export type PartUsageStatus = (typeof PartUsageStatus)[number];

export const PartUsageStatusText: Record<PartUsageStatus, string> = {
  PENDING_PICKUP: "待领用",
  PICKED_UP: "已领用",
  CONSUMED: "已消耗",
  RETURNED: "已归还",
  REJECTED: "已驳回"
};

export const PART_PENDING_PICKUP = "PENDING_PICKUP" as PartUsageStatus;

export const FaultType = ["OUTAGE","VOLTAGE_LOW","TRIP","EQUIPMENT_DAMAGE","SAFETY_RISK"] as const;
export type FaultType = (typeof FaultType)[number];

// 故障类型 -> 所需班组技能标签（用于换班技能匹配校验）
export const FAULT_SKILL_REQUIREMENT: Record<FaultType, string> = {
  OUTAGE: "复电抢修",
  VOLTAGE_LOW: "低压运维",
  TRIP: "线路巡检",
  EQUIPMENT_DAMAGE: "设备检修",
  SAFETY_RISK: "应急处置"
};

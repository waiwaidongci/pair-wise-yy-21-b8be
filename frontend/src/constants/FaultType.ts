export const FaultType = ["OUTAGE","VOLTAGE_LOW","TRIP","EQUIPMENT_DAMAGE","SAFETY_RISK"] as const;
export type FaultType = (typeof FaultType)[number];
export const FaultTypeText: Record<FaultType, string> = {
  OUTAGE: "停电故障",
  VOLTAGE_LOW: "电压偏低",
  TRIP: "线路跳闸",
  EQUIPMENT_DAMAGE: "设备损坏",
  SAFETY_RISK: "安全隐患"
};

// 故障类型 -> 所需班组技能标签（换班技能匹配）
export const FAULT_SKILL_REQUIREMENT: Record<FaultType, string> = {
  OUTAGE: "复电抢修",
  VOLTAGE_LOW: "低压运维",
  TRIP: "线路巡检",
  EQUIPMENT_DAMAGE: "设备检修",
  SAFETY_RISK: "应急处置"
};

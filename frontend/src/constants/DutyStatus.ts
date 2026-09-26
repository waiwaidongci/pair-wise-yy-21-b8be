// 抢修班组值班状态（duty_status 枚举）
export const DutyStatus = ["ON_DUTY", "OFF_DUTY", "TRAINING", "LEAVE"] as const;
export type DutyStatus = (typeof DutyStatus)[number];

export const DutyStatusText: Record<DutyStatus, string> = {
  ON_DUTY: "在岗值班",
  OFF_DUTY: "离岗",
  TRAINING: "培训中",
  LEAVE: "请假"
};

export const AVAILABLE_DUTY_STATUS: DutyStatus[] = ["ON_DUTY"];

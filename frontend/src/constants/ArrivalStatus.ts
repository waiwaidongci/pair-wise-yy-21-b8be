// 到场记录状态
export const ArrivalStatus = ["OPEN", "CLOSED"] as const;
export type ArrivalStatus = (typeof ArrivalStatus)[number];

export const ArrivalStatusText: Record<ArrivalStatus, string> = {
  OPEN: "未闭环",
  CLOSED: "已闭环"
};

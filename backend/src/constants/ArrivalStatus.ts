// 到场记录状态（班组到达现场的签到/到场台账）
export const ArrivalStatus = ["OPEN", "CLOSED"] as const;
export type ArrivalStatus = (typeof ArrivalStatus)[number];

export const ArrivalStatusText: Record<ArrivalStatus, string> = {
  OPEN: "未闭环",
  CLOSED: "已闭环"
};

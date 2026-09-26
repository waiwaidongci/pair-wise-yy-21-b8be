// 换班交接结果状态
export const HandoverStatus = ["SUCCESS", "FAILED"] as const;
export type HandoverStatus = (typeof HandoverStatus)[number];

export const HandoverStatusText: Record<HandoverStatus, string> = {
  SUCCESS: "交接成功",
  FAILED: "交接失败"
};

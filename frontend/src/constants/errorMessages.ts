export const ERROR_MESSAGES = {
  AUTH_REQUIRED: "请先登录后再继续操作",
  RBAC_DENIED: "当前角色没有执行该动作的权限",
  VALIDATION_FAILED: "表单字段缺失或格式错误",
  RATE_LIMITED: "请求过于频繁，请稍后再试",
  HANDOVER_BLOCKED: "存在已到达现场的未完工任务，换班被阻断",
  HANDOVER_TARGET_INVALID: "所选接班班组不满足交接条件",
  HANDOVER_TICKET_NOT_FOUND: "抢修工单不存在",
  HANDOVER_CREW_NOT_FOUND: "班组不存在",
  HANDOVER_CONFLICT: "交接过程中数据状态发生变化，原记录已保留，请刷新重试"
} as const;

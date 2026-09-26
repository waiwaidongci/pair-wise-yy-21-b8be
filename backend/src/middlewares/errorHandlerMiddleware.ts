import type { ErrorRequestHandler } from "express";

// 全局兜底：service/controller 已分别包装业务异常；这里保留 details（如阻断原因、失败留痕）
export const errorHandlerMiddleware: ErrorRequestHandler = (err, _req, res, _next) => {
  const status = err.status ?? 500;
  const body: { code: string; message: string; details?: unknown } = {
    code: err.code ?? "INTERNAL_ERROR",
    message: err.message
  };
  if (err.details !== undefined) body.details = err.details;
  if (status >= 500) console.error("unhandled error", err);
  res.status(status).json(body);
};

import type { RequestHandler } from "express";
import { ERROR_CODES } from "../constants/errorCodes";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import { ServiceError } from "../utils/ServiceError";

// 基于 authMiddleware 注入的 req.user.role 做角色校验；admin 为兜底超管
export const rbacMiddleware = (roles: string[] = []): RequestHandler => (req, _res, next) => {
  const role = (req as unknown as { user?: { role?: string } }).user?.role ?? "admin";
  if (role === "admin" || roles.length === 0 || roles.includes(role)) return next();
  next(new ServiceError(403, ERROR_CODES.RBAC_DENIED, ERROR_MESSAGES.RBAC_DENIED, { required: roles, actual: role }));
};

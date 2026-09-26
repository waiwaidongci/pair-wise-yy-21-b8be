import type { NextFunction, Request, Response } from "express";
import { shiftHandoverService } from "../services/ShiftHandoverService";
import { ERROR_CODES } from "../constants/errorCodes";
import { ERROR_MESSAGES } from "../constants/errorMessages";

// controller 层再次包装异常，避免把未分类错误直接抛给全局中间件
const wrap = (err: unknown) => {
  if (err instanceof Error && !(err as { code?: string }).code) {
    return Object.assign(err, { status: 500, code: "INTERNAL_ERROR" });
  }
  return err;
};

export const shiftHandoverController = {
  list: (_req: Request, res: Response) => res.json(shiftHandoverService.list()),
  preview: (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(shiftHandoverService.preview(Number(req.query.team_id)));
    } catch (err) {
      next(wrap(err));
    }
  },
  create: (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as { user?: { id?: number } }).user ?? {};
      const body = req.body ?? {};
      if (body.from_team_id == null || body.to_team_id == null) {
        throw Object.assign(new Error(ERROR_MESSAGES.VALIDATION_FAILED), { status: 400, code: ERROR_CODES.VALIDATION_FAILED });
      }
      const record = shiftHandoverService.handover({ ...body, operator_id: user.id ?? 0 });
      res.status(201).json(record);
    } catch (err) {
      next(wrap(err));
    }
  }
};

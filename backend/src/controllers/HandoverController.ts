import type { Request, Response, NextFunction } from "express";
import { handoverService } from "../services/HandoverService";
import { ERROR_CODES } from "../constants/errorCodes";
import { ServiceError } from "../utils/ServiceError";

// controller 层二次包装异常：service 抛业务错，controller 兜底未知错，禁止全局吞掉
const wrap = (handler: (req: Request, res: Response) => unknown) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    await handler(req, res);
  } catch (error) {
    if (error instanceof ServiceError) return next(error);
    next(new ServiceError(500, ERROR_CODES.HANDOVER_CONFLICT, "handover controller failed", { cause: String(error) }));
  }
};

export const handoverController = {
  preview: wrap((req, res) => {
    const fromCrewId = Number(req.query.from_crew_id);
    if (!Number.isInteger(fromCrewId)) {
      throw new ServiceError(400, ERROR_CODES.VALIDATION_FAILED, "from_crew_id required");
    }
    res.json(handoverService.preview(fromCrewId));
  }),
  execute: wrap((req, res) => {
    const record = handoverService.execute(req.body ?? {});
    res.status(201).json(record);
  })
};

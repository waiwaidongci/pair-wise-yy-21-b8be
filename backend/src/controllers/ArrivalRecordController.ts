import type { Request, Response } from "express";
import { arrivalRecordService } from "../services/ArrivalRecordService";

export const arrivalRecordController = {
  list: (req: Request, res: Response) => {
    const crewId = req.query.crew_id ? Number(req.query.crew_id) : undefined;
    res.json(arrivalRecordService.list(crewId));
  },
  create: (req: Request, res: Response) => res.status(201).json(arrivalRecordService.create(req.body))
};

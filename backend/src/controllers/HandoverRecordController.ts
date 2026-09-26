import type { Request, Response } from "express";
import { handoverRecordService } from "../services/HandoverRecordService";

export const handoverRecordController = {
  list: (req: Request, res: Response) => {
    const crewId = req.query.crew_id ? Number(req.query.crew_id) : undefined;
    res.json(handoverRecordService.list(crewId));
  }
};

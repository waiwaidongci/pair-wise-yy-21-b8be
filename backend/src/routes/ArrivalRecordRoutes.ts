import { Router } from "express";
import { arrivalRecordController } from "../controllers/ArrivalRecordController";

const router = Router();

router.get("/", arrivalRecordController.list);
router.post("/", arrivalRecordController.create);

export default router;

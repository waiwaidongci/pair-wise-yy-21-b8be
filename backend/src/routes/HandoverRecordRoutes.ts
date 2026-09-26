import { Router } from "express";
import { handoverRecordController } from "../controllers/HandoverRecordController";
import { rbacMiddleware } from "../middlewares/rbacMiddleware";

const router = Router();

// 交接留痕查询：调度员、班组长、审计员可查
router.get("/", rbacMiddleware(["DISPATCHER", "LEADER", "AUDITOR"]), handoverRecordController.list);

export default router;

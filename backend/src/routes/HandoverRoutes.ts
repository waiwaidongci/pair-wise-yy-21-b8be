import { Router } from "express";
import { handoverController } from "../controllers/HandoverController";
import { rbacMiddleware } from "../middlewares/rbacMiddleware";

const router = Router();

// 预览候选接班班组与阻断原因：班组长、调度员可查
router.get("/preview", rbacMiddleware(["DISPATCHER", "LEADER"]), handoverController.preview);
// 执行换班交接：仅调度员/班组长
router.post("/execute", rbacMiddleware(["DISPATCHER", "LEADER"]), handoverController.execute);

export default router;

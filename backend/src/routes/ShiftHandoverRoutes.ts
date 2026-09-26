import { Router } from "express";
import { shiftHandoverController } from "../controllers/ShiftHandoverController";

const router = Router();
router.get("/", shiftHandoverController.list);
router.get("/preview", shiftHandoverController.preview);
router.post("/", shiftHandoverController.create);
export default router;

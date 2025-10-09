import { Router } from "express";
import * as authController from "../controller/auth.controller";
import { authenticate } from "../middleware/auth.middleware";

const router: Router = Router();

router.post("/google", authController.googleAuth);
router.get("/me", authenticate, authController.getMe);

export default router;

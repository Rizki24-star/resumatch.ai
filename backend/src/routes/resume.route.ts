import { Router } from "express";
import * as resumeController from "../controller/resume.controller";
import multer from "multer";

const router: Router = Router();

// setup multer
const upload = multer({ dest: "uploads/" });

router.get("/:userId", resumeController.getResumes);
router.post(
  "/analyze",
  upload.single("resume"),
  resumeController.createAnalyis
);
router.post("/:id", resumeController.getResumeById);

export default router;

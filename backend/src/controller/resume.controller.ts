import { Request, Response } from "express";
import Resume from "../models/Resume";
import { analyzeResume } from "../services/ai.service";
import { extractTextFromPDF } from "../utils/pdf";
import { uploadPDF } from "../services/storage.service";
import path from "path";
import fs from "fs/promises";

declare module "express" {
  interface Request {
    user?: {
      id: string;
      tenantId: string;
    };
  }
}

export const createAnalyis = async (req: Request, res: Response) => {
  try {
    const { companyName, jobTitle, jobDescription, user_id, tenant_id } =
      req.body;

    console.log("Request analysis: ", req.body);

    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "Resume file required" });
    }

    const absolutePath = path.resolve(file.path);
    console.log("Processing file:", absolutePath);
    const resumeText = await extractTextFromPDF(absolutePath);
    const { pdfUrl: resumePath, thumbnailUrl: imagePath } = await uploadPDF(
      absolutePath
    );
    // const resumePath = await uploadFile(absolutePath, "resumes", false);
    // const imagePath = await uploadFile(absolutePath, "images", false);

    await fs.unlink(absolutePath);
    console.log("Temp file deleted");

    const { feedback, metadata } = await analyzeResume({
      resumeText,
      jobTitle,
      jobDescription,
    });

    const resume = new Resume({
      userId: user_id,
      tenantId: tenant_id,
      companyName,
      jobTitle,
      jobDescription,
      resumePath,
      imagePath,
      feedback,
      ...metadata,
    });

    await resume.save();

    res.json({
      success: true,
      data: {
        id: resume._id,
        feedback: resume.feedback,
      },
    });
  } catch (error: any) {
    console.error("Analysis failed:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const getResumes = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    console.log("Params : ", userId);
    console.log("Getting resume by id", req.body);
    const resumes = await Resume.find({ userId }).sort({ createdAt: -1 });

    res.json({ succes: true, data: resumes });
  } catch (error: any) {
    console.error("Failed get resume by id: ", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getResumeById = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.body;
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: user_id,
    });

    if (!resume) {
      return res.status(404).json({ error: "Resume not found" });
    }

    res.json({ succes: true, data: resume });
  } catch (error: any) {
    console.error("Failed get resume by id: ", error);
    res.status(500).json({ error: error.message });
  }
};

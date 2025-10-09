import { pdf } from "pdf-parse";
import fs from "fs/promises";
import "../config/cloudinary";

export async function extractTextFromPDF(filePath: string): Promise<string> {
  const dataBuffer = await fs.readFile(filePath);
  const data = await pdf(dataBuffer);
  return data.text.trim();
}

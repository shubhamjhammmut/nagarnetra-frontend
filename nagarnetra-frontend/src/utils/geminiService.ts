// src/utils/geminiService.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

// ✅ Fail fast if API key is missing
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
if (!API_KEY) {
  throw new Error("VITE_GEMINI_API_KEY is missing. Check your .env file.");
}

const genAI = new GoogleGenerativeAI(API_KEY);

export interface CivicIssueResult {
  issueType:
    | "Pothole"
    | "Garbage Accumulation"
    | "Broken Streetlight"
    | "Water Logging"
    | "Damaged Road"
    | "Open Drain"
    | "Fallen Tree"
    | "Construction Debris"
    | "Other";
  severityScore: number;
  analysis: string;
  confidence: number;
}

export async function analyzeIssueWithGemini(
  file: File
): Promise<CivicIssueResult | null> {
  // ✅ Validate file early
  if (!file || !file.type.startsWith("image/")) {
    console.error("Invalid file type:", file?.type);
    return null;
  }

  // ✅ Controlled model (NO randomness)
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
      temperature: 0,
      topK: 1,
      topP: 1,
      maxOutputTokens: 300,
    },
  });

  // ✅ Safe base64 conversion
  const fileToGenerativePart = async (file: File) => {
    const base64Data = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    const base64 = base64Data.split(",")[1];
    if (!base64) {
      throw new Error("Failed to extract base64 image data");
    }

    return {
      inlineData: {
        data: base64,
        mimeType: file.type,
      },
    };
  };

  let imagePart;
  try {
    imagePart = await fileToGenerativePart(file);
  } catch (err) {
    console.error("Image processing error:", err);
    return null;
  }

  // ✅ STRICT & CLOSED prompt (no hallucination)
  const prompt = `
You are an AI for an Indian civic issue reporting system.

From the image, identify EXACTLY ONE issue type from this list:
- Pothole
- Garbage Accumulation
- Broken Streetlight
- Water Logging
- Damaged Road
- Open Drain
- Fallen Tree
- Construction Debris
- Other

Rules:
- Base your answer ONLY on visible evidence.
- If image is unclear, choose "Other".
- Severity score: 1 (minor) to 10 (critical public risk).
- Confidence: 0.0 to 1.0 based on visual clarity.

Respond ONLY with valid JSON.
No markdown. No explanation.

JSON format:
{
  "issueType": "string",
  "severityScore": number,
  "analysis": "short factual description",
  "confidence": number
}
`;

  let rawText = "";
  try {
    const result = await model.generateContent([prompt, imagePart]);
    rawText = result.response.text().trim();
  } catch (err) {
    console.error("Gemini API error:", err);
    return null;
  }

  // ✅ HARD JSON parsing (no regex hacks)
  try {
    const parsed = JSON.parse(rawText);

    // ✅ Final validation
    if (
      typeof parsed.issueType !== "string" ||
      typeof parsed.severityScore !== "number" ||
      typeof parsed.analysis !== "string" ||
      typeof parsed.confidence !== "number"
    ) {
      console.error("Invalid Gemini JSON structure:", parsed);
      return null;
    }

    return parsed as CivicIssueResult;
  } catch (err) {
    console.error("Failed to parse Gemini JSON:", rawText);
    return null;
  }
}

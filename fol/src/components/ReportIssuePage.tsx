import { useState } from "react";
import {
  Upload,
  CheckCircle,
  AlertCircle,
  ThumbsUp,
} from "lucide-react";
import { GoogleMapsPicker } from "./GoogleMapsPicker";
import { calculateUrgency } from "../utils/urgencyCalculator";
import { addIssue } from "../firebase/issueService";
import DetectionCanvas from "./DetectionCanvas";
import { analyzeIssueWithAI } from "../services/aiService";
import { getAuth } from "firebase/auth";

/* ================= UTILS ================= */

const severityStyles: Record<string, string> = {
  Low: "bg-green-100 text-green-700 border-green-300",
  Medium: "bg-yellow-100 text-yellow-700 border-yellow-300",
  High: "bg-red-100 text-red-700 border-red-300",
  Critical: "bg-red-200 text-red-800 border-red-400",
};

const severityEmoji: Record<string, string> = {
  Low: "🟢",
  Medium: "🟡",
  High: "🔴",
  Critical: "🚨",
};

/* ================= TYPES ================= */

interface User {
  id: string;
  email: string;
  name: string;
  role: "citizen" | "admin";
}

interface ReportIssuePageProps {
  user: User;
}

/* ================= COMPONENT ================= */

export function ReportIssuePage({ user }: ReportIssuePageProps) {
  /* ---------- STATE ---------- */

  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAnalyzed, setIsAnalyzed] = useState(false);

  const [detectedIssue, setDetectedIssue] = useState("");
  const [detections, setDetections] = useState<any[]>([]);

  const [aiDescription, setAiDescription] = useState("");
  const [aiWhyMatters, setAiWhyMatters] = useState("");
  const [severityLevel, setSeverityLevel] = useState("Low");

  const [urgencyLevel, setUrgencyLevel] = useState("");
  const [urgencyScore, setUrgencyScore] = useState(0);

  const [duplicateIssue, setDuplicateIssue] = useState<any>(null);
  const [voteCount, setVoteCount] = useState<number | null>(null);

  const [location, setLocation] = useState({
    address: "",
    latitude: 0,
    longitude: 0,
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* =====================================================
     STEP 1️⃣ IMAGE UPLOAD → DETECTION BACKEND
     ===================================================== */

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedImage(file);
    setPreviewUrl(URL.createObjectURL(file));

    setIsAnalyzing(true);
    setIsAnalyzed(false);
    setDuplicateIssue(null);
    setVoteCount(null);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch("http://localhost:8000/detect", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Detection failed");

      const data = await res.json();

      setDetections(data.detections || []);
      setDetectedIssue(data.primary_issue || "Civic Issue");

      setAiDescription(data.ai?.description_en || "");
      setAiWhyMatters(data.ai?.why_it_matters || "");
      setSeverityLevel(data.ai?.severity_level || "Low");

      setIsAnalyzed(true);
    } catch (err) {
      console.error(err);
      alert("AI detection failed");
    } finally {
      setIsAnalyzing(false);
    }
  };

  /* =====================================================
     STEP 2️⃣ LOCATION → URGENCY + DUPLICATE
     ===================================================== */

  const handleLocationSelect = async (loc: {
    address: string;
    latitude: number;
    longitude: number;
  }) => {
    setLocation(loc);

    if (!uploadedImage || !detectedIssue) return;

    const urgency = await calculateUrgency({
      issueType: detectedIssue,
      location: loc.address,
      description: aiDescription,
      imageAnalysis: aiDescription,
    });

    setUrgencyLevel(urgency.level);
    setUrgencyScore(urgency.score);

    try {
      const formData = new FormData();
      formData.append("image", uploadedImage);
      formData.append("latitude", loc.latitude.toString());
      formData.append("longitude", loc.longitude.toString());

      const res = await fetch("http://localhost:8000/detect", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.duplicate) {
        setDuplicateIssue(data.duplicate);
        setVoteCount(data.duplicate.reportCount);
      } else {
        setDuplicateIssue(null);
        setVoteCount(1);
      }
    } catch (err) {
      console.error("Duplicate check failed", err);
    }
  };

  /* =====================================================
     STEP 3️⃣ SUBMIT → GEMINI + FIRESTORE
     ===================================================== */

  const handleSubmit = async () => {
    const auth = getAuth();
    const firebaseUser = auth.currentUser;

    if (!firebaseUser) {
      alert("Please log in to submit an issue");
      return;
    }

    if (!uploadedImage) return;

    try {
      setIsSubmitting(true);

      const auth = getAuth();
      const firebaseUser = auth.currentUser;

      if (!firebaseUser) {
        throw new Error("User not authenticated");
      }

      const aiData = await analyzeIssueWithAI(uploadedImage);

      await addIssue({
        issueType:
          aiData.issueType ??
          detectedIssue ??
          "Civic Issue",

        description:
          aiDescription ??
          aiData.description ??
          "No description provided",

        urgencyScore:
          urgencyScore > 0
            ? urgencyScore
            : aiData.urgencyScore ?? 1,

        aiAnalysis:
          aiData.aiAnalysis ??
          "AI analysis unavailable",

        latitude:
          location.latitude ?? 0,

        longitude:
          location.longitude ?? 0,

        userEmail:
          firebaseUser.email ?? "unknown",

        status: "open",
      });


      setIsSubmitted(true);

    } catch (error) {
      console.error("Issue submission failed:", error);
      alert("Failed to submit issue");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* =====================================================
     UI
     ===================================================== */

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {isSubmitted ? (
          <div className="bg-white rounded-xl p-8 text-center shadow">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h2 className="text-green-700 text-lg font-semibold">
              Issue Reported Successfully!
            </h2>
          </div>
        ) : (
          <div className="bg-white rounded-xl p-8 space-y-6 shadow">

            {!previewUrl ? (
              <label className="border-2 border-dashed p-12 block text-center cursor-pointer rounded-lg hover:bg-gray-50">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Upload className="mx-auto mb-3" />
                Upload Image
              </label>
            ) : (
              <DetectionCanvas
                imageUrl={previewUrl}
                detections={detections}
              />
            )}

            {isAnalyzed && (
              <div className="border rounded-xl p-5 space-y-4 bg-gray-50">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">
                    🏙️ {detectedIssue}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs border ${severityStyles[severityLevel]}`}
                  >
                    {severityEmoji[severityLevel]} {severityLevel}
                  </span>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm font-semibold text-blue-800 mb-1">
                    🤖 Why this matters
                  </p>
                  <p className="text-sm text-blue-700">
                    {aiWhyMatters}
                  </p>
                </div>

                <textarea
                  value={aiDescription}
                  onChange={(e) => setAiDescription(e.target.value)}
                  rows={4}
                  className="w-full border rounded-lg p-3 text-sm"
                />
              </div>
            )}

            {duplicateIssue && (
              <div className="border border-yellow-300 bg-yellow-50 p-3 rounded">
                <AlertCircle className="inline w-4 h-4 mr-2 text-yellow-600" />
                Similar issue reported nearby (
                {duplicateIssue.reportCount} reports)
              </div>
            )}

            {voteCount !== null && (
              <div className="flex items-center gap-3">
                <ThumbsUp />
                <span>{voteCount} citizens support this issue</span>
              </div>
            )}

            {isAnalyzed && (
              <GoogleMapsPicker onLocationSelect={handleLocationSelect} />
            )}

            {urgencyLevel && (
              <div className="border p-3 rounded bg-gray-50">
                <strong>Urgency:</strong> {urgencyLevel} (Score: {urgencyScore})
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !urgencyLevel}
              className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg"
            >
              {isSubmitting ? "Submitting..." : "Submit Issue"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

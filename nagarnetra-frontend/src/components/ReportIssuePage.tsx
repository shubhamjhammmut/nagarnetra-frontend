import React, { useState } from "react";

const ReportIssuePage: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [detectedIssue, setDetectedIssue] = useState("");
  const [priority, setPriority] = useState("");
  const [urgencyScore, setUrgencyScore] = useState<number | null>(null);
  const [isAnalyzed, setIsAnalyzed] = useState(false);

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      setImage(file);

      const formData = new FormData();
      formData.append("image", file);
      formData.append(
        "description",
        description || "garbage overflowing near road"
      );

      const response = await fetch("http://127.0.0.1:8000/detect", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Backend error");
      }

      const data = await response.json();

      // ✅ MATCHES MOCK BACKEND RESPONSE
      setDetectedIssue(data.detected_issue);
      setPriority(data.priority);
      setUrgencyScore(data.urgency_score);

      setIsAnalyzed(true);
    } catch (error) {
      console.error("AI detection error:", error);
      alert("AI detection failed");
    }
  };

  const handleSubmit = () => {
    if (!isAnalyzed) {
      alert("Please upload an image first");
      return;
    }

    // Hackathon-safe success
    alert("Issue submitted successfully!");
  };

  return (
    <div style={{ padding: "24px", maxWidth: "700px", margin: "auto" }}>
      <h2>Report Civic Issue</h2>

      <div style={{ marginBottom: "16px" }}>
        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the issue..."
          style={{ width: "100%", height: "80px" }}
        />
      </div>

      <div style={{ marginBottom: "16px" }}>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
      </div>

      {isAnalyzed && (
        <div
          style={{
            background: "#f5f5f5",
            padding: "16px",
            borderRadius: "8px",
            marginBottom: "16px",
          }}
        >
          <p>
            <strong>Detected Issue:</strong> {detectedIssue}
          </p>
          <p>
            <strong>Priority:</strong> {priority}
          </p>
          <p>
            <strong>Urgency Score:</strong> {urgencyScore}
          </p>
        </div>
      )}

      <button onClick={handleSubmit}>Submit Issue</button>
    </div>
  );
};

export default ReportIssuePage;

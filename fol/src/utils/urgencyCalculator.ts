type UrgencyInput = {
  issueType: string;
  location: string;
  description: string;
  imageAnalysis: string;
};

type UrgencyResult = {
  score: number;
  level: "Low" | "Medium" | "High" | "Critical";
  analysis: string;
};

export async function calculateUrgency(
  data: UrgencyInput
): Promise<UrgencyResult> {
  try {
    const res = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" +
        import.meta.env.VITE_GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `
You are an AI Municipal Officer in India.

Assess urgency for this civic issue.

Issue: ${data.issueType}
Location: ${data.location}
Image Analysis: ${data.imageAnalysis}

Rules:
- Life threatening → score 8–10 → Critical
- Major disruption → score 6–7 → High
- Moderate issue → score 4–5 → Medium
- Minor issue → score 1–3 → Low

Respond ONLY in valid JSON:
{
  "score": number,
  "level": "Low" | "Medium" | "High" | "Critical",
  "analysis": "short explanation"
}
`,
                },
              ],
            },
          ],
        }),
      }
    );

    const json = await res.json();
    const text =
      json?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) throw new Error("Empty AI response");

    const parsed = JSON.parse(text);

    return {
      score: parsed.score,
      level: parsed.level,
      analysis: parsed.analysis,
    };
  } catch (err) {
    console.error("Urgency AI failed:", err);

    // 🛟 SAFE fallback (never crash UI)
    return {
      score: 5,
      level: "Medium",
      analysis: "Fallback urgency due to AI error.",
    };
  }
}

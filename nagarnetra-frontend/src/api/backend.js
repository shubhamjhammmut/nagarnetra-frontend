const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000";

export async function detectIssue(description) {
  const res = await fetch(`${BASE_URL}/detect`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ description })
  });

  if (!res.ok) throw new Error("Backend error");
  return res.json();
}

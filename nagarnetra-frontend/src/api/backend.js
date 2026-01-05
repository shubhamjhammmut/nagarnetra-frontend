const BASE_URL = import.meta.env.VITE_BACKEND_URL || "https://nagarnetra-backend-production.up.railway.app/";

export async function detectIssue(description) {
  const res = await fetch(`${BASE_URL}/detect`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ description })
  });

  if (!res.ok) throw new Error("Backend error");
  return res.json();
}

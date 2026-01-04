import { getAuth } from "firebase/auth";

export async function analyzeIssueWithAI(imageFile) {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User not authenticated");
  }

  // 🔥 FORCE fresh token (fixes 401)
  const token = await user.getIdToken(true);

  const formData = new FormData();
  formData.append("image", imageFile);

  const response = await fetch(
    `${import.meta.env.VITE_AI_BACKEND_URL}/analyze-issue`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error("AI analysis failed");
  }

  return response.json();
}

import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

/* =====================================================
   ADD NEW ISSUE (FROM ReportIssuePage)
   ===================================================== */
export async function addIssue(issue) {
  // 🔥 SANITIZE ALL FIELDS (Firestore-safe)
  const sanitizedIssue = {
    issueType: issue.issueType ?? "Civic Issue",
    description: issue.description ?? "No description provided",
    urgencyScore:
      typeof issue.urgencyScore === "number"
        ? issue.urgencyScore
        : 1,
    aiAnalysis: issue.aiAnalysis ?? "",
    latitude:
      typeof issue.latitude === "number"
        ? issue.latitude
        : 0,
    longitude:
      typeof issue.longitude === "number"
        ? issue.longitude
        : 0,
    userEmail: issue.userEmail ?? "unknown",
    status: issue.status ?? "open",
    createdAt: serverTimestamp(),
  };

  return await addDoc(collection(db, "issues"), sanitizedIssue);
}

/* =====================================================
   GET ALL ISSUES (ADMIN / MAP / HEATMAP)
   ===================================================== */
export const getAllIssues = async () => {
  try {
    const q = query(
      collection(db, "issues"),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("❌ Error fetching issues:", error);
    throw error;
  }
};

/* =====================================================
   GET USER ISSUES (TrackIssuesPage)
   ===================================================== */
export const getUserIssues = async (userEmail) => {
  try {
    const q = query(
      collection(db, "issues"),
      where("userEmail", "==", userEmail), // ✅ NOW MATCHES
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("❌ Error fetching user issues:", error);
    throw error;
  }
};

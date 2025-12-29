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
export const addIssue = async ({
  title,
  description,
  latitude,
  longitude,
  urgency,
  urgencyScore,
  aiAnalysis,
  votes,
  status,
  userEmail,
}) => {
  try {
    const docRef = await addDoc(collection(db, "issues"), {
      // 🔑 CORE FIELDS
      issueType: title,
      description,
      latitude,
      longitude,

      // 🔥 AI + PRIORITY
      urgency,
      urgencyScore,
      aiAnalysis,

      // 🔥 TRACKING
      votes: votes ?? 1,
      status: status ?? "open",

      // ✅ IMPORTANT: SAVE BOTH
      createdBy: userEmail,   // used internally
      userEmail: userEmail,   // used by TrackIssuesPage

      // ⏱ TIMESTAMPS
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return docRef.id;
  } catch (error) {
    console.error("❌ Error adding issue:", error);
    throw error;
  }
};

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

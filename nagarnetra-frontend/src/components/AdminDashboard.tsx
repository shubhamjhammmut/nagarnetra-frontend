import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  List,
  AlertTriangle,
  Users,
} from "lucide-react";

import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase/firebase";

type TabType = "dashboard" | "issues";

interface Reporter {
  name: string;
  email: string;
  reportedDate: string;
}

interface IssueData {
  id: string;
  category: string;
  latitude?: number;
  longitude?: number;
  urgency: "Low" | "Medium" | "High" | "Critical";
  urgencyScore: number;
  status: "Issue Raised" | "Authorities Contacted" | "Issue Resolved";
  reportedDate: string;
  reporters: Reporter[];
  aiAnalysis?: string;
}

/* ---------------- HELPERS ---------------- */

const mapSeverityToUrgency = (severity: number) => {
  if (severity >= 8) return "Critical";
  if (severity >= 6) return "High";
  if (severity >= 4) return "Medium";
  return "Low";
};

const mapStatus = (status: string) => {
  if (status === "resolved") return "Issue Resolved";
  if (status === "in_progress") return "Authorities Contacted";
  return "Issue Raised";
};

/* ---------------- COMPONENT ---------------- */

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [selectedIssue, setSelectedIssue] = useState<IssueData | null>(null);
  const [issues, setIssues] = useState<IssueData[]>([]);

  /* ---------- REAL-TIME FIRESTORE ---------- */
  useEffect(() => {
    const q = query(
      collection(db, "issues"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: IssueData[] = snapshot.docs.map((docSnap) => {
        const d = docSnap.data();
        const votes = d.votes || 1;

        return {
          id: docSnap.id,
          category: d.issueType || "Unknown",
          latitude: d.latitude,
          longitude: d.longitude,
          urgency: mapSeverityToUrgency(d.severity || 4),
          urgencyScore: (d.severity || 4) * 10,
          status: mapStatus(d.status || "open"),
          reportedDate: d.createdAt?.toDate().toDateString() || "",
          reporters: Array(votes).fill({
            name: "Citizen",
            email: "",
            reportedDate: "",
          }),
          aiAnalysis: d.severity
            ? `AI detected severity ${d.severity}/10`
            : "",
        };
      });

      setIssues(data);
    });

    return () => unsubscribe();
  }, []);

  /* ---------- STATUS UPDATE ---------- */
  const updateStatus = async (id: string, status: string) => {
    await updateDoc(doc(db, "issues", id), {
      status:
        status === "Issue Resolved"
          ? "resolved"
          : status === "Authorities Contacted"
          ? "in_progress"
          : "open",
      updatedAt: new Date(),
    });

    setSelectedIssue(null);
  };

  /* ---------- STATS ---------- */
  const stats = {
    total: issues.length,
    pending: issues.filter((i) => i.status === "Issue Raised").length,
    inProgress: issues.filter(
      (i) => i.status === "Authorities Contacted"
    ).length,
    resolved: issues.filter(
      (i) => i.status === "Issue Resolved"
    ).length,
    criticalHigh: issues.filter(
      (i) => i.urgency === "Critical" || i.urgency === "High"
    ).length,
    duplicates: issues.filter(
      (i) => i.reporters.length > 1
    ).length,
  };

  /* ---------- DASHBOARD ---------- */
  const renderDashboard = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white p-6 rounded">
        Total Issues: {stats.total}
      </div>
      <div className="bg-white p-6 rounded">
        Pending: {stats.pending}
      </div>
      <div className="bg-white p-6 rounded">
        Critical / High: {stats.criticalHigh}
      </div>
      <div className="bg-white p-6 rounded">
        Multi-Reporter: {stats.duplicates}
      </div>
    </div>
  );

  /* ---------- ISSUES TABLE ---------- */
  const renderIssues = () => (
    <div className="bg-white rounded shadow">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="p-3 text-left">Issue</th>
            <th className="p-3">Urgency</th>
            <th className="p-3">Reports</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {issues.map((issue) => (
            <tr key={issue.id} className="border-b">
              <td className="p-3">{issue.category}</td>
              <td className="p-3">{issue.urgency}</td>
              <td className="p-3">{issue.reporters.length}</td>
              <td className="p-3">
                <button
                  onClick={() => setSelectedIssue(issue)}
                  className="text-blue-600"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  /* ---------- MAIN ---------- */
  return (
    <div className="p-6">
      <div className="flex gap-3 mb-6">
        <button onClick={() => setActiveTab("dashboard")}>
          Overview
        </button>
        <button onClick={() => setActiveTab("issues")}>
          Issues
        </button>
      </div>

      {activeTab === "dashboard" && renderDashboard()}
      {activeTab === "issues" && renderIssues()}

      {/* ---------- MODAL ---------- */}
      {selectedIssue && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-[420px]">
            <h2 className="mb-2">{selectedIssue.category}</h2>
            <p className="text-sm mb-3">
              {selectedIssue.aiAnalysis}
            </p>

            <select
              className="w-full border p-2 mb-3"
              defaultValue={selectedIssue.status}
              onChange={(e) =>
                updateStatus(selectedIssue.id, e.target.value)
              }
            >
              <option>Issue Raised</option>
              <option>Authorities Contacted</option>
              <option>Issue Resolved</option>
            </select>
           <a
  href={`https://nagarnetra-backend-production.up.railway.app/admin/issue/${selectedIssue.id}/pdf`}
  target="_blank"
  rel="noopener noreferrer"
  className="block w-full text-center bg-green-600 text-white py-2 rounded mb-3 hover:bg-green-700"
>
  Download Municipal PDF
</a>
            <button
              onClick={() => setSelectedIssue(null)}
              className="w-full bg-gray-200 py-2"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

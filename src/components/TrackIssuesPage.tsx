import { Search, MapPin, Clock, User } from "lucide-react";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase/firebase";

/* ================= TYPES ================= */

interface Issue {
  id: string;
  image: string;
  title: string;
  location: string;
  status: "Pending" | "In Progress" | "Resolved";
  urgency: "Low" | "Medium" | "High" | "Critical";
  date: string;
  reportedBy: string;
  ai?: {
    description_en?: string;
    description_hi?: string;
    why_it_matters?: string;
    severity_level?: string;
  };
}

interface TrackIssuesPageProps {
  userEmail?: string;
  userRole?: "citizen" | "admin";
}

/* ================= UI HELPERS ================= */

const statusColor = (status: string) => {
  switch (status) {
    case "Resolved":
      return "bg-green-100 text-green-700 border-green-300";
    case "In Progress":
      return "bg-yellow-100 text-yellow-700 border-yellow-300";
    default:
      return "bg-red-100 text-red-700 border-red-300";
  }
};

const severityColor = (severity: string) => {
  switch (severity) {
    case "Critical":
      return "bg-red-600 text-white";
    case "High":
      return "bg-red-500 text-white";
    case "Medium":
      return "bg-yellow-400 text-black";
    case "Low":
      return "bg-green-500 text-white";
    default:
      return "bg-gray-400 text-white";
  }
};

/* ================= COMPONENT ================= */

export function TrackIssuesPage({
  userEmail,
  userRole = "citizen",
}: TrackIssuesPageProps) {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [lang, setLang] = useState<"en" | "hi">("en");

  /* 🔄 REAL-TIME FIRESTORE */
  useEffect(() => {
    let q: any = collection(db, "issues");

    if (userRole === "citizen" && userEmail) {
      q = query(q, where("userEmail", "==", userEmail));
    }

    const unsub = onSnapshot(q, (snapshot) => {
      const fetched: Issue[] = snapshot.docs.map((doc) => {
        const d = doc.data();

        return {
          id: doc.id,
          image: d.imageUrl || "",
          title: d.title || d.issueType || "Civic Issue",
          location:
            d.address ||
            (d.latitude && d.longitude
              ? `${d.latitude}, ${d.longitude}`
              : "Location not available"),
          status:
            d.status === "resolved"
              ? "Resolved"
              : d.status === "in_progress"
              ? "In Progress"
              : "Pending",
          urgency: d.ai?.severity_level || d.urgency || "Low",
          date: d.createdAt?.seconds
            ? new Date(d.createdAt.seconds * 1000).toLocaleDateString()
            : "N/A",
          reportedBy: d.userEmail || "Unknown",
          ai: d.ai,
        };
      });

      setIssues(fetched);
    });

    return () => unsub();
  }, [userEmail, userRole]);

  /* 🔍 FILTER */
  const filteredIssues = issues.filter((i) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      i.title.toLowerCase().includes(q) ||
      i.location.toLowerCase().includes(q);
    const matchStatus =
      statusFilter === "All" || i.status === statusFilter;
    return matchSearch && matchStatus;
  });

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-xl font-semibold">
              {userRole === "citizen"
                ? "My Reported Issues"
                : "All Civic Issues"}
            </h1>
            <p className="text-gray-600 text-sm">
              Real-time updates from authorities
            </p>
          </div>

          {/* 🌐 LANGUAGE TOGGLE */}
          <div className="flex gap-2">
            <button
              onClick={() => setLang("en")}
              className={`px-3 py-1 rounded ${
                lang === "en"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLang("hi")}
              className={`px-3 py-1 rounded ${
                lang === "hi"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              Hinglish
            </button>
          </div>
        </div>

        {/* FILTERS */}
        <div className="bg-white rounded-xl p-5 mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative w-full flex items-center">
          {/* Icon: Added pointer-events-none so it doesn't block clicks */}
          <Search 
            className="absolute left-3 w-5 h-5 text-gray-400 pointer-events-none" 
          />
          
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search issue or location"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

          <select
            className="border rounded-lg px-3 py-2"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIssues.map((issue) => (
            <div
              key={issue.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              {issue.image && (
                <img
                  src={issue.image}
                  className="h-44 w-full object-cover"
                />
              )}

              <div className="p-5 space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">{issue.title}</h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${severityColor(
                      issue.urgency
                    )}`}
                  >
                    {issue.urgency}
                  </span>
                </div>

                <span
                  className={`inline-block text-xs px-3 py-1 rounded-full border ${statusColor(
                    issue.status
                  )}`}
                >
                  {issue.status}
                </span>

                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex gap-2 items-center">
                    <MapPin className="w-4 h-4" />
                    {issue.location}
                  </div>
                  <div className="flex gap-2 items-center">
                    <Clock className="w-4 h-4" />
                    {issue.date}
                  </div>
                  {userRole === "admin" && (
                    <div className="flex gap-2 items-center">
                      <User className="w-4 h-4" />
                      {issue.reportedBy}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setSelectedIssue(issue)}
                  className="w-full border border-blue-600 text-blue-600 rounded-lg py-2"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredIssues.length === 0 && (
          <p className="text-center text-gray-500 mt-10">
            No issues found.
          </p>
        )}
      </div>

      {/* DETAILS MODAL */}
      <Dialog open={!!selectedIssue} onOpenChange={() => setSelectedIssue(null)}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Issue Details</DialogTitle>
          </DialogHeader>

          {selectedIssue && (
            <div className="space-y-4">
              {selectedIssue.image && (
                <img
                  src={selectedIssue.image}
                  className="w-full h-60 object-cover rounded-lg"
                />
              )}

              <h3 className="font-semibold text-lg">
                {selectedIssue.title}
              </h3>

              <p className="text-sm text-gray-700">
                {lang === "en"
                  ? selectedIssue.ai?.description_en
                  : selectedIssue.ai?.description_hi}
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
                <strong>Why this matters:</strong>{" "}
                {selectedIssue.ai?.why_it_matters}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

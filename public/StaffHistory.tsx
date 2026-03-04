import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  orderBy,
  query,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";

interface LeaveRecord {
  id: string;
  staffName: string;
  leaveDate: string;
  dayOrder: string;
  email: string;
  hour?: string;
  replacement?: string;
  replacements?: any[];
}

interface GroupedLeave {
  id: string;
  staffName: string;
  leaveDate: string;
  dayOrder: string;
  email: string;
  combinedReplacements: string;
}

const StaffHistory: React.FC = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState<GroupedLeave[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchLeaveHistory = async () => {
      const q = query(
        collection(db, "staffLeaveRequests"),
        orderBy("appliedAt", "desc")
      );

      const snapshot = await getDocs(q);

      const rawData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as LeaveRecord),
      }));

      const grouped: { [key: string]: GroupedLeave } = {};

      rawData.forEach((record) => {
        const key = `${record.staffName}-${record.leaveDate}`;

        if (!grouped[key]) {
          grouped[key] = {
            id: record.id,
            staffName: record.staffName,
            leaveDate: record.leaveDate,
            dayOrder: record.dayOrder,
            email: record.email,
            combinedReplacements: "",
          };
        }

        if (record.replacements && record.replacements.length > 0) {
          const repText = record.replacements
            .map((r) => `${r.hour} – ${r.replacement}`)
            .join(", ");

          grouped[key].combinedReplacements = repText;
        } else if (record.hour && record.replacement) {
          const newEntry = `${record.hour} – ${record.replacement}`;

          grouped[key].combinedReplacements =
            grouped[key].combinedReplacements
              ? grouped[key].combinedReplacements + ", " + newEntry
              : newEntry;
        }
      });

      setHistory(Object.values(grouped));
    };

    fetchLeaveHistory();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this leave record?"
    );

    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "staffLeaveRequests", id));

      setHistory((prev) => prev.filter((record) => record.id !== id));

      alert("Leave record deleted successfully");
    } catch (error) {
      console.error(error);
      alert("Error deleting record");
    }
  };

  const filteredHistory = history.filter((record) =>
    record.staffName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">

      {/* Header */}
      <div className="flex justify-between items-center px-8 pt-10 pb-4 max-w-7xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
            Leave History
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            View leave applications and assigned replacements
          </p>
        </div>

        <button
          onClick={() => navigate("/staff-dashboard")}
          className="flex items-center gap-2 bg-violet-600 text-white 
          px-5 py-2.5 rounded-xl font-semibold 
          hover:bg-violet-700 transition-all shadow-md hover:shadow-lg"
        >
          <i className="fas fa-arrow-left"></i>
          Dashboard
        </button>
      </div>

      <div className="px-8 pb-12 max-w-7xl mx-auto">

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search staff name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-5 py-3 rounded-xl border border-slate-200 
              bg-white shadow-sm focus:outline-none 
              focus:ring-2 focus:ring-violet-500 
              focus:border-violet-500 transition"
            />
          </div>
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">

          {/* Table Header */}
          <div
            className="grid grid-cols-[1.3fr_1fr_0.7fr_2fr_0.3fr] 
            px-8 py-5 bg-slate-50 text-xs font-semibold 
            text-slate-500 uppercase tracking-wider"
          >
            <span>Staff</span>
            <span>Date</span>
            <span>Day</span>
            <span>Assigned Replacements</span>
            <span></span>
          </div>

          {/* Table Body */}
          {filteredHistory.length === 0 ? (
            <div className="px-8 py-16 text-center text-slate-400">
              No leave history found.
            </div>
          ) : (
            filteredHistory.map((record) => (
              <div
                key={record.id}
                className="grid grid-cols-[1.3fr_1fr_0.7fr_2fr_0.3fr] 
                px-8 py-6 border-t border-slate-100 
                hover:bg-slate-50 transition-all items-start"
              >
                {/* Staff */}
                <div>
                  <p className="font-semibold text-slate-800">
                    {record.staffName}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {record.email}
                  </p>
                </div>

                {/* Date */}
                <div className="text-slate-700 font-medium">
                  {record.leaveDate}
                </div>

                {/* Day Order */}
                <div>
                  <span
                    className="inline-flex items-center 
                    justify-center bg-violet-100 
                    text-violet-700 text-xs font-semibold 
                    px-3 py-1 rounded-full"
                  >
                    {record.dayOrder}
                  </span>
                </div>

                {/* Replacements */}
                <div className="flex flex-wrap gap-2">
                  {record.combinedReplacements ? (
                    record.combinedReplacements
                      .split(", ")
                      .map((item, i) => {
                        const [hour, name] = item.split(" – ");
                        return (
                          <div
                            key={i}
                            className="flex items-center gap-2 
                            bg-violet-50 border border-violet-100 
                            text-violet-700 px-3 py-1.5 
                            rounded-full text-xs font-medium"
                          >
                            <span
                              className="bg-violet-600 text-white 
                              text-[10px] px-2 py-0.5 rounded-full"
                            >
                              {hour}
                            </span>
                            <span>{name}</span>
                          </div>
                        );
                      })
                  ) : (
                    <span className="text-slate-400 text-sm">
                      No replacements
                    </span>
                  )}
                </div>

                {/* Delete Button */}
                <div className="flex justify-end">
                  <button
                    onClick={() => handleDelete(record.id)}
                    className="text-red-500 hover:text-red-700 text-lg transition"
                    title="Delete Record"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffHistory;
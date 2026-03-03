import React, { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import LeaveReceiptModal from "../components/LeaveReceiptModal";

interface LeaveRecord {
  id: string;
  staffName: string;
  leaveDate: string;
  dayOrder: string;
  hour: string;
  replacement: string;
  email: string;
}

const StaffHistory: React.FC = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState<LeaveRecord[]>([]);
  const [search, setSearch] = useState("");

  // ⭐ Modal State
  const [selectedRecord, setSelectedRecord] = useState<LeaveRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchLeaveHistory = async () => {
      const q = query(
        collection(db, "staffLeaveRequests"),
        orderBy("appliedAt", "desc")
      );

      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<LeaveRecord, "id">),
      }));

      setHistory(data);
    };

    fetchLeaveHistory();
  }, []);

  const filteredHistory = history.filter((record) =>
    record.staffName?.toLowerCase().includes(search.toLowerCase())
  );

  // 🧾 Open Receipt Modal (NO navigation)
  const handleReceiptClick = (record: LeaveRecord) => {
    setSelectedRecord(record);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* ⭐ Top Header with Proper Back Button */}
      <div className="flex justify-between items-center px-8 pt-8 pb-2 max-w-7xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Leave History
          </h1>
          <p className="text-slate-500 mt-1">
            Manage leave applications and view digital receipts
          </p>
        </div>

        {/* 🔙 Back to Staff Dashboard Button */}
        <button
          onClick={() => navigate("/staff-dashboard")}
          className="flex items-center gap-2 bg-violet-600 text-white px-5 py-2 rounded-xl font-semibold hover:bg-violet-700 transition shadow-md"
        >
          <i className="fas fa-arrow-left"></i>
          Dashboard
        </button>
      </div>

      {/* Page Container */}
      <div className="p-8 pt-4 max-w-7xl mx-auto">

        {/* 🔍 Smart Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-xl">
            <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
            <input
              type="text"
              placeholder="Quick search staff..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 
              bg-white shadow-sm focus:outline-none focus:ring-2 
              focus:ring-violet-500 focus:border-violet-500"
            />
          </div>
        </div>

        {/* 📊 Premium Table Card (Matches Your UI Screenshot) */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          
          {/* Table Header */}
          <div className="grid grid-cols-5 px-6 py-4 bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>Staff Name</span>
            <span>Leave Date</span>
            <span>Day Order</span>
            <span>Hour</span>
            <span className="text-right">Receipt</span>
          </div>

          {/* Table Body */}
          {filteredHistory.length === 0 ? (
            <div className="px-6 py-12 text-center text-slate-500">
              No leave history found.
            </div>
          ) : (
            filteredHistory.map((record) => (
              <div
                key={record.id}
                className="grid grid-cols-5 px-6 py-5 border-t border-slate-100 
                hover:bg-slate-50 transition-all items-center"
              >
                {/* Staff Name */}
                <div>
                  <p className="font-semibold text-slate-800">
                    {record.staffName}
                  </p>
                  <p className="text-xs text-slate-400">
                    {record.email}
                  </p>
                </div>

                {/* Leave Date */}
                <span className="text-slate-600 font-medium">
                  {record.leaveDate}
                </span>

                {/* Day Order */}
                <span className="text-slate-600">
                  {record.dayOrder}
                </span>

                {/* Hour */}
                <span className="text-slate-600">
                  {record.hour}
                </span>

                {/* 🧾 Receipt Icon (Opens Modal, NOT Route) */}
                <div className="flex justify-end">
                  <button
                    onClick={() => handleReceiptClick(record)}
                    className="text-violet-500 hover:text-violet-700 transition text-xl"
                    title="View Receipt"
                  >
                    <i className="fas fa-receipt"></i>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 🧾 Receipt Modal (Connected Properly) */}
      <LeaveReceiptModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        record={selectedRecord}
      />
    </div>
  );
};

export default StaffHistory;
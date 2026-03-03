import React from "react";
import { useNavigate } from "react-router-dom";

const StaffDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ⭐ Custom Staff Console Header (No Admin Navbar Style) */}
      <div className="bg-white border-b border-slate-100 px-8 py-4 flex justify-between items-center shadow-sm">
        
        {/* Staff Console Logo with Icon */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center shadow-md">
            <i className="fas fa-id-badge text-white text-lg"></i>
          </div>

          <h1 className="text-xl font-bold text-slate-800 tracking-tight">
            <span className="text-violet-600">Staff Console</span>
          </h1>
        </div>

        {/* Back to Public Search */}
       <button
          onClick={() => navigate("/")}
          className="bg-white border border-slate-200 px-5 py-2 rounded-xl 
          text-sm font-semibold text-slate-700 hover:bg-slate-100 
          transition shadow-sm"
        >
          ← Back to Search
        </button>
      </div>

      {/* Main Content */}
      <div className="p-8">
        <div className="max-w-6xl mx-auto">

          {/* Title Section */}
          <h2 className="text-3xl font-bold text-slate-800 mb-2">
            Staff Dashboard
          </h2>
          <p className="text-slate-500 mb-10">
            Manage your leave applications and view receipts.
          </p>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Apply Leave Card */}
            <div
              onClick={() => navigate("/staff-leave")}
              className="cursor-pointer bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all border border-gray-100"
            >
              <div className="w-14 h-14 bg-violet-500 rounded-xl flex items-center justify-center mb-4 shadow-md">
                <i className="fas fa-paper-plane text-white text-lg"></i>
              </div>

              <h2 className="text-xl font-semibold text-slate-800">
                Apply Leave
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Submit a new leave application form
              </p>
            </div>

            {/* Leave History Card */}
            <div
              onClick={() => navigate("/staff-history")}
              className="cursor-pointer bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all border border-gray-100"
            >
              <div className="w-14 h-14 bg-emerald-500 rounded-xl flex items-center justify-center mb-4 shadow-md">
                <i className="fas fa-receipt text-white text-lg"></i>
              </div>

              <h2 className="text-xl font-semibold text-slate-800">
                Leave History
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                View submitted leave receipts & history
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
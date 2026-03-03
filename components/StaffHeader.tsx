import React from "react";
import { useNavigate } from "react-router-dom";

const StaffHeader: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white border-b border-slate-100 px-8 py-4 flex justify-between items-center shadow-sm">
      
      {/* Staff Console Logo */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center shadow-md">
          <i className="fas fa-user-tie text-white text-lg"></i>
        </div>

        <h1 className="text-xl font-bold text-slate-800">
           <span className="text-violet-600">Staff Console</span>
        </h1>
      </div>

      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        className="text-sm text-slate-500 hover:text-slate-800 transition"
      >
        ← Back to Search
      </button>
    </div>
  );
};

export default StaffHeader;
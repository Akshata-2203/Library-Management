import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const StaffLogin: React.FC = () => {
  const navigate = useNavigate();

  const [staffID, setStaffID] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!staffID || !email) {
      setError("Please enter Staff ID and Email");
      return;
    }

    try {
      setLoading(true);

      const q = query(
        collection(db, "staff"),
        where("StaffID", "==", staffID),
        where("Email", "==", email)
      );

      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        // ⭐ MODIFIED: Redirect to Staff Dashboard (Console Page)
        navigate("/staff-dashboard");
      } else {
        setError("Invalid Staff ID or Email");
      }
    } catch (err) {
      console.error(err);
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl">

        {/* Icon */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 bg-violet-600 rounded-2xl flex items-center justify-center shadow-lg">
            <i className="fas fa-user text-white text-xl"></i>
          </div>

          <h1 className="text-2xl font-bold text-slate-800 mt-4">
             Staff
          </h1>
          <p className="text-slate-500 text-sm">
            Staff Leave Management Access
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-500">
              STAFF ID
            </label>
            <input
              type="text"
              value={staffID}
              onChange={(e) => setStaffID(e.target.value)}
              placeholder="Enter Staff ID (e.g., ST001)"
              className="w-full mt-2 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500">
              STAFF EMAIL
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Registered Email"
              className="w-full mt-2 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 text-white py-3 rounded-xl font-semibold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
          >
            {loading ? "Signing In..." : "Sign In Now →"}
          </button>
        </form>

        <button
          onClick={() => navigate("/")}
          className="w-full mt-4 text-sm text-slate-500 hover:text-slate-800 transition"
        >
          ← Back to Search
        </button>
      </div>
    </div>
  );
};

export default StaffLogin;
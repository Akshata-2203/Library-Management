import React, { useEffect, useState } from "react";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";

const StaffLeave: React.FC = () => {
  const navigate = useNavigate();

  const [staffList, setStaffList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Main form data
  const [formData, setFormData] = useState({
    staffName: "",
    leaveDate: "",
    dayOrder: "",
    email: "",
  });

  // 4 rows for Class + Hour + Replacement
  const [rows, setRows] = useState([
    { className: "", hour: "", replacement: "", replacementEmail: "" },
    { className: "", hour: "", replacement: "", replacementEmail: "" },
    { className: "", hour: "", replacement: "", replacementEmail: "" },
    { className: "", hour: "", replacement: "", replacementEmail: "" },
  ]);

  // Fetch staff list
  useEffect(() => {
    const fetchStaff = async () => {
      const snapshot = await getDocs(collection(db, "staff"));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStaffList(data);
    };

    fetchStaff();
  }, []);

  // Handle main form change
  const handleChange = (e: any) => {
    const { name, value } = e.target;

    if (name === "staffName") {
      const selected = staffList.find((staff) => staff.Name === value);

      setFormData((prev) => ({
        ...prev,
        staffName: value,
        email: selected?.Email || "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle row change
  const handleRowChange = (index: number, name: string, value: string) => {
    const updatedRows = [...rows];

    if (name === "replacement") {
      const selected = staffList.find((staff) => staff.Name === value);

      updatedRows[index].replacement = value;
      updatedRows[index].replacementEmail = selected?.Email || "";
    } else {
      updatedRows[index][name] = value;
    }

    setRows(updatedRows);
  };

  // Submit
  const handleSubmit = async () => {
    if (!formData.staffName || !formData.leaveDate || !formData.dayOrder) {
      alert("Please fill required fields");
      return;
    }

    try {
      setLoading(true);

      for (let row of rows) {
        if (row.className && row.hour && row.replacementEmail) {

          // Save to Firestore
          await addDoc(collection(db, "staffLeaveRequests"), {
            ...formData,
            ...row,
            status: "Pending",
            appliedAt: new Date(),
          });

          // Send Email
          await emailjs.send(
            "service_3ypywql",
            "template_yamhmjq",
            {
              staff_name: formData.staffName,
              leave_date: formData.leaveDate,
              day_order: formData.dayOrder,
              hour: row.hour,
              class_level: row.className,
              replacement_name: row.replacement,
              replacement_email: row.replacementEmail,
              reply_to: formData.email,
            },
            "cSl6v4JdZvhh-hpcR"
          );
        }
      }

      alert("Leave Applied & Emails Sent Successfully 💌");

      navigate("/staff-dashboard");

    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl p-8 shadow-sm">
        <h2 className="text-xl font-semibold mb-6">
          1. APPLY FOR LEAVE
        </h2>

        {/* Staff Name */}
        <div className="mb-4">
          <label className="text-sm text-gray-500">Staff Name</label>
          <select
            name="staffName"
            value={formData.staffName}
            onChange={handleChange}
            className="w-full mt-2 p-3 rounded-xl border"
          >
            <option value="">Select Staff</option>
            {staffList.map((staff) => (
              <option key={staff.id} value={staff.Name}>
                {staff.Name}
              </option>
            ))}
          </select>
        </div>

        {/* Leave Date */}
        <div className="mb-4">
          <label className="text-sm text-gray-500">Leave Date</label>
          <input
            type="date"
            name="leaveDate"
            value={formData.leaveDate}
            onChange={handleChange}
            className="w-full mt-2 p-3 rounded-xl border"
          />
        </div>

        {/* Day Order */}
        <div className="mb-6">
          <label className="text-sm text-gray-500">Day Order</label>
          <select
            name="dayOrder"
            value={formData.dayOrder}
            onChange={handleChange}
            className="w-full mt-2 p-3 rounded-xl border"
          >
            <option value="">Select Day</option>
            <option>I</option>
            <option>II</option>
            <option>III</option>
            <option>IV</option>
            <option>V</option>
            <option>VI</option>
          </select>
        </div>

        {/* 4 Rows */}
        {rows.map((row, index) => (
          <div key={index} className="grid grid-cols-3 gap-4 mb-4">

            {/* Class */}
            <select
              value={row.className}
              onChange={(e) =>
                handleRowChange(index, "className", e.target.value)
              }
              className="p-3 rounded-xl border"
            >
              <option value="">Select Class</option>
              <option value="UG I">UG I</option>
              <option value="UG II">UG II</option>
              <option value="UG III">UG III</option>
              <option value="PG I">PG I</option>
              <option value="PG II">PG II</option>
            </select>

            {/* Hour */}
            <select
              value={row.hour}
              onChange={(e) =>
                handleRowChange(index, "hour", e.target.value)
              }
              className="p-3 rounded-xl border"
            >
              <option value="">Select Hour</option>
              <option>I</option>
              <option>II</option>
              <option>III</option>
              <option>IV</option>
              <option>V</option>
            </select>

            {/* Replacement */}
            <select
              value={row.replacement}
              onChange={(e) =>
                handleRowChange(index, "replacement", e.target.value)
              }
              className="p-3 rounded-xl border"
            >
              <option value="">Select Replacement</option>
              {staffList.map((staff) => (
                <option key={staff.id} value={staff.Name}>
                  {staff.Name}
                </option>
              ))}
            </select>

          </div>
        ))}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full py-3 rounded-xl text-lg font-semibold transition-all shadow-md
          ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-violet-600 hover:bg-violet-700 text-white"
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <i className="fas fa-spinner fa-spin"></i>
              Sending Email...
            </span>
          ) : (
            "Apply Leave →"
          )}
        </button>

      </div>
    </div>
  );
};

export default StaffLeave;
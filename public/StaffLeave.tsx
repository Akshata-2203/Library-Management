import React, { useEffect, useState } from "react";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";

const StaffLeave: React.FC = () => {
  const navigate = useNavigate();

  const [staffList, setStaffList] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    staffName: "",
    leaveDate: "",
    dayOrder: "",
    hour: "",
    className: "",
    replacement: "",
    replacementEmail: "",
    email: "",
  });

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

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    if (name === "staffName") {
      const selected = staffList.find((staff) => staff.Name === value);

      setFormData((prev) => ({
        ...prev,
        staffName: value,
        email: selected?.Email || "",
      }));

    } else if (name === "replacement") {
      const selected = staffList.find((staff) => staff.Name === value);

      setFormData((prev) => ({
        ...prev,
        replacement: value,
        replacementEmail: selected?.Email || "",
      }));

    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async () => {
    if (
      !formData.staffName ||
      !formData.leaveDate ||
      !formData.dayOrder ||
      !formData.hour ||
      !formData.className ||
      !formData.replacement ||
      !formData.email ||
      !formData.replacementEmail
    ) {
      alert("Please fill all fields");
      return;
    }

    try {
      // Save to Firestore
      await addDoc(collection(db, "staffLeaveRequests"), {
        ...formData,
        status: "Pending",
        appliedAt: new Date(),
      });

      // Send Email (MATCHING TEMPLATE VARIABLES)
      await emailjs.send(
        "service_3ypywql",
        "template_yamhmjq",
        {
          staff_name: formData.staffName,
          leave_date: formData.leaveDate,
          day_order: formData.dayOrder,
          hour: formData.hour,
          class_level: formData.className, // ✅ FIXED HERE
          replacement_name: formData.replacement,
          replacement_email: formData.replacementEmail,
          reply_to: formData.email,
        },
        "cSl6v4JdZvhh-hpcR"
      );

      alert("Leave Applied & Email Sent Successfully 💌");
      navigate("/staff-dashboard");

    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Try again.");
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto mb-6 flex justify-end">
        <button
          onClick={() => navigate("/staff-dashboard")}
          className="flex items-center gap-2 bg-violet-600 text-white px-5 py-2 rounded-xl font-semibold hover:bg-violet-700 transition shadow-md"
        >
          <i className="fas fa-arrow-left"></i>
          Dashboard
        </button>
      </div>

      <div className="max-w-2xl mx-auto bg-white rounded-2xl p-8 shadow-sm">
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

        {/* Class */}
        <div className="mb-4">
          <label className="text-sm text-gray-500">Class</label>
          <select
            name="className"
            value={formData.className}
            onChange={handleChange}
            className="w-full mt-2 p-3 rounded-xl border"
          >
            <option value="">Select Class</option>
            <option value="UG I">UG I</option>
            <option value="UG II">UG II</option>
            <option value="UG III">UG III</option>
            <option value="PG I">PG I</option>
            <option value="PG II">PG II</option>
          </select>
        </div>

        {/* Day Order */}
        <div className="mb-4">
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

        {/* Hour */}
        <div className="mb-4">
          <label className="text-sm text-gray-500">Hour</label>
          <select
            name="hour"
            value={formData.hour}
            onChange={handleChange}
            className="w-full mt-2 p-3 rounded-xl border"
          >
            <option value="">Select Hour</option>
            <option>I</option>
            <option>II</option>
            <option>III</option>
            <option>IV</option>
            <option>V</option>
          </select>
        </div>

        {/* Replacement */}
        <div className="mb-6">
          <label className="text-sm text-gray-500">Replacement Staff</label>
          <select
            name="replacement"
            value={formData.replacement}
            onChange={handleChange}
            className="w-full mt-2 p-3 rounded-xl border"
          >
            <option value="">Select Replacement</option>
            {staffList.map((staff) => (
              <option key={staff.id} value={staff.Name}>
                {staff.Name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-violet-600 text-white py-3 rounded-xl text-lg font-semibold hover:bg-violet-700 transition-all shadow-md"
        >
          Apply Leave →
        </button>
      </div>
    </div>
  );
};

export default StaffLeave;
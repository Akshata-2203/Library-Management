import React from "react";

interface LeaveReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: any;
}

const LeaveReceiptModal: React.FC<LeaveReceiptModalProps> = ({
  isOpen,
  onClose,
  record,
}) => {
  if (!isOpen || !record) return null;

  // Format Reference ID (nice looking)
  const referenceId = record.id
    ? record.id.slice(0, 6).toUpperCase()
    : "LV-0001";

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      
      {/* Modal Card */}
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden relative animate-fadeIn">

        {/* ❌ Close Button (Now visible & styled) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/90 hover:text-white text-xl z-10"
        >
          <i className="fas fa-times"></i>
        </button>

        {/* 🟢 Green Header (Matches Your Screenshot) */}
        <div className="bg-emerald-500 text-white text-center py-8 relative">
          
          {/* Check Icon Circle */}
          <div className="w-14 h-14 mx-auto mb-3 bg-white/20 rounded-full flex items-center justify-center">
            <i className="fas fa-check text-white text-xl"></i>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold">Digital Receipt</h2>

          {/* Reference */}
          <p className="text-xs tracking-widest opacity-90 mt-1">
            REF: {referenceId}
          </p>

          {/* 🎟 Ticket Cut Design */}
          <div className="absolute bottom-0 left-0 w-full flex justify-between px-4 translate-y-1/2">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="w-4 h-4 bg-white rounded-full" />
            ))}
          </div>
        </div>

        {/* 📄 Receipt Body */}
        <div className="p-6">

          {/* Staff Name */}
          <div className="mb-5">
            <p className="text-xs text-slate-400 uppercase font-semibold">
              Staff Name
            </p>
            <h3 className="text-lg font-bold text-slate-800 mt-1">
              {record.staffName}
            </h3>
          </div>

          {/* Leave Details Row */}
          <div className="grid grid-cols-2 gap-4 mb-5">
            
            {/* Leave Date */}
            <div>
              <p className="text-xs text-slate-400 uppercase font-semibold">
                Leave Date
              </p>
              <p className="font-semibold text-slate-800 mt-1">
                {record.leaveDate}
              </p>
            </div>

            {/* Day Order */}
            <div>
              <p className="text-xs text-slate-400 uppercase font-semibold">
                Day Order
              </p>
              <p className="font-semibold text-slate-800 mt-1">
                {record.dayOrder}
              </p>
            </div>
          </div>

          {/* Additional Info (Professional Touch for Project) */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            
            {/* Hour */}
            <div>
              <p className="text-xs text-slate-400 uppercase font-semibold">
                Hour
              </p>
              <p className="font-semibold text-slate-800 mt-1">
                {record.hour || "N/A"}
              </p>
            </div>

            {/* Replacement */}
            <div>
              <p className="text-xs text-slate-400 uppercase font-semibold">
                Replacement
              </p>
              <p className="font-semibold text-slate-800 mt-1">
                {record.replacement || "Not Assigned"}
              </p>
            </div>
          </div>

          {/* 🟢 Status Box (Like Green Section in Your Screenshot) */}
          <div className="bg-emerald-100 border border-emerald-200 rounded-2xl p-5 text-center">
            <p className="text-emerald-700 text-sm font-semibold uppercase tracking-wide">
              Leave Applied Successfully
            </p>
            <p className="text-emerald-900 font-bold text-xl mt-2">
              {record.leaveDate}
            </p>
          </div>

          {/* Footer Note (Nice for Viva Demo) */}
          <p className="text-center text-xs text-slate-400 mt-6">
            SmartLib Staff Leave Management System
          </p>
        </div>
      </div>
    </div>
  );
};

export default LeaveReceiptModal;
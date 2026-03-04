import React from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteConfirmModal: React.FC<Props> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white rounded-2xl shadow-2xl w-105 p-8">

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-2xl">
            <i className="fas fa-trash"></i>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-center text-slate-800">
          Delete Leave Record
        </h2>

        {/* Message */}
        <p className="text-sm text-slate-500 text-center mt-2">
          Are you sure you want to delete this leave record?
          This action cannot be undone.
        </p>

        {/* Buttons */}
        <div className="flex justify-center gap-4 mt-6">

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-5 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition shadow"
          >
            Delete
          </button>

        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
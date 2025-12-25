"use client";
import { X, AlertTriangle } from "lucide-react";

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", cancelText = "Cancel", type = "danger" }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="brutalist-card bg-white w-full max-w-md relative overflow-hidden animate-in zoom-in duration-200">
        <div className={`h-2 w-full ${type === 'danger' ? 'bg-red-500' : 'bg-yellow-400'}`} />
        
        <div className="p-8">
          <div className="flex items-center gap-4 mb-6 text-red-600">
             <AlertTriangle size={32} strokeWidth={3} />
             <h2 className="text-3xl font-black italic uppercase tracking-tighter text-black">
               {title}
             </h2>
          </div>

          <p className="font-bold text-gray-600 mb-10 leading-relaxed uppercase text-sm">
            {message}
          </p>

          <div className="flex gap-4">
            <button 
              onClick={onClose}
              className="flex-grow brutalist-button bg-gray-100 hover:bg-gray-200 text-sm py-4"
            >
              {cancelText}
            </button>
            <button 
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`flex-grow brutalist-button text-white text-sm py-4 ${type === 'danger' ? 'bg-red-600 hover:bg-red-700' : 'bg-black'}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

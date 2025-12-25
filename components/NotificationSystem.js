"use client";
import { useState, useEffect, createContext, useContext } from "react";
import { X, CheckCircle2, AlertCircle, Info } from "lucide-react";

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const showNotification = (message, type = "info") => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000);
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <div className="fixed bottom-8 right-8 z-[200] flex flex-col gap-4 max-w-md w-full">
        {notifications.map((n) => (
          <div 
            key={n.id} 
            className={`brutalist-card p-6 flex items-start gap-4 animate-in slide-in-from-right duration-300 ${
              n.type === "error" ? "bg-soft-pink border-red-500" : 
              n.type === "success" ? "bg-soft-green border-green-600" : 
              "bg-white border-black"
            }`}
          >
            <div className={`mt-1 ${
              n.type === "error" ? "text-red-600" : 
              n.type === "success" ? "text-green-600" : 
              "text-blue-600"
            }`}>
              {n.type === "success" ? <CheckCircle2 size={24} /> : 
               n.type === "error" ? <AlertCircle size={24} /> : 
               <Info size={24} />}
            </div>
            <div className="flex-grow">
              <p className="font-black uppercase tracking-tight text-sm mb-1">
                {n.type === "error" ? "Error" : n.type === "success" ? "Success" : "Update"}
              </p>
              <p className="font-bold text-sm leading-tight">{n.message}</p>
            </div>
            <button 
              onClick={() => setNotifications((prev) => prev.filter((notif) => notif.id !== n.id))}
              className="hover:rotate-90 transition-transform"
            >
              <X size={18} />
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

export const useNotification = () => useContext(NotificationContext);

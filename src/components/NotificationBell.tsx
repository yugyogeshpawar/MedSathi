"use client";

import { useState, useEffect } from "react";
import { Bell, Check, X, Info, AlertTriangle, CheckCircle } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, limit, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { secureFetch } from "@/services/firebaseService";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    if (!db) return;

    const q = query(
      collection(db, "notifications"),
      orderBy("createdAt", "desc"),
      limit(10)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setNotifications(data);
    });

    return () => unsubscribe();
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await secureFetch("/api/notifications", {
        method: "PATCH",
        body: JSON.stringify({ id, isRead: true })
      });
    } catch (err) {
      console.error("Failed to mark read", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await secureFetch("/api/notifications", {
        method: "PATCH",
        body: JSON.stringify({ all: true })
      });
    } catch (err) {
      console.error("Failed to mark all read", err);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "success": return <CheckCircle size={16} className="text-green-500" />;
      case "warning": return <AlertTriangle size={16} className="text-yellow-500" />;
      default: return <Info size={16} className="text-blue-500" />;
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all relative"
      >
        <Bell size={20} className={unreadCount > 0 ? "animate-swing origin-top" : ""} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white dark:border-slate-800">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-[110] overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
            <h3 className="font-black text-sm uppercase tracking-widest text-slate-500">Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead}
                className="text-[10px] bg-primary/10 text-primary px-2 py-1 rounded-lg font-bold hover:bg-primary/20 transition-all"
              >
                Clear All
              </button>
            )}
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-10 text-center text-slate-400 text-sm font-medium">
                No recent alerts.
              </div>
            ) : (
              notifications.map((n) => (
                <div 
                  key={n.id} 
                  className={`p-4 border-b border-slate-100 dark:border-slate-800/50 flex gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all cursor-pointer ${!n.isRead ? 'bg-primary/[0.03]' : ''}`}
                  onClick={() => !n.isRead && markAsRead(n.id)}
                >
                  <div className="mt-1 shrink-0">{getTypeIcon(n.type)}</div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm tracking-tight ${!n.isRead ? 'font-black text-slate-900 dark:text-white' : 'font-medium text-slate-500'}`}>
                      {n.title}
                    </p>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-0.5 leading-relaxed">
                      {n.message}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-2 font-medium">
                      {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  {!n.isRead && (
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0"></div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

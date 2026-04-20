"use client";

import { useEffect, useState } from "react";
import AdminSidebarLayout from "@/components/AdminSidebarLayout";
import { secureFetch } from "@/services/firebaseService";
import { User, Activity, Clock, Filter, Search } from "lucide-react";
import toast from "react-hot-toast";

export default function LogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await secureFetch("/api/logs");
      const json = await res.json();
      if (json.success) setLogs(json.data);
    } catch (e) {
      toast.error("Failed to load logs");
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = filter === "all" ? logs : logs.filter(l => l.module === filter);

  return (
    <AdminSidebarLayout activeMenu="Logs">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
               <Activity className="text-primary" />
               Activity Logs
            </h1>
            <p className="text-slate-500 font-medium mt-1">Audit trail of all administrative actions performed on the platform.</p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
             <div className="relative flex-1 md:w-64">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
               <input 
                 type="text" 
                 placeholder="Search by action..." 
                 className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-primary text-sm shadow-sm"
               />
             </div>
             <select 
               value={filter}
               onChange={(e) => setFilter(e.target.value)}
               className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-primary text-sm shadow-sm font-bold"
             >
                <option value="all">All Modules</option>
                <option value="doctors">Doctors</option>
                <option value="bookings">Bookings</option>
                <option value="patients">Patients</option>
                <option value="payouts">Payouts</option>
             </select>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400">User / Role</th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Action</th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Target</th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {loading ? (
                   <tr><td colSpan={4} className="py-20 text-center text-slate-400 font-bold animate-pulse">Syncing logs...</td></tr>
                ) : filteredLogs.length === 0 ? (
                   <tr><td colSpan={4} className="py-20 text-center text-slate-400 font-bold">No activity recorded yet.</td></tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-black text-xs">
                             {log.userName?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-900 dark:text-white">{log.userName}</p>
                            <p className="text-[10px] font-black uppercase text-slate-400">{log.role}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                           <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{log.action}</span>
                           <span className="text-[10px] font-black uppercase tracking-widest text-primary/70">{log.module}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                         <p className="text-xs font-medium text-slate-500 max-w-[200px] truncate">{log.details || log.entityId || "N/A"}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-slate-400">
                           <Clock size={14} />
                           <span className="text-xs font-bold">{new Date(log.createdAt).toLocaleString()}</span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminSidebarLayout>
  );
}

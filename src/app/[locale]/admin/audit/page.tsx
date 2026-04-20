"use client";

import { useEffect, useState } from "react";
import AdminSidebarLayout from "@/components/AdminSidebarLayout";
import { secureFetch } from "@/services/firebaseService";
import { ShieldAlert, Clock, ArrowRight, CornerDownRight } from "lucide-react";
import toast from "react-hot-toast";

export default function AuditPage() {
  const [audits, setAudits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAudits();
  }, []);

  const fetchAudits = async () => {
    setLoading(true);
    try {
      const res = await secureFetch("/api/audit");
      const json = await res.json();
      if (json.success) setAudits(json.data);
    } catch (e) {
      toast.error("Failed to load audit trail");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminSidebarLayout activeMenu="Audit">
      <div className="max-w-7xl mx-auto pb-20">
        <div className="mb-10">
          <h1 className="text-4xl font-black text-slate-900 dark:text-white flex items-center gap-4">
             <ShieldAlert className="w-10 h-10 text-primary" />
             Audit System
          </h1>
          <p className="text-slate-500 font-medium text-lg mt-2">Critical data integrity logs with before/after state snapshots.</p>
        </div>

        {loading ? (
          <div className="py-20 text-center animate-pulse space-y-4">
             <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
             <p className="text-slate-500 font-bold tracking-widest uppercase text-xs">Decrypting Audit Trail...</p>
          </div>
        ) : audits.length === 0 ? (
          <div className="py-20 text-center text-slate-400 bg-white dark:bg-slate-800 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700">
             <p className="font-bold">No data mutations recorded yet.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {audits.map((audit) => (
              <div key={audit.id} className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden animate-in slide-in-from-bottom-4">
                {/* Header */}
                <div className="p-6 border-b border-slate-100 dark:border-slate-700/50 flex flex-col md:flex-row justify-between gap-4 bg-slate-50/50 dark:bg-slate-900/20">
                  <div className="flex items-start gap-4">
                     <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg">
                        <ShieldAlert size={24} />
                     </div>
                     <div>
                       <h3 className="text-lg font-black text-slate-900 dark:text-white">{audit.action}</h3>
                       <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-black uppercase tracking-widest bg-primary/10 text-primary px-2 py-0.5 rounded-md">{audit.module}</span>
                          <span className="text-xs text-slate-400 flex items-center gap-1"><Clock size={12} /> {new Date(audit.createdAt).toLocaleString()}</span>
                       </div>
                     </div>
                  </div>
                  <div className="text-right">
                     <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Performed by</p>
                     <p className="text-sm font-bold text-slate-800 dark:text-white">{audit.userName}</p>
                     <p className="text-[10px] font-mono text-slate-500">ID: {audit.userId.slice(-6)}</p>
                  </div>
                </div>

                {/* Diff View */}
                <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white dark:bg-slate-800">
                   {/* BEFORE */}
                   <div className="space-y-3">
                      <div className="flex items-center gap-2 text-red-500 mb-2">
                         <div className="w-2 h-2 rounded-full bg-red-500"></div>
                         <span className="text-xs font-black uppercase tracking-widest">Previous State</span>
                      </div>
                      <pre className="p-5 rounded-2xl bg-red-50/50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 text-[11px] font-mono text-slate-700 dark:text-slate-300 overflow-x-auto whitespace-pre-wrap leading-relaxed shadow-inner">
                         {JSON.stringify(audit.before || { record: "NEWLY_CREATED" }, null, 2)}
                      </pre>
                   </div>

                   {/* AFTER */}
                   <div className="space-y-3 relative">
                      <div className="absolute -left-10 top-1/2 -translate-y-1/2 hidden lg:flex text-slate-300">
                        <ArrowRight size={32} />
                      </div>
                      <div className="flex items-center gap-2 text-green-600 mb-2">
                         <div className="w-2 h-2 rounded-full bg-green-600"></div>
                         <span className="text-xs font-black uppercase tracking-widest">New State</span>
                      </div>
                      <pre className="p-5 rounded-2xl bg-green-50/50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/20 text-[11px] font-mono text-slate-700 dark:text-slate-300 overflow-x-auto whitespace-pre-wrap leading-relaxed shadow-inner">
                         {JSON.stringify(audit.after, null, 2)}
                      </pre>
                   </div>
                </div>

                <div className="px-8 pb-8 pt-0 flex items-center justify-end">
                   <div className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-[10px] font-mono text-slate-500">
                      <CornerDownRight size={14} />
                      ENTITY_ID: {audit.entityId}
                   </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminSidebarLayout>
  );
}

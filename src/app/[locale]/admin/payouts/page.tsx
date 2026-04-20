"use client";

import { useEffect, useState } from "react";
import AdminSidebarLayout from "@/components/AdminSidebarLayout";
import { secureFetch } from "@/services/firebaseService";
import { Search, Filter, CheckCircle, Clock, IndianRupee } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "@/routing";

export default function PayoutsPage() {
  const { hasPermission, loading: authLoading } = useAuth();
  const router = useRouter();
  const [payouts, setPayouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [doctorFilter, setDoctorFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    if (!authLoading && !hasPermission("payouts")) {
      router.push("/admin" as any);
      toast.error("Access denied");
    }
  }, [authLoading, hasPermission, router]);

  useEffect(() => {
    if (hasPermission("payouts")) {
      fetchPayouts();
    }
  }, [statusFilter, hasPermission]);

  const fetchPayouts = async () => {
    setLoading(true);
    try {
      const url = statusFilter === "all" ? "/api/payouts" : `/api/payouts?status=${statusFilter}`;
      const res = await secureFetch(url);
      const json = await res.json();
      if (json.success) setPayouts(json.data);
    } catch (e) {
      toast.error("Failed to load payouts");
    } finally {
      setLoading(false);
    }
  };

  const markAsPaid = async (id: string) => {
    const loadingToast = toast.loading("Updating status...");
    try {
      const res = await secureFetch(`/api/payouts/${id}`, {
        method: "PUT",
        body: JSON.stringify({ status: "paid" })
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Payout marked as paid", { id: loadingToast });
        setPayouts(prev => prev.map(p => p.id === id ? { ...p, status: "paid" } : p));
      } else {
        toast.error("Status update failed", { id: loadingToast });
      }
    } catch (e) {
      toast.error("Connection error", { id: loadingToast });
    }
  };

  const filtered = payouts.filter(p => 
    p.doctorName.toLowerCase().includes(doctorFilter.toLowerCase()) ||
    p.bookingId.toLowerCase().includes(doctorFilter.toLowerCase())
  );

  if (authLoading || !hasPermission("payouts")) return null;

  return (
    <AdminSidebarLayout activeMenu="Payouts">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Doctor Payouts</h1>
            <p className="text-slate-500">Track and manage professional service earnings.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
             <div className="relative flex-1 sm:w-64">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
               <input 
                 type="text" 
                 placeholder="Search doctor or ID..." 
                 value={doctorFilter}
                 onChange={e => setDoctorFilter(e.target.value)}
                 className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-primary shadow-sm"
               />
             </div>
             <select 
               value={statusFilter}
               onChange={e => setStatusFilter(e.target.value)}
               className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-primary shadow-sm"
             >
               <option value="all">All Status</option>
               <option value="pending">Pending</option>
               <option value="paid">Paid</option>
             </select>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                  <th className="px-6 py-4 font-bold text-sm text-slate-600 dark:text-slate-400">Doctor / Service</th>
                  <th className="px-6 py-4 font-bold text-sm text-slate-600 dark:text-slate-400">Booking ID</th>
                  <th className="px-6 py-4 font-bold text-sm text-slate-600 dark:text-slate-400">Amount</th>
                  <th className="px-6 py-4 font-bold text-sm text-slate-600 dark:text-slate-400">Earnings</th>
                  <th className="px-6 py-4 font-bold text-sm text-slate-600 dark:text-slate-400">Status</th>
                  <th className="px-6 py-4 font-bold text-sm text-slate-600 dark:text-slate-400 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {loading ? (
                  <tr><td colSpan={6} className="py-20 text-center text-slate-500 font-medium">Fetching payouts map...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={6} className="py-20 text-center text-slate-500 font-medium">No payout records found matching your filters.</td></tr>
                ) : (
                  filtered.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900 dark:text-white capitalize truncate max-w-[150px]">{p.doctorName}</div>
                        <div className="text-xs uppercase tracking-wider text-primary font-bold">{p.serviceType}</div>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-slate-500">{p.bookingId}</td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-slate-900 dark:text-white">₹{p.amount.toLocaleString()}</div>
                        <div className="text-[10px] text-red-500 font-bold">-{p.commission.toLocaleString()} Fee</div>
                      </td>
                      <td className="px-6 py-4 font-black text-green-600 dark:text-green-400 text-lg">
                        ₹{p.payoutAmount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                         <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 w-fit ${
                           p.status === 'paid' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                         }`}>
                           {p.status === 'paid' ? <CheckCircle size={12} /> : <Clock size={12} />}
                           {p.status}
                         </span>
                         <div className="text-[10px] text-slate-400 mt-1">{p.date}</div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {p.status === 'pending' ? (
                          <button 
                            onClick={() => markAsPaid(p.id)}
                            className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95"
                          >
                            Mark as Paid
                          </button>
                        ) : (
                          <span className="text-xs font-bold text-green-600 flex items-center justify-end gap-1">
                            <CheckCircle size={14} /> Settlement Done
                          </span>
                        )}
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

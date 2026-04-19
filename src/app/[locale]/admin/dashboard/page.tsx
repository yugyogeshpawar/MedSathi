"use client";

import { useEffect, useState } from "react";
import AdminSidebarLayout from "@/components/AdminSidebarLayout";
import { secureFetch } from "@/services/firebaseService";
import { DashboardCards } from "@/components/DashboardCards";
import { BookingChart, RevenueChart } from "@/components/Charts";
import { RefreshCcw } from "lucide-react";
import toast from "react-hot-toast";

export default function AnalyticsDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await secureFetch("/api/analytics");
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      } else {
        toast.error("Analytics failure");
      }
    } catch (e) {
      toast.error("Server unreachable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminSidebarLayout activeMenu="Dashboard">
      <div className="max-w-7xl mx-auto pb-20">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Enterprise Analytics</h1>
            <p className="text-slate-500 font-medium">Real-time data engine powering MedSathi operations.</p>
          </div>
          <button 
            onClick={fetchAnalytics}
            className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl hover:bg-slate-50 transition-colors shadow-sm"
          >
            <RefreshCcw className={`w-5 h-5 text-slate-500 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {loading && !data ? (
          <div className="h-[60vh] flex flex-col items-center justify-center text-slate-400">
             <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
             <p className="font-bold">Syncing data lake...</p>
          </div>
        ) : (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <DashboardCards metrics={data?.metrics} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <BookingChart data={data?.chartData || []} />
              <RevenueChart data={data?.chartData || []} />
            </div>

            <div className="bg-slate-900 text-white p-10 rounded-3xl relative overflow-hidden shadow-2xl">
               <div className="relative z-10">
                 <h2 className="text-3xl font-black mb-4">MedSathi Growth Radar</h2>
                 <p className="text-slate-400 max-w-2xl text-lg">
                   Your platform volume is up {data?.metrics?.todayBookings > 0 ? 'significantly' : 'stable'} today compared to weekly averages. 
                   Focus on settling <strong>₹{(data?.metrics?.pendingPayouts || 0).toLocaleString()}</strong> in pending payouts to maintain partner trust.
                 </p>
               </div>
               <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full -mr-20 -mt-20"></div>
               <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 blur-[80px] rounded-full -ml-20 -mb-20"></div>
            </div>
          </div>
        )}
      </div>
    </AdminSidebarLayout>
  );
}

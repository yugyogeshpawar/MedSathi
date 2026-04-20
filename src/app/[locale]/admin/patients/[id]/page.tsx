"use client";

import { useEffect, useState } from "react";
import AdminSidebarLayout from "@/components/AdminSidebarLayout";
import { useParams } from "next/navigation";
import { ArrowLeft, Clock, User, Stethoscope, TestTube, Pill } from "lucide-react";
import { Link } from "@/routing";
import { secureFetch } from "@/services/firebaseService";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "@/routing";
import toast from "react-hot-toast";

export default function PatientDetailPage() {
  const { hasPermission, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !hasPermission("patients")) {
      router.push("/admin" as any);
      toast.error("Access denied");
    }
  }, [authLoading, hasPermission, router]);

  useEffect(() => {
    if (!id || !hasPermission("patients")) return;
    secureFetch(`/api/patients/${id}/history`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setHistory(data.data);
        }
        setLoading(false);
      });
  }, [id]);

  const getIcon = (type: string) => {
    switch (type) {
      case "doctor": return <Stethoscope className="w-5 h-5 text-blue-500" />;
      case "lab": return <TestTube className="w-5 h-5 text-purple-500" />;
      case "medicine": return <Pill className="w-5 h-5 text-green-500" />;
      default: return <Clock className="w-5 h-5 text-slate-500" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case "doctor": return "bg-blue-100 dark:bg-blue-900/30";
      case "lab": return "bg-purple-100 dark:bg-purple-900/30";
      case "medicine": return "bg-green-100 dark:bg-green-900/30";
      default: return "bg-slate-100 dark:bg-slate-800";
    }
  };

  if (authLoading || !hasPermission("patients")) return null;

  return (
    <AdminSidebarLayout activeMenu="Patients">
      <div className="max-w-4xl mx-auto">
        <Link href="/admin/patients" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:hover:text-white mb-6 transition-colors">
          <ArrowLeft size={16} /> Back to Patients
        </Link>
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
             <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
               <User className="w-6 h-6 text-primary" />
             </div>
             Patient Timeline
          </h1>
          <p className="text-slate-500 mt-2 ml-15">Detailed interaction history</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 sm:p-10 relative">
          {loading ? (
            <div className="text-center py-10 text-slate-500">Loading history...</div>
          ) : history.length === 0 ? (
            <div className="text-center py-10 text-slate-500">No interaction history found.</div>
          ) : (
            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 dark:before:via-slate-700 before:to-transparent">
              {history.map((item, i) => (
                <div key={item.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-slate-800 ${getBgColor(item.serviceType)} shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10 mx-auto md:mx-0 absolute left-0 md:left-1/2 md:-translate-x-1/2`}>
                    {getIcon(item.serviceType)}
                  </div>
                  
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] ml-14 md:ml-0 p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm transition-all hover:shadow-md">
                    <div className="flex items-center justify-between mb-2">
                       <span className="text-xs font-bold uppercase tracking-wider text-primary">{item.serviceType}</span>
                       <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                         <Clock size={12} />
                         {item.date !== "-" ? item.date : new Date(item.createdAt).toLocaleDateString()}
                       </span>
                    </div>
                    {item.doctorName && item.doctorName !== "-" && (
                       <h3 className="font-bold text-slate-800 dark:text-white mb-1">Dr. {item.doctorName}</h3>
                    )}
                    
                    {/* Maximum Information Render block */}
                    {item.rawDetails && (
                      <div className="mt-2 space-y-1 text-sm text-slate-700 dark:text-slate-300">
                        {item.rawDetails.testType && (
                          <div><strong className="text-slate-800 dark:text-white">Lab Test:</strong> {item.rawDetails.testType} {item.rawDetails.homeCollection ? "(Home)" : ""}</div>
                        )}
                        {item.rawDetails.address && (
                          <div><strong className="text-slate-800 dark:text-white">Delivery Address:</strong> {item.rawDetails.address}</div>
                        )}
                        {item.rawDetails.notes && (
                          <div><strong className="text-slate-800 dark:text-white">Attached Note:</strong> {item.rawDetails.notes}</div>
                        )}
                      </div>
                    )}

                    {!item.rawDetails?.notes && (
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                         {item.notes}
                      </p>
                    )}
                    <div className="mt-3 inline-block px-2.5 py-1 bg-slate-200 dark:bg-slate-700 rounded-md text-xs font-medium text-slate-700 dark:text-slate-300">
                       Status: {item.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </AdminSidebarLayout>
  );
}

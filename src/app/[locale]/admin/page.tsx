"use client";

import { useEffect, useState, useMemo } from "react";
import AdminSidebarLayout from "@/components/AdminSidebarLayout";
import { getAllBookingsMerged, updateBookingStatus, MergedBooking, secureFetch } from "@/services/firebaseService";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "@/routing";
import { Search, Filter, Phone, CheckCircle, Clock } from "lucide-react";
import toast from "react-hot-toast";

// @ts-ignore
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function CRMDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  const [data, setData] = useState<MergedBooking[]>([]);
  const [totalPatients, setTotalPatients] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/admin/login" as any);
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const fetchData = async () => {
    setIsLoading(true);
    const result = await getAllBookingsMerged();
    setData(result);
    // Fetch patients
    try {
      const pRes = await secureFetch("/api/patients");
      const pJson = await pRes.json();
      if (pJson.success) {
        setTotalPatients(pJson.data.length);
      }
    } catch(e) {}
    setIsLoading(false);
  };

  const updateStatus = async (id: string, type: "doctor" | "lab" | "medicine", newStatus: string) => {
    // Optimistic Update
    setData(prev => prev.map(d => d.id === id ? { ...d, status: newStatus } : d));
    const r = await updateBookingStatus(id, type, newStatus);
    if (r.success) toast.success("Status updated to " + newStatus);
    else {
      toast.error("Failed to update status");
      fetchData(); // rollback
    }
  };

  // Analytics Computation
  const stats = useMemo(() => {
    const todayStr = new Date().toDateString();
    let today = 0, doctor = 0, lab = 0, medicine = 0;
    
    data.forEach((d: MergedBooking) => {
      if (new Date(d.createdAtTS).toDateString() === todayStr) today++;
      if (d.type === "doctor") doctor++;
      if (d.type === "lab") lab++;
      if (d.type === "medicine") medicine++;
    });

    return { total: data.length, today, doctor, lab, medicine };
  }, [data]);

  // Filters
  const filteredData = data.filter(d => {
    const matchesSearch = d.phone.includes(searchTerm) || d.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || d.type === filterType;
    return matchesSearch && matchesFilter;
  });

  if (loading || (!user && isLoading)) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) return null;

  return (
    <AdminSidebarLayout activeMenu="Dashboard">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold mb-2">Metrics Overview</h1>
        <p className="text-slate-500">Live analytics running across your active funnels.</p>
      </div>

      {/* Stats Deck */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
        <StatCard title="Total Bookings" value={stats.total} bg="bg-primary/10" text="text-primary" />
        <StatCard title="Total Patients" value={totalPatients} bg="bg-indigo-100 dark:bg-indigo-900/30" text="text-indigo-600 dark:text-indigo-400" />
        <StatCard title="Today's Velocity" value={stats.today} bg="bg-green-100 dark:bg-green-900/30" text="text-green-600 dark:text-green-400" />
        <StatCard title="Doctors" value={stats.doctor} bg="bg-blue-100 dark:bg-blue-900/30" text="text-blue-600 dark:text-blue-400" />
        <StatCard title="Lab Tests" value={stats.lab} bg="bg-purple-100 dark:bg-purple-900/30" text="text-purple-600 dark:text-purple-400" />
        <StatCard title="Medicines" value={stats.medicine} bg="bg-orange-100 dark:bg-orange-900/30" text="text-orange-600 dark:text-orange-400" />
      </div>

      {/* Main CRM Table Container */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        {/* Table Toolbar */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50 dark:bg-slate-800/50">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text"
              placeholder="Search by name or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 focus:ring-2 outline-none"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="text-slate-400 w-5 h-5" />
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 outline-none w-full sm:w-auto"
            >
              <option value="all">All Services</option>
              <option value="doctor">Doctors</option>
              <option value="lab">Lab Tests</option>
              <option value="medicine">Medicines</option>
            </select>
          </div>
        </div>

        {/* Table Itself */}
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left">
            <thead className="bg-slate-100 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-4 font-semibold text-sm">Patient / Ref</th>
                <th className="px-6 py-4 font-semibold text-sm">Service Type</th>
                <th className="px-6 py-4 font-semibold text-sm">Details</th>
                <th className="px-6 py-4 font-semibold text-sm">Requested Date</th>
                <th className="px-6 py-4 font-semibold text-sm">Status</th>
                <th className="px-6 py-4 font-semibold text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-slate-500">Loading operations map...</td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-slate-500 flex flex-col items-center">
                    <span className="text-4xl mb-2">📭</span>
                    No matching records found.
                  </td>
                </tr>
              ) : filteredData.map(row => (
                <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900 dark:text-white truncate max-w-[180px]">{row.name}</div>
                    <div className="text-sm text-slate-500">{row.phone}</div>
                  </td>
                  <td className="px-6 py-4">
                     <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                        row.type === 'doctor' ? 'bg-blue-100 text-blue-700' :
                        row.type === 'lab' ? 'bg-purple-100 text-purple-700' :
                        'bg-orange-100 text-orange-700'
                     }`}>
                       {row.type}
                     </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                    {row.type === 'doctor' && row.raw?.doctorName && (
                      <div><strong className="text-slate-800 dark:text-slate-200">Doctor:</strong> Dr. {row.raw.doctorName}</div>
                    )}
                    {row.type === 'lab' && row.raw?.testType && (
                      <>
                        <div><strong className="text-slate-800 dark:text-slate-200">Test:</strong> {row.raw.testType}</div>
                        {row.raw?.homeCollection && <div className="text-xs text-purple-600 font-bold">Home Collection</div>}
                      </>
                    )}
                    {row.type === 'medicine' && row.raw?.address && (
                      <div><strong className="text-slate-800 dark:text-slate-200">Address:</strong> {row.raw.address}</div>
                    )}
                    {row.raw?.notes && (
                      <div className="mt-1 text-xs italic">Note: {row.raw.notes}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-700 dark:text-slate-300">
                    {row.date}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <select 
                      value={row.status}
                      onChange={(e) => updateStatus(row.id, row.type, e.target.value)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase border-2 outline-none cursor-pointer transition-colors ${
                        row.status === 'Completed' ? 'border-green-500 text-green-700 bg-green-50' :
                        row.status === 'Confirmed' ? 'border-blue-500 text-blue-700 bg-blue-50' :
                        'border-yellow-500 text-yellow-700 bg-yellow-50'
                      }`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                    <button 
                      onClick={async () => {
                        const loadingToast = toast.loading("Generating Invoice...");
                        try {
                          const res = await fetch("/api/invoice", {
                            method: "POST",
                            headers: { "Content-Type": "application/json", "Authorization": "Bearer " + (await (user as any)?.getIdToken()) },
                            body: JSON.stringify({ patientName: row.name, serviceType: row.type, date: row.date, amount: "499.00", bookingId: row.id })
                          });
                          
                          if (!res.ok) throw new Error("Failed to generate PDF");

                          const blob = await res.blob();
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `Invoice_${row.id}.pdf`;
                          document.body.appendChild(a);
                          a.click();
                          a.remove();
                          toast.success("Invoice Downloaded!", { id: loadingToast });
                        } catch (error) {
                          toast.error("Generation failed.", { id: loadingToast });
                        }
                      }}
                      className="inline-flex items-center justify-center p-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors group"
                      title="Download Invoice PDF"
                    >
                      <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </button>
                    <a 
                      href={`https://wa.me/91${row.phone.replace(/\D/g, '')}?text=Hello%20from%20MedSathi.%20We%20are%20reaching%20out%20regarding%20your%20recent%20request.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center p-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors group"
                      title="Contact on WhatsApp"
                    >
                      <Phone className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminSidebarLayout>
  );
}

const StatCard = ({ title, value, bg, text }: any) => (
  <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col">
    <span className="text-sm font-semibold text-slate-500 mb-2">{title}</span>
    <span className={`text-4xl font-black ${text}`}>{value}</span>
  </div>
);

"use client";

import { useState, useEffect } from "react";
import AdminSidebarLayout from "@/components/AdminSidebarLayout";
import { useRouter } from "@/routing";
import { secureFetch } from "@/services/firebaseService";
import { User, Phone, Calendar, Clock, Stethoscope, TestTube, Pill, ArrowLeft, Save } from "lucide-react";
import toast from "react-hot-toast";

export default function NewBookingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    type: "doctor",
    date: new Date().toISOString().split('T')[0],
    time: "",
    doctorId: "",
    doctorName: "",
    testType: "",
    address: "",
    notes: ""
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await fetch("/api/doctors");
      const json = await res.json();
      if (json.success) setDoctors(json.data.filter((d: any) => d.status === "Active"));
    } catch (e) {}
  };

  const handleTypeChange = (type: string) => {
    setFormData(prev => ({ ...prev, type }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const loadingToast = toast.loading("Creating booking...");

    try {
      const res = await secureFetch("/api/bookings", {
        method: "POST",
        body: JSON.stringify(formData)
      });
      const json = await res.json();

      if (json.success) {
        toast.success("Booking created successfully", { id: loadingToast });
        router.push("/admin" as any);
      } else {
        toast.error(json.error || "Failed to create booking", { id: loadingToast });
      }
    } catch (err) {
      toast.error("Connection error", { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminSidebarLayout activeMenu="Overview">
      <div className="max-w-3xl mx-auto">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </button>

        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden animate-in slide-in-from-bottom-4">
          <div className="p-8 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/20">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">New Manual Booking</h1>
            <p className="text-slate-500 mt-1 font-medium">Create a verified appointment for a patient.</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Service Type Selection */}
            <div className="grid grid-cols-3 gap-4">
               <ServiceTypeTab 
                 active={formData.type === 'doctor'} 
                 onClick={() => handleTypeChange('doctor')} 
                 icon={<Stethoscope size={20} />} 
                 label="Doctor" 
               />
               <ServiceTypeTab 
                 active={formData.type === 'lab'} 
                 onClick={() => handleTypeChange('lab')} 
                 icon={<TestTube size={20} />} 
                 label="Lab Test" 
               />
               <ServiceTypeTab 
                 active={formData.type === 'medicine'} 
                 onClick={() => handleTypeChange('medicine')} 
                 icon={<Pill size={20} />} 
                 label="Medicine" 
               />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Patient Basic Info */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Patient Name</label>
                  <div className="relative">
                    <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      required 
                      type="text" 
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 outline-none focus:ring-2 focus:ring-primary transition-all font-medium"
                      placeholder="Full Name" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Phone Number</label>
                  <div className="relative">
                    <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      required 
                      type="tel" 
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 outline-none focus:ring-2 focus:ring-primary transition-all font-medium"
                      placeholder="10-digit number" 
                    />
                  </div>
                </div>
              </div>

              {/* Service Specific Info */}
              <div className="space-y-4">
                {formData.type === 'doctor' && (
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Select Doctor</label>
                    <select 
                      required
                      value={formData.doctorId}
                      onChange={e => {
                        const doc = doctors.find(d => d.id === e.target.value);
                        setFormData({...formData, doctorId: e.target.value, doctorName: doc?.name || ""});
                      }}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 outline-none focus:ring-2 focus:ring-primary transition-all font-medium"
                    >
                      <option value="">-- Choose Doctor --</option>
                      {doctors.map(d => <option key={d.id} value={d.id}>{d.name} ({d.specialty})</option>)}
                    </select>
                  </div>
                )}

                {formData.type === 'lab' && (
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Test Type</label>
                    <input 
                      required
                      type="text" 
                      value={formData.testType}
                      onChange={e => setFormData({...formData, testType: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 outline-none focus:ring-2 focus:ring-primary transition-all font-medium"
                      placeholder="E.g. CBC, Diabetes Profile" 
                    />
                  </div>
                )}

                {formData.type === 'medicine' && (
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Delivery Address</label>
                    <textarea 
                      required
                      value={formData.address}
                      onChange={e => setFormData({...formData, address: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 outline-none focus:ring-2 focus:ring-primary transition-all font-medium h-24 resize-none"
                      placeholder="Street, City, Pincode" 
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Date</label>
                    <div className="relative">
                       <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                       <input 
                         required
                         type="date" 
                         value={formData.date}
                         onChange={e => setFormData({...formData, date: e.target.value})}
                         className="w-full pl-10 pr-3 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 outline-none focus:ring-2 focus:ring-primary transition-all text-sm font-medium"
                       />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Time</label>
                    <div className="relative">
                       <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                       <input 
                         required
                         type="time" 
                         value={formData.time}
                         onChange={e => setFormData({...formData, time: e.target.value})}
                         className="w-full pl-10 pr-3 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 outline-none focus:ring-2 focus:ring-primary transition-all text-sm font-medium"
                       />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Administrative Notes</label>
              <textarea 
                value={formData.notes}
                onChange={e => setFormData({...formData, notes: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 outline-none focus:ring-2 focus:ring-primary transition-all font-medium h-20 resize-none text-sm"
                placeholder="Added by admin/subadmin for internal tracking" 
              />
            </div>

            <div className="pt-6">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-4 bg-primary hover:bg-primary-hover text-white rounded-2xl font-black text-lg shadow-xl shadow-primary/20 transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-3"
              >
                <Save size={20} />
                {loading ? "Registering..." : "Create Booking"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminSidebarLayout>
  );
}

const ServiceTypeTab = ({ active, onClick, icon, label }: any) => (
  <button 
    type="button" 
    onClick={onClick}
    className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all gap-2 font-black text-xs uppercase tracking-widest ${
      active 
        ? "border-primary bg-primary/5 text-primary shadow-inner" 
        : "border-slate-100 dark:border-slate-700 text-slate-400 hover:border-slate-200 dark:hover:border-slate-600"
    }`}
  >
    {icon}
    {label}
  </button>
);

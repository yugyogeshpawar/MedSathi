"use client";

import { useState, useEffect } from "react";
import { X, User, Phone, Calendar, Clock, Save, AlertCircle } from "lucide-react";
import { secureFetch } from "@/services/firebaseService";
import toast from "react-hot-toast";

interface EditBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: any;
  onSuccess: () => void;
}

export default function EditBookingModal({ isOpen, onClose, booking, onSuccess }: EditBookingModalProps) {
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    name: booking.name || "",
    phone: booking.phone || "",
    date: booking.date || "",
    time: booking.raw?.time || "",
    status: booking.status || "Pending",
    doctorId: booking.raw?.doctorId || "",
    doctorName: booking.raw?.doctorName || "",
    testType: booking.raw?.testType || "",
    address: booking.raw?.address || "",
    notes: booking.raw?.notes || ""
  });

  useEffect(() => {
    if (booking.type === "doctor") {
      fetchDoctors();
    }
  }, [booking.type]);

  const fetchDoctors = async () => {
    try {
      const res = await fetch("/api/doctors");
      const json = await res.json();
      if (json.success) setDoctors(json.data.filter((d: any) => d.status === "Active"));
    } catch (e) {}
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const loadingToast = toast.loading("Saving changes...");

    try {
      const res = await secureFetch(`/api/bookings/${booking.id}`, {
        method: "PUT",
        body: JSON.stringify({
          ...formData,
          type: booking.type
        })
      });
      const json = await res.json();

      if (json.success) {
        toast.success("Booking updated!", { id: loadingToast });
        onSuccess();
        onClose();
      } else {
        toast.error(json.error || "Save failed", { id: loadingToast });
      }
    } catch (err) {
      toast.error("Network error", { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 backdrop-blur-md bg-slate-900/60 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-800 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700 animate-in zoom-in-95 duration-300">
        <div className="p-6 border-b border-slate-100 dark:border-slate-700/50 flex justify-between items-center bg-slate-50 dark:bg-slate-900/20">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">Edit {booking.type} Booking</h2>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Ref ID: {booking.id.slice(-8)}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Patient Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  required
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-primary transition-all font-medium text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Phone Number</label>
              <div className="relative">
                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  required
                  type="tel" 
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-primary transition-all font-medium text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Date</label>
                <div className="relative">
                  <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    required
                    type="text" 
                    value={formData.date}
                    onChange={e => setFormData({...formData, date: e.target.value})}
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-primary transition-all font-medium text-xs"
                    placeholder="YYYY-MM-DD"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Time</label>
                <div className="relative">
                  <Clock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    value={formData.time}
                    onChange={e => setFormData({...formData, time: e.target.value})}
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-primary transition-all font-medium text-xs"
                    placeholder="HH:MM"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Booking Status</label>
              <select 
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value})}
                className={`w-full px-4 py-2.5 rounded-xl border-2 outline-none font-bold text-sm cursor-pointer transition-all ${
                   formData.status === 'Completed' ? 'border-green-500 bg-green-50/50 text-green-700' :
                   formData.status === 'Cancelled' ? 'border-red-500 bg-red-50/50 text-red-700' :
                   formData.status === 'Confirmed' ? 'border-blue-500 bg-blue-50/50 text-blue-700' :
                   'border-yellow-500 bg-yellow-50/50 text-yellow-700'
                }`}
              >
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            {booking.type === "doctor" && (
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Assign Doctor</label>
                <select 
                  value={formData.doctorId}
                  onChange={e => {
                    const doc = doctors.find(d => d.id === e.target.value);
                    setFormData({...formData, doctorId: e.target.value, doctorName: doc?.name || ""});
                  }}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-primary transition-all font-medium text-sm"
                >
                  <option value="">-- No Doctor Assigned --</option>
                  {doctors.map(d => <option key={d.id} value={d.id}>{d.name} ({d.specialty})</option>)}
                </select>
              </div>
            )}

            {booking.type === "lab" && (
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Test Type</label>
                <input 
                  type="text" 
                  value={formData.testType}
                  onChange={e => setFormData({...formData, testType: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-primary transition-all font-medium text-sm"
                />
              </div>
            )}

            {booking.type === "medicine" && (
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Delivery Address</label>
                <textarea 
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-primary transition-all font-medium text-sm h-20 resize-none"
                />
              </div>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Administrative Notes</label>
            <textarea 
              value={formData.notes}
              onChange={e => setFormData({...formData, notes: e.target.value})}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-primary transition-all font-medium text-sm h-24 resize-none"
              placeholder="Why was this update made? (Optional)"
            />
          </div>

          <div className="md:col-span-2 flex gap-4 pt-4">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 py-3.5 rounded-2xl font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all text-sm"
            >
              Discard Changes
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="flex-[2] py-3.5 bg-primary hover:bg-primary-hover text-white rounded-2xl font-black text-sm shadow-xl shadow-primary/20 transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2"
            >
              <Save size={18} />
              {loading ? "Updating..." : "Save Changes"}
            </button>
          </div>

          {formData.status === 'Cancelled' && (
            <div className="md:col-span-2 flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 rounded-xl border border-red-100 dark:border-red-900/20 text-xs font-bold leading-tight">
               <AlertCircle size={14} className="shrink-0" />
               Warning: Marking this as cancelled will halt payout processing.
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

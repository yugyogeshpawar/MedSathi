"use client";

import { useEffect, useState } from "react";
import AdminSidebarLayout from "@/components/AdminSidebarLayout";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Clock, Plus, Trash2, CalendarDays, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import { secureFetch } from "@/services/firebaseService";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function AvailabilityPage() {
  const [doctorsList, setDoctorsList] = useState<any[]>([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>("");
  const [date, setDate] = useState<Value>(new Date());
  
  const [slots, setSlots] = useState<string[]>([]);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [newSlot, setNewSlot] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetch("/api/doctors")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setDoctorsList(data.data.filter((d: any) => d.status === "Active"));
        }
      });
  }, []);

  useEffect(() => {
    if (!selectedDoctorId || !date) return;
    
    setIsLoading(true);
    const dateStr = (date as Date).toISOString().split('T')[0];
    
    fetch(`/api/availability?doctorId=${selectedDoctorId}&date=${dateStr}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setSlots(data.data.slots || []);
          setBookedSlots(data.data.bookedSlots || []);
        } else {
          setSlots([]);
          setBookedSlots([]);
        }
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
        setSlots([]);
      });
  }, [selectedDoctorId, date]);

  const handleAddSlot = () => {
    if (!newSlot) return;
    if (slots.includes(newSlot)) {
      toast.error("Slot already exists");
      return;
    }
    setSlots([...slots, newSlot].sort());
    setNewSlot("");
  };

  const handleRemoveSlot = (slot: string) => {
    if (bookedSlots.includes(slot)) {
      toast.error("Cannot remove a slot that is already booked");
      return;
    }
    setSlots(slots.filter(s => s !== slot));
  };

  const handleSave = async () => {
    if (!selectedDoctorId || !date) return;
    setIsSaving(true);
    const dateStr = (date as Date).toISOString().split('T')[0];
    
    try {
      const res = await secureFetch("/api/availability", {
        method: "POST",
        body: JSON.stringify({ doctorId: selectedDoctorId, date: dateStr, slots })
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Availability updated");
      } else {
        toast.error("Failed to update availability");
      }
    } catch (e) {
      toast.error("Error connecting to server");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminSidebarLayout activeMenu="Availability">
      <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-8">
        
        {/* Left Side: Controls & Calendar */}
        <div className="flex-1 space-y-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-primary" />
              1. Select Doctor
            </h2>
            <select 
              className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
              value={selectedDoctorId}
              onChange={e => setSelectedDoctorId(e.target.value)}
            >
              <option value="">-- Choose a doctor --</option>
              {doctorsList.map(doc => (
                <option key={doc.id} value={doc.id}>{doc.name} - {doc.specialty}</option>
              ))}
            </select>
          </div>

          <div className={`bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm transition-opacity ${!selectedDoctorId ? 'opacity-50 pointer-events-none' : ''}`}>
             <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-primary" />
              2. Select Date
            </h2>
            <div className="calendar-container w-full overflow-hidden flex justify-center">
              <Calendar onChange={setDate} value={date} className="w-full border-0 font-sans shadow-none text-slate-800 dark:text-slate-800" />
            </div>
          </div>
        </div>

        {/* Right Side: Slots */}
        <div className={`flex-1 ${!selectedDoctorId ? 'opacity-50 pointer-events-none' : ''}`}>
           <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm sticky top-6">
             <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-1 flex items-center gap-2">
               <Clock className="w-5 h-5 text-primary" />
               3. Manage Time Slots
             </h2>
             <p className="text-slate-500 mb-6 text-sm">
               For {date ? (date as Date).toLocaleDateString() : ""}
             </p>

             {isLoading ? (
               <div className="text-center py-10 text-slate-500">Loading slots...</div>
             ) : (
               <div className="space-y-6">
                 
                 <div className="flex gap-2">
                   <input 
                     type="time" 
                     value={newSlot}
                     onChange={e => setNewSlot(e.target.value)}
                     className="flex-1 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white outline-none"
                   />
                   <button 
                     onClick={handleAddSlot}
                     className="bg-primary hover:bg-primary-hover text-white p-2 rounded-xl flex items-center justify-center transition-colors shadow-sm"
                   >
                     <Plus className="w-6 h-6" />
                   </button>
                 </div>

                 {slots.length === 0 ? (
                    <div className="text-center py-6 text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
                      No slots configured for this day.
                    </div>
                 ) : (
                    <div className="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                      {slots.map(slot => {
                        const isBooked = bookedSlots.includes(slot);
                        return (
                          <div key={slot} className={`flex items-center justify-between p-3 rounded-xl border ${isBooked ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/50' : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700'}`}>
                            <span className={`font-semibold flex items-center gap-2 ${isBooked ? 'text-red-700 dark:text-red-400' : 'text-slate-700 dark:text-slate-300'}`}>
                              {slot} {isBooked && <span className="text-[10px] uppercase bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-100 px-1.5 py-0.5 rounded-full">Booked</span>}
                            </span>
                            <button 
                              onClick={() => handleRemoveSlot(slot)}
                              className={`p-1 rounded-md transition-colors ${isBooked ? 'text-slate-300 cursor-not-allowed' : 'text-red-500 hover:bg-red-100 dark:hover:bg-red-900/40'}`}
                              disabled={isBooked}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                 )}

                 <div className="pt-4 border-t border-slate-200 dark:border-slate-700 mt-6">
                    <button 
                      onClick={handleSave}
                      disabled={isSaving}
                      className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-900 font-bold py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      {isSaving ? 'Saving...' : 'Save Availability'}
                    </button>
                 </div>
               </div>
             )}

           </div>
        </div>

      </div>
    </AdminSidebarLayout>
  );
}

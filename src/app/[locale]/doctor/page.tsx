"use client";

import { useState, useEffect } from "react";
import DoctorCard, { Doctor } from "@/components/DoctorCard";
import BookingModal from "@/components/BookingModal";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import { addDoctorBooking } from "@/services/firebaseService";
import { Stethoscope, CheckCircle2, Calendar as CalendarIcon } from "lucide-react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function DoctorsPage() {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [doctorsList, setDoctorsList] = useState<any[]>([]);
  const [isFetchingDocs, setIsFetchingDocs] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const t = useTranslations("DoctorPage");

  // Availability State
  const [bookingDate, setBookingDate] = useState<Value>(new Date());
  const [bookingTime, setBookingTime] = useState("");
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [isFetchingSlots, setIsFetchingSlots] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch("/api/doctors");
        const json = await res.json();
        if (json.success) {
          const activeDocs = json.data.filter((doc: any) => doc.status === "Active");
          setDoctorsList(activeDocs);
        }
      } catch (error) {
        toast.error("Unable to load the doctor directory.");
      } finally {
        setIsFetchingDocs(false);
      }
    };
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (!selectedDoctor || !bookingDate) return;
    setIsFetchingSlots(true);
    setBookingTime("");
    
    const dateStr = (bookingDate as Date).toISOString().split('T')[0];
    fetch(`/api/availability?doctorId=${selectedDoctor.id}&date=${dateStr}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setAvailableSlots(data.data.slots || []);
          setBookedSlots(data.data.bookedSlots || []);
        } else {
          setAvailableSlots([]);
          setBookedSlots([]);
        }
        setIsFetchingSlots(false);
      })
      .catch(() => {
        setAvailableSlots([]);
        setBookedSlots([]);
        setIsFetchingSlots(false);
      });
  }, [selectedDoctor, bookingDate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedDoctor) return;
    
    if (!bookingDate || !bookingTime) {
      toast.error("Please select a valid date and time slot.");
      return;
    }

    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const dateStr = (bookingDate as Date).toISOString().split('T')[0];
    
    const data = {
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
      date: dateStr,
      time: bookingTime,
      doctorName: selectedDoctor.name,
      doctorId: selectedDoctor.id
    };

    const res = await addDoctorBooking(data);
    setIsLoading(false);

    if (res.success) {
      toast.success(t("successMessage"));
      setIsSuccess(true);
      // Remove booked slot locally
      setBookedSlots([...bookedSlots, bookingTime]);
    } else {
      toast.error("Something went wrong");
    }
  };

  const closeModal = () => {
    setSelectedDoctor(null);
    setIsSuccess(false);
    setBookingTime("");
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-10 text-center sm:text-left flex flex-col sm:flex-row items-center gap-4">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex flex-shrink-0 items-center justify-center">
          <Stethoscope className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">{t("title")}</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">{t("subtitle")}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {isFetchingDocs ? (
           <div className="col-span-1 lg:col-span-2 text-center py-20 text-slate-500 font-medium">Fetching Live Doctor Directory...</div>
        ) : doctorsList.length === 0 ? (
           <div className="col-span-1 lg:col-span-2 text-center py-20 text-slate-500 font-medium">No active doctors available currently.</div>
        ) : (
          doctorsList.map((doc: any) => (
            <DoctorCard key={doc.id} doctor={{...doc, availableDays: doc.availableSlots, experience: String(doc.experience)}} onBook={() => setSelectedDoctor(doc)} />
          ))
        )}
      </div>

      <BookingModal 
        isOpen={!!selectedDoctor} 
        onClose={closeModal}
        title={`${t("bookPrefix")} ${selectedDoctor?.name}`}
      >
        {isSuccess ? (
          <div className="text-center py-8">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{t("successMessage")}</h3>
            <a 
              href="https://wa.me/1234567890?text=Hi,%20I%20just%20booked%20an%20appointment!" 
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-6 inline-block w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-bold transition-all"
            >
              {t("trackWhatsapp")}
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t("name")}</label>
              <input required name="name" type="text" className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none" placeholder={t("namePlaceholder")} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t("phoneNumber")}</label>
              <input required name="phone" type="tel" className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none" placeholder={t("phonePlaceholder")} />
            </div>
            
            <div className="pt-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                <CalendarIcon size={16} /> Select Date & Time
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-slate-200 dark:border-slate-700 rounded-xl p-3 bg-slate-50 dark:bg-slate-800/50">
                <div className="calendar-container w-full overflow-hidden flex justify-center custom-calendar-wrapper">
                  <Calendar 
                    onChange={setBookingDate} 
                    value={bookingDate} 
                    minDate={new Date()}
                    className="w-full border-0 font-sans shadow-sm text-slate-800 dark:text-slate-800 rounded-lg overflow-hidden text-sm" 
                  />
                </div>
                
                <div className="flex flex-col h-[280px]">
                  {isFetchingSlots ? (
                    <div className="flex-1 flex items-center justify-center text-sm text-slate-500">
                      Loading available times...
                    </div>
                  ) : availableSlots.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center text-sm text-slate-500 text-center px-4 border-2 border-dashed border-slate-200 dark:border-slate-600 rounded-lg">
                      No matching slots.<br/>Choose another date.
                    </div>
                  ) : (
                    <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 grid grid-cols-2 gap-2 content-start">
                      {availableSlots.map(slot => {
                        const isBooked = bookedSlots.includes(slot);
                        return (
                          <button
                            key={slot}
                            type="button"
                            disabled={isBooked}
                            onClick={() => setBookingTime(slot)}
                            className={`py-2 px-3 text-sm rounded-lg font-medium transition-all text-center border
                              ${isBooked ? 'bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-400 dark:text-slate-500 line-through cursor-not-allowed' : 
                              bookingTime === slot ? 'bg-primary border-primary text-white shadow-md scale-[1.02]' : 
                              'bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:border-primary hover:text-primary'}
                            `}
                          >
                            {slot}
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading || !bookingTime}
              className="w-full mt-6 bg-primary hover:bg-primary-hover text-white py-3 rounded-xl font-bold transition-all shadow-md active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? t("submitting") : t("submit")}
            </button>
          </form>
        )}
      </BookingModal>
    </div>
  );
}

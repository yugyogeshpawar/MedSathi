"use client";

import { useState } from "react";
import DoctorCard, { Doctor } from "@/components/DoctorCard";
import BookingModal from "@/components/BookingModal";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";

const MOCK_DOCTORS: Doctor[] = [
  { id: "1", name: "Dr. Sarah Johnson", specialty: "Cardiologist", experience: "15", availableDays: "Mon, Wed, Fri", image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&q=80" },
  { id: "2", name: "Dr. Michael Chen", specialty: "Neurologist", experience: "12", availableDays: "Tue, Thu, Sat", image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=300&q=80" },
  { id: "3", name: "Dr. Emily Taylor", specialty: "Pediatrician", experience: "8", availableDays: "Mon-Fri", image: "https://images.unsplash.com/photo-1594824436906-bfebb3e3708a?auto=format&fit=crop&w=300&q=80" },
  { id: "4", name: "Dr. Robert Wilson", specialty: "Orthopedist", experience: "20", availableDays: "Wed, Fri", image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&q=80" },
];

export default function DoctorsPage() {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations("DoctorPage");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      toast.success(t("successMessage"));
      setSelectedDoctor(null);
    }, 1500);
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-10 text-center sm:text-left">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">{t("title")}</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">{t("subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {MOCK_DOCTORS.map(doc => (
          <DoctorCard key={doc.id} doctor={doc} onBook={setSelectedDoctor} />
        ))}
      </div>

      <BookingModal 
        isOpen={!!selectedDoctor} 
        onClose={() => !isLoading && setSelectedDoctor(null)}
        title={`${t("bookPrefix")} ${selectedDoctor?.name}`}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t("patientName")}</label>
            <input required type="text" className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-shadow" placeholder={t("namePlaceholder")} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t("phoneNumber")}</label>
            <input required type="tel" className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-shadow" placeholder={t("phonePlaceholder")} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t("date")}</label>
              <input required type="date" className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-shadow" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t("time")}</label>
              <input required type="time" className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-shadow" />
            </div>
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full mt-6 bg-primary hover:bg-primary-hover text-white py-3 rounded-xl font-bold transition-all shadow-md active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                {t("confirming")}
              </>
            ) : t("confirmButton")}
          </button>
        </form>
      </BookingModal>
    </div>
  );
}

import { User, Calendar, Clock, Award } from "lucide-react";
import { useTranslations } from "next-intl";

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  experience: string;
  availableDays: string;
  image?: string;
}

interface DoctorCardProps {
  doctor: Doctor;
  onBook: (doctor: Doctor) => void;
}

export default function DoctorCard({ doctor, onBook }: DoctorCardProps) {
  const t = useTranslations("DoctorCard");
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row gap-6 hover:shadow-md transition-shadow">
      <div className="flex-shrink-0">
        <div className="w-24 h-24 sm:w-32 sm:h-32 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center overflow-hidden border-4 border-white dark:border-slate-800 shadow-sm mx-auto sm:mx-0">
          {doctor.image ? (
            <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover" />
          ) : (
            <User className="w-12 h-12 text-slate-400" />
          )}
        </div>
      </div>
      
      <div className="flex flex-col justify-between flex-grow text-center sm:text-left">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">{doctor.name}</h3>
          <p className="text-primary font-medium mb-3">{doctor.specialty}</p>
          
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-sm text-slate-600 dark:text-slate-400 mb-4">
            <div className="flex items-center justify-center sm:justify-start gap-1">
              <Award className="w-4 h-4 text-slate-400" />
              <span>{doctor.experience} {t("exp")}</span>
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-1">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>{doctor.availableDays}</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 sm:mt-0 flex justify-center sm:justify-start">
          <button
            onClick={() => onBook(doctor)}
            className="w-full sm:w-auto bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-full font-medium transition-all shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <Clock className="w-4 h-4" />
            {t("bookAppointment")}
          </button>
        </div>
      </div>
    </div>
  );
}

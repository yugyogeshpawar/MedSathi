"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Pill, UploadCloud, MapPin, Phone, CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { addMedicineOrder } from "@/services/firebaseService";

export default function MedicinesPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const t = useTranslations("MedicinePage");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      toast.error(t("errorNoFile"));
      return;
    }
    
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = {
      phone: formData.get("phone") as string,
      address: formData.get("address") as string,
      prescriptionFile: file
    };

    const res = await addMedicineOrder(data);
    setIsLoading(false);

    if (res.success) {
      toast.success(t("successMessage"));
      setIsSuccess(true);
      (e.target as HTMLFormElement).reset();
      setFile(null);
    } else {
      toast.error("Something went wrong");
    }
  };

  if (isSuccess) {
    return (
      <div className="py-24 px-4 max-w-lg mx-auto text-center">
        <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6" />
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4">{t("successMessage")}</h2>
        <a 
          href={`https://wa.me/1234567890?text=Hi,%20I%20just%20ordered%20medicines!`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="mt-6 inline-block w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl font-bold text-lg transition-all"
        >
          {t("trackWhatsapp")}
        </a>
        <button onClick={() => setIsSuccess(false)} className="mt-4 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:underline">
          Order more medicines
        </button>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      <div className="mb-10 text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Pill className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">{t("title")}</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">{t("subtitle")}</p>
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-700">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t("uploadTitle")}</label>
            <div className="w-full flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer relative overflow-hidden group">
              <input 
                type="file" 
                accept="image/*,.pdf" 
                onChange={handleFileChange} 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
              />
              <UploadCloud className="w-10 h-10 text-primary mb-3 group-hover:scale-110 transition-transform" />
              {file ? (
                <div className="text-center">
                  <p className="text-primary font-medium">{file.name}</p>
                  <p className="text-sm text-slate-500 mt-1">{t("clickToChange")}</p>
                </div>
              ) : (
                <div className="text-center">
                  <p className="font-medium text-slate-700 dark:text-slate-300">{t("clickToUpload")}</p>
                  <p className="text-sm text-slate-500 mt-1">{t("uploadHelp")}</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-400" />
              {t("address")}
            </label>
            <textarea required name="address" rows={3} className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all resize-none" placeholder={t("addressPlaceholder")} />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-2">
              <Phone className="w-4 h-4 text-slate-400" />
              {t("phoneNumber")}
            </label>
            <input required name="phone" type="tel" className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all" placeholder={t("phonePlaceholder")} />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary-hover text-white py-4 rounded-xl font-bold text-lg transition-all shadow-lg active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
          >
            {isLoading ? t("submitting") : t("submit")}
          </button>
        </form>
      </div>
    </div>
  );
}

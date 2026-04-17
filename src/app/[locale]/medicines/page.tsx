"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Pill, UploadCloud, MapPin, Phone } from "lucide-react";
import { useTranslations } from "next-intl";

export default function MedicinesPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const t = useTranslations("MedicinePage");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName) {
      toast.error(t("errorNoFile"));
      return;
    }
    
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      toast.success(t("successMessage"));
      (e.target as HTMLFormElement).reset();
      setFileName(null);
    }, 1500);
  };

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
              {fileName ? (
                <div className="text-center">
                  <p className="text-primary font-medium">{fileName}</p>
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
            <textarea required rows={3} className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all resize-none" placeholder={t("addressPlaceholder")} />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-2">
              <Phone className="w-4 h-4 text-slate-400" />
              {t("phoneNumber")}
            </label>
            <input required type="tel" className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all" placeholder={t("phonePlaceholder")} />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary-hover text-white py-4 rounded-xl font-bold text-lg transition-all shadow-lg active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
          >
            {isLoading ? t("processing") : t("placeOrder")}
          </button>
        </form>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Beaker, CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { addLabBooking } from "@/services/firebaseService";

export default function LabTestsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const t = useTranslations("LabPage");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
      testType: formData.get("testType") as string,
      homeCollection: formData.get("home-collection") === "on",
      date: formData.get("date") as string,
    };

    const res = await addLabBooking(data);
    setIsLoading(false);

    if (res.success) {
      toast.success(t("successMessage"));
      setIsSuccess(true);
      (e.target as HTMLFormElement).reset();
    } else {
      toast.error("Something went wrong");
    }
  };

  const testKeys = ["cbc", "lipid", "thyroid", "diabetes", "vitaminD", "mri", "ct", "xray"];

  if (isSuccess) {
    return (
      <div className="py-24 px-4 max-w-lg mx-auto text-center">
        <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6" />
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4">{t("successMessage")}</h2>
        <a 
          href={`https://wa.me/1234567890?text=Hi,%20I%20just%20booked%20a%20lab%20test!`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="mt-6 inline-block w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl font-bold text-lg transition-all"
        >
          {t("trackWhatsapp")}
        </a>
        <button onClick={() => setIsSuccess(false)} className="mt-4 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:underline">
          Book another test
        </button>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      <div className="mb-10 text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Beaker className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">{t("title")}</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">{t("subtitle")}</p>
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-700">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t("name")}</label>
              <input required name="name" type="text" className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all" placeholder={t("namePlaceholder")} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t("phoneNumber")}</label>
              <input required name="phone" type="tel" className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all" placeholder={t("phonePlaceholder")} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t("selectTest")}</label>
            <select required name="testType" defaultValue="" className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all appearance-none">
              <option value="" disabled>{t("selectTestPlaceholder")}</option>
              {testKeys.map(key => (
                <option key={key} value={key}>{t(`tests.${key}`)}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{t("preferredDate")}</label>
            <input required name="date" type="date" className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all" />
          </div>

          <label className="flex items-center gap-3 p-4 border border-primary/20 bg-primary/5 rounded-xl cursor-pointer">
            <div className="relative flex items-start">
              <div className="flex h-6 items-center">
                <input id="home-collection" name="home-collection" type="checkbox" className="h-5 w-5 rounded border-slate-300 text-primary focus:ring-primary" />
              </div>
            </div>
            <div>
              <span className="font-medium text-slate-900 dark:text-white block">{t("homeCollection")}</span>
              <span className="text-sm text-slate-500">{t("homeCollectionDesc")}</span>
            </div>
          </label>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary-hover text-white py-4 rounded-xl font-bold text-lg transition-all shadow-lg active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? t("submitting") : t("submit")}
          </button>
        </form>
      </div>
    </div>
  );
}

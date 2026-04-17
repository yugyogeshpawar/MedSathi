"use client";

import { MessageCircle, Phone } from "lucide-react";
import { useTranslations } from "next-intl";

export default function FloatingActions() {
  const t = useTranslations("FloatingActions");
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      <a
        href="tel:+1234567890"
        className="bg-white dark:bg-slate-800 p-3 rounded-full text-primary shadow-lg hover:shadow-xl transition-all hover:scale-110 border border-slate-100 dark:border-slate-700 group flex items-center justify-center"
        aria-label={t("call")}
      >
        <Phone className="h-6 w-6" />
        <span className="absolute right-full mr-4 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          {t("call")}
        </span>
      </a>
      <a
        href="https://wa.me/1234567890"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-secondary p-3 rounded-full text-white shadow-lg shadow-secondary/30 hover:shadow-xl hover:shadow-secondary/40 transition-all hover:-translate-y-1 hover:scale-110 group flex items-center justify-center"
        aria-label={t("whatsapp")}
      >
        <MessageCircle className="h-6 w-6" />
        <span className="absolute right-full mr-4 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          {t("whatsapp")}
        </span>
      </a>
    </div>
  );
}

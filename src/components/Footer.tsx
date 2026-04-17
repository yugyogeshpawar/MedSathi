import { Activity } from "lucide-react";
import { Link } from "@/routing";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("Footer");
  return (
    <footer className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            <span className="font-bold text-lg text-slate-900 dark:text-white">MedSathi</span>
          </div>
          <div className="text-sm text-slate-500 text-center md:text-left">
            &copy; {new Date().getFullYear()} MedSathi. {t("rights")}
          </div>
          <div className="flex gap-4">
            <Link href="/" className="text-sm text-slate-500 hover:text-primary transition-colors">{t("privacy")}</Link>
            <Link href="/" className="text-sm text-slate-500 hover:text-primary transition-colors">{t("terms")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

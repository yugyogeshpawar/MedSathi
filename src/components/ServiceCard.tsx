import { Link } from "@/routing";
import { ReactNode } from "react";
import { useTranslations } from "next-intl";

interface ServiceCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  href: string;
}

export default function ServiceCard({ title, description, icon, href }: ServiceCardProps) {
  const t = useTranslations("ServiceCard");
  return (
    <Link href={href as any} className="group flex flex-col bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-transparent hover:border-slate-100 dark:hover:border-slate-700 hover:-translate-y-1">
      <div className="bg-primary/5 dark:bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 group-hover:bg-primary/10">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-slate-600 dark:text-slate-400 mb-6 flex-grow">{description}</p>
      <div className="mt-auto flex items-center text-primary font-medium group-hover:underline decoration-2 underline-offset-4">
        <span>{t("learnMore")}</span>
        <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}

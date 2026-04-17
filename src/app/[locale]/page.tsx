import { Link } from "@/routing";
import { UserPlus, Activity, Pill, ChevronRight, Phone, MessageCircle } from "lucide-react";
import ServiceCard from "@/components/ServiceCard";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("HomePage");

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative px-4 pt-20 pb-28 sm:pt-28 sm:pb-36 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-background to-background"></div>
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-primary/10 blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-secondary/10 blur-3xl opacity-50"></div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6 animate-in slide-in-from-bottom-4 duration-500">
            <Activity className="w-4 h-4" />
            <span>{t("platform")}</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6 animate-in slide-in-from-bottom-6 duration-700">
            {t("heroTitle1")} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">{t("heroTitle2")}</span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-slate-600 dark:text-slate-300 mb-10 animate-in slide-in-from-bottom-8 duration-700 delay-100">
            {t("heroSubtitle")}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in slide-in-from-bottom-10 duration-700 delay-200">
            <Link
              href="/doctor"
              className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-primary-hover text-white rounded-full font-bold text-lg transition-all shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              {t("bookDoctor")}
              <ChevronRight className="w-5 h-5" />
            </Link>
            <div className="flex w-full sm:w-auto gap-4">
              <Link
                href="/lab-tests"
                className="w-full sm:w-auto px-6 py-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 hover:border-primary dark:hover:border-primary rounded-full font-bold text-lg transition-all shadow-sm hover:shadow-md flex justify-center"
              >
                {t("labTests")}
              </Link>
              <Link
                href="/medicines"
                className="w-full sm:w-auto px-6 py-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 hover:border-primary dark:hover:border-primary rounded-full font-bold text-lg transition-all shadow-sm hover:shadow-md flex justify-center"
              >
                {t("medicines")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">{t("comprehensiveCare")}</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">{t("comprehensiveDesc")}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ServiceCard
              title={t("serviceDocTitle")}
              description={t("serviceDocDesc")}
              icon={<UserPlus className="w-8 h-8 text-primary" />}
              href="/doctor"
            />
            <ServiceCard
              title={t("serviceLabTitle")}
              description={t("serviceLabDesc")}
              icon={<Activity className="w-8 h-8 text-primary" />}
              href="/lab-tests"
            />
            <ServiceCard
              title={t("serviceMedTitle")}
              description={t("serviceMedDesc")}
              icon={<Pill className="w-8 h-8 text-primary" />}
              href="/medicines"
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">{t("howItWorks")}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-[45px] left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-primary/20 via-primary/50 to-primary/20 -z-10"></div>
            
            <div className="text-center relative group">
              <div className="w-24 h-24 mx-auto bg-white dark:bg-slate-800 border-[8px] border-slate-50 dark:border-slate-900 rounded-full flex items-center justify-center text-2xl font-bold text-primary shadow-xl shadow-primary/10 mb-6 group-hover:scale-110 transition-transform">1</div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{t("step1Title")}</h3>
              <p className="text-slate-600 dark:text-slate-400">{t("step1Desc")}</p>
            </div>
            
            <div className="text-center relative group">
              <div className="w-24 h-24 mx-auto bg-white dark:bg-slate-800 border-[8px] border-slate-50 dark:border-slate-900 rounded-full flex items-center justify-center text-2xl font-bold text-primary shadow-xl shadow-primary/10 mb-6 group-hover:scale-110 transition-transform">2</div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{t("step2Title")}</h3>
              <p className="text-slate-600 dark:text-slate-400">{t("step2Desc")}</p>
            </div>
            
            <div className="text-center relative group">
              <div className="w-24 h-24 mx-auto bg-white dark:bg-slate-800 border-[8px] border-slate-50 dark:border-slate-900 rounded-full flex items-center justify-center text-2xl font-bold text-primary shadow-xl shadow-primary/10 mb-6 group-hover:scale-110 transition-transform">3</div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{t("step3Title")}</h3>
              <p className="text-slate-600 dark:text-slate-400">{t("step3Desc")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Section */}
      <section className="py-16 bg-gradient-to-br from-primary to-blue-800 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary opacity-20 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
        
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">{t("emergencyTitle")}</h2>
          <p className="text-xl text-blue-100 mb-10">{t("emergencyDesc")}</p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <a href="tel:+1234567890" className="w-full sm:w-auto bg-white text-primary px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 flex items-center justify-center gap-3">
              <Phone className="w-5 h-5" />
              {t("callNow")}
            </a>
            <a href="https://wa.me/1234567890" className="w-full sm:w-auto bg-secondary text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 flex items-center justify-center gap-3">
              <MessageCircle className="w-5 h-5" />
              {t("whatsappUs")}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

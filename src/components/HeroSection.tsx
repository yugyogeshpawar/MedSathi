import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/routing";
import { ChevronRight } from "lucide-react";

export default function HeroSection() {
  const t = useTranslations("HomePage");

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/bg-hero-primary.png"
          alt="Healthcare hero background"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Dark Overlays for Readability */}
        <div className="absolute inset-0 bg-black/50 dark:bg-black/70 transition-colors duration-300"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center justify-center w-full">
        
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white backdrop-blur-md text-sm font-semibold mb-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
          <span className="drop-shadow-sm">{t("platform")}</span>
        </div>
        
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 drop-shadow-lg animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
          {t("heroTitle1")} <span className="text-blue-300 dark:text-blue-400">{t("heroTitle2")}</span>
        </h1>
        
        <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-100 dark:text-slate-200 mb-12 drop-shadow-md animate-in fade-in slide-in-from-bottom-10 duration-700 delay-200 leading-relaxed font-medium">
          {t("heroSubtitle")}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center w-full sm:w-auto gap-4 animate-in fade-in slide-in-from-bottom-12 duration-700 delay-300">
          <Link
            href="/doctor"
            className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-primary-hover text-white rounded-full font-bold text-lg transition-all shadow-xl hover:shadow-primary/50 hover:-translate-y-1 flex items-center justify-center gap-2"
          >
            {t("bookDoctor")}
            <ChevronRight className="w-5 h-5" />
          </Link>
          
          <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-4">
            <Link
              href="/lab-tests"
              className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-full font-bold text-lg transition-all hover:-translate-y-1 flex justify-center text-center shadow-lg"
            >
              {t("labTests")}
            </Link>
            <Link
              href="/medicines"
              className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-full font-bold text-lg transition-all hover:-translate-y-1 flex justify-center text-center shadow-lg"
            >
              {t("medicines")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

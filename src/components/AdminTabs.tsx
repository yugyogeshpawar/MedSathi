"use client";

interface AdminTabsProps {
  tabs: string[];
  activeTab: string;
  onChange: (tab: string) => void;
}

export default function AdminTabs({ tabs, activeTab, onChange }: AdminTabsProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-8 border-b border-slate-200 dark:border-slate-800 pb-px">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`px-8 py-4 font-bold text-sm rounded-t-xl transition-all border-b-2 ${
            activeTab === tab 
              ? "bg-white dark:bg-slate-800 text-primary border-primary shadow-sm -mb-[2px] relative z-10" 
              : "bg-slate-50 dark:bg-slate-900/50 text-slate-500 border-transparent hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

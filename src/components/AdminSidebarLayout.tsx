"use client";

import { useAuth } from "@/context/AuthContext";
import { LogOut, Activity, Users, Settings, History, ShieldAlert } from "lucide-react";
import { Link } from "@/routing";
import NotificationBell from "./NotificationBell";

export default function AdminSidebarLayout({ children, activeMenu }: { children: React.ReactNode, activeMenu: string }) {
  const { user, logout, role, hasPermission } = useAuth();

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans mt-0 pt-0 absolute top-0 left-0 w-full z-50 overflow-hidden">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col hidden sm:flex">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-extrabold text-primary flex items-center gap-2">
            <Activity className="w-6 h-6" />
            CRM
          </h2>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {hasPermission("overview") && <SidebarItem icon={<Users size={20} />} label="Overview" active={activeMenu === "Overview"} href="/admin" />}
          {hasPermission("dashboard") && <SidebarItem icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>} label="Dashboard" active={activeMenu === "Dashboard"} href="/admin/dashboard" />}
          {hasPermission("doctors") && <SidebarItem icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>} label="Doctors" active={activeMenu === "Doctors"} href="/admin/doctors" />}
          {hasPermission("availability") && <SidebarItem icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} label="Availability" active={activeMenu === "Availability"} href="/admin/availability" />}
          {hasPermission("patients") && <SidebarItem icon={<Users size={20} />} label="Patients" active={activeMenu === "Patients"} href="/admin/patients" />}
          {hasPermission("payouts") && <SidebarItem icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>} label="Payouts" active={activeMenu === "Payouts"} href="/admin/payouts" />}
          {hasPermission("team") && <SidebarItem icon={<Users size={20} />} label="Team" active={activeMenu === "Team"} href="/admin/users" />}
          <SidebarItem icon={<Settings size={20} />} label="Settings" active={activeMenu === "Settings"} href="/admin" />
          <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-700/50">
            <p className="px-4 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Logs & Security</p>
            {role === 'admin' && <SidebarItem icon={<History size={18} />} label="Activity Logs" active={activeMenu === "Logs"} href="/admin/logs" />}
            {role === 'admin' && <SidebarItem icon={<ShieldAlert size={18} />} label="Audit Trail" active={activeMenu === "Audit"} href="/admin/audit" />}
          </div>
        </nav>
        
        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
              {user?.email?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate">{user?.email || 'Admin'}</p>
              <p className="text-xs text-slate-500 capitalize">{role || 'Administrator'}</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="w-full flex items-center gap-2 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors font-medium"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Desktop/Mobile Shared Header */}
        <header className="bg-white dark:bg-slate-800 p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center z-[100] shadow-sm">
          <div className="flex items-center gap-4">
             <h2 className="sm:hidden text-xl font-extrabold text-primary flex items-center gap-2">
               <Activity className="w-5 h-5" />
               CRM
             </h2>
             <div className="hidden sm:block">
               <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">MedSathi / {activeMenu}</span>
             </div>
          </div>
          
          <div className="flex items-center gap-2">
            <NotificationBell />
            <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block"></div>
            <button 
              onClick={logout} 
              className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
              title="Sign Out"
            >
               <LogOut size={20} />
            </button>
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar relative z-0">
          {children}
        </div>
      </main>

    </div>
  );
}

const SidebarItem = ({ icon, label, active, href }: { icon: React.ReactNode, label: string, active: boolean, href: string }) => (
  <Link href={href as any} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
    active 
      ? "bg-primary text-white shadow-md" 
      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
  }`}>
    {icon}
    {label}
  </Link>
);

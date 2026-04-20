"use client";

import AdminSidebarLayout from "@/components/AdminSidebarLayout";
import ProfileForm from "@/components/ProfileForm";
import ChangePasswordForm from "@/components/ChangePasswordForm";
import { Settings, ShieldCheck, Mail, UserCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function SettingsPage() {
  const { user, role } = useAuth();

  return (
    <AdminSidebarLayout activeMenu="Settings">
      <div className="max-w-5xl mx-auto pb-20">
        <div className="mb-10">
          <h1 className="text-4xl font-black text-slate-900 dark:text-white flex items-center gap-4">
             <Settings className="w-10 h-10 text-primary animate-spin-slow" />
             Account Settings
          </h1>
          <p className="text-slate-500 font-medium text-lg mt-2">Manage your administrative profile and account security.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Sidebar / Quick Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 shadow-xl">
               <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-4xl mb-4 border-4 border-white dark:border-slate-700 shadow-lg">
                    {user?.displayName?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
                  </div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">{user?.displayName || "Admin User"}</h2>
                  <div className={`mt-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    role === 'admin' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {role || 'Subadmin'} Access
                  </div>
               </div>

               <div className="mt-8 space-y-4 pt-8 border-t border-slate-100 dark:border-slate-700/50">
                  <div className="flex items-center gap-3 text-slate-500">
                     <Mail size={16} className="text-slate-400" />
                     <span className="text-sm font-medium truncate">{user?.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-500 text-xs">
                     <UserCheck size={16} className="text-slate-400" />
                     <span className="font-medium">Active Session</span>
                  </div>
               </div>
            </div>

            <div className="p-6 bg-primary/5 rounded-3xl border border-primary/10">
               <div className="flex gap-4 items-start">
                  <ShieldCheck className="text-primary shrink-0" size={24} />
                  <div>
                    <h4 className="text-sm font-black text-slate-900 dark:text-white mb-1">Security Tip</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      We recommend using a unique password for your MedSathi admin account and updating it periodically.
                    </p>
                  </div>
               </div>
            </div>
          </div>

          {/* Main Forms */}
          <div className="lg:col-span-2 space-y-10">
            <ProfileForm />
            <ChangePasswordForm />
          </div>
        </div>
      </div>
    </AdminSidebarLayout>
  );
}

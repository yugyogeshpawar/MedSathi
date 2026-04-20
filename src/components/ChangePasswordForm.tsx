"use client";

import { useState } from "react";
import { Lock, ShieldCheck, Eye, EyeOff } from "lucide-react";
import { secureFetch } from "@/services/firebaseService";
import toast from "react-hot-toast";

export default function ChangePasswordForm() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      return toast.error("New passwords do not match");
    }
    if (formData.newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    setLoading(true);
    const loadingToast = toast.loading("Checking credentials...");

    try {
      const res = await secureFetch("/api/users/change-password", {
        method: "POST",
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        })
      });
      const json = await res.json();

      if (json.success) {
        toast.success("Password changed successfully", { id: loadingToast });
        setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        toast.error(json.error || "Failed to update password", { id: loadingToast });
      }
    } catch (err) {
      toast.error("Network error", { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden animate-in slide-in-from-bottom-4">
      <div className="p-6 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/20">
        <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="text-red-500" size={20} />
          Account Security
        </h3>
        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Change your login password</p>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Current Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                required
                type={showPass ? "text" : "password"}
                value={formData.currentPassword}
                onChange={e => setFormData({...formData, currentPassword: e.target.value})}
                className="w-full pl-10 pr-12 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-primary transition-all font-medium"
                placeholder="••••••••"
              />
              <button 
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-700/50">
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">New Password</label>
            <input 
              required
              type="password" 
              value={formData.newPassword}
              onChange={e => setFormData({...formData, newPassword: e.target.value})}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-primary transition-all font-medium mb-3"
              placeholder="Min. 6 characters"
            />
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Confirm New Password</label>
            <input 
              required
              type="password" 
              value={formData.confirmPassword}
              onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-primary transition-all font-medium"
              placeholder="Repeat your new password"
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-sm shadow-xl transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2"
        >
          <Lock size={18} />
          {loading ? "Verifying..." : "Change Password"}
        </button>
      </form>
    </div>
  );
}

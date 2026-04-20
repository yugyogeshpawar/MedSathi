"use client";

import { useState } from "react";
import { User, Save } from "lucide-react";
import { secureFetch } from "@/services/firebaseService";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";

export default function ProfileForm() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.displayName || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const loadingToast = toast.loading("Updating profile...");

    try {
      const res = await secureFetch("/api/users/profile", {
        method: "PATCH",
        body: JSON.stringify({ name })
      });
      const json = await res.json();

      if (json.success) {
        toast.success("Profile updated successfully", { id: loadingToast });
        // The AuthContext has a listener, so UI will update automatically
      } else {
        toast.error(json.error || "Update failed", { id: loadingToast });
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
          <User className="text-primary" size={20} />
          Profile Information
        </h3>
        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Manage your public identity</p>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Display Name</label>
            <div className="relative">
              <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                required
                type="text" 
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-primary transition-all font-medium"
                placeholder="Your Name"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Email Address (Read-only)</label>
            <div className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 font-medium opacity-70">
              {user?.email}
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-4 bg-primary hover:bg-primary-hover text-white rounded-2xl font-black text-sm shadow-xl shadow-primary/20 transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2"
        >
          <Save size={18} />
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
}

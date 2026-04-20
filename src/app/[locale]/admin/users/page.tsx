"use client";

import { useEffect, useState } from "react";
import AdminSidebarLayout from "@/components/AdminSidebarLayout";
import { getAllUsers, deleteUser, createSubadmin, updateUser, UserRecord } from "@/services/userService";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "@/routing";
import { Plus, Trash2, User, Mail, Shield, UserPlus, Edit, Check } from "lucide-react";
import toast from "react-hot-toast";

const MODULES = [
  { id: "overview", label: "Overview (Bookings)" },
  { id: "dashboard", label: "Analytics Dashboard" },
  { id: "doctors", label: "Doctor Management" },
  { id: "availability", label: "Scheduling & Availability" },
  { id: "patients", label: "Patient CRM" },
  { id: "payouts", label: "Financial Payouts" },
];

export default function UsersManagementPage() {
  const { role, loading: authLoading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserRecord | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", permissions: [] as string[] });

  useEffect(() => {
    if (!authLoading && role && role !== "admin") {
      router.push("/admin" as any);
      toast.error("Access denied: Admin only");
    }
  }, [role, authLoading, router]);

  useEffect(() => {
    if (role === "admin") {
      fetchUsers();
    }
  }, [role]);

  const fetchUsers = async () => {
    setLoading(true);
    const data = await getAllUsers();
    setUsers(data);
    setLoading(false);
  };

  const togglePermission = (moduleId: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(moduleId)
        ? prev.permissions.filter(id => id !== moduleId)
        : [...prev.permissions, moduleId]
    }));
  };

  const openEditModal = (user: UserRecord) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: "", // Not needed for edit
      permissions: user.permissions || []
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, email: string) => {
    if (confirm(`Are you sure you want to remove ${email}?`)) {
      const res = await deleteUser(id);
      if (res.success) {
        toast.success("User removed successfully");
        fetchUsers();
      } else {
        toast.error(res.error || "Failed to delete user");
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const loadingToast = toast.loading(editingUser ? "Updating user..." : "Creating subadmin...");
    
    try {
      let res;
      if (editingUser) {
        // Update existing user
        res = await updateUser(editingUser.id, {
          name: formData.name,
          permissions: formData.permissions
        });
      } else {
        // Create new subadmin
        res = await createSubadmin(formData);
      }

      if (res.success) {
        toast.success(editingUser ? "User updated" : "Subadmin created", { id: loadingToast });
        setIsModalOpen(false);
        setEditingUser(null);
        setFormData({ name: "", email: "", password: "", permissions: [] });
        fetchUsers();
      } else {
        toast.error(res.error || "Operation failed", { id: loadingToast });
      }
    } catch (err: any) {
      console.error("Save error:", err);
      toast.error(`Connection error: ${err.message}`, { id: loadingToast });
    }
  };

  if (authLoading || (role && role !== "admin")) return null;

  return (
    <AdminSidebarLayout activeMenu="Team">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Team Management</h1>
            <p className="text-slate-500 font-medium">Control access levels and manage administrative users.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-2xl font-bold shadow-lg transition-all active:scale-95"
          >
            <UserPlus size={20} /> Add Subadmin
          </button>
        </div>

        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                  <th className="px-6 py-4 font-bold text-sm text-slate-600 dark:text-slate-400">Identity</th>
                  <th className="px-6 py-4 font-bold text-sm text-slate-600 dark:text-slate-400">Email Address</th>
                  <th className="px-6 py-4 font-bold text-sm text-slate-600 dark:text-slate-400">Privileges</th>
                  <th className="px-6 py-4 font-bold text-sm text-slate-600 dark:text-slate-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {loading ? (
                  <tr><td colSpan={4} className="py-20 text-center text-slate-500 font-medium italic">Scanning active registry...</td></tr>
                ) : users.length === 0 ? (
                  <tr><td colSpan={4} className="py-20 text-center text-slate-500 font-medium">No team members found.</td></tr>
                ) : (
                  users.map(u => (
                    <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <User size={20} />
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white">{u.name}</div>
                            <div className="text-[10px] text-slate-400">Registered {new Date(u.createdAt).toLocaleDateString()}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-600 dark:text-slate-400">{u.email}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          u.role === "admin" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                        }`}>
                          <Shield size={12} /> {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right flex justify-end gap-2">
                        <button 
                          onClick={() => openEditModal(u)}
                          className="p-2.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all hover:scale-110"
                          title="Edit Permissions"
                        >
                          <Edit size={20} />
                        </button>
                        {u.role !== "admin" && (
                          <button 
                            onClick={() => handleDelete(u.id, u.email)}
                            className="p-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all hover:scale-110"
                            title="Remove User"
                          >
                            <Trash2 size={20} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md bg-slate-900/40 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-3xl shadow-2xl p-8 border border-slate-200 dark:border-slate-700 animate-in zoom-in-95 duration-300 overflow-y-auto max-h-[90vh]">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
              {editingUser ? "Edit Permissions" : "Invite Subadmin"}
            </h2>
            <p className="text-slate-500 text-sm mb-6">
              {editingUser ? `Updating access for ${editingUser.email}` : "Create a limited-access portal for your team."}
            </p>
            
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Display Name</label>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 outline-none focus:ring-2 focus:ring-primary transition-all font-medium" placeholder="E.g. Dr. John Doe" />
                  </div>
                </div>
                {!editingUser && (
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Account Email</label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 outline-none focus:ring-2 focus:ring-primary transition-all font-medium" placeholder="staff@medSathi.com" />
                    </div>
                  </div>
                )}
              </div>

              {!editingUser && (
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Temporary Password</label>
                  <input required type="text" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 outline-none focus:ring-2 focus:ring-primary transition-all font-medium" placeholder="Min 6 characters" minLength={6} />
                </div>
              )}

              <div className="pt-4">
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Module Permissions</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                   {MODULES.map(module => (
                     <button
                       key={module.id}
                       type="button"
                       onClick={() => togglePermission(module.id)}
                       className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all font-bold text-left ${
                         formData.permissions.includes(module.id)
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-slate-100 dark:border-slate-700 text-slate-500"
                       }`}
                     >
                       <span className="text-sm">{module.label}</span>
                       {formData.permissions.includes(module.id) && <Check size={16} />}
                     </button>
                   ))}
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button type="button" onClick={() => { setIsModalOpen(false); setEditingUser(null); }} className="flex-1 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-all">Cancel</button>
                <button type="submit" className="flex-1 py-3 rounded-xl font-bold bg-primary text-white shadow-lg hover:bg-primary-hover shadow-primary/20 transition-all active:scale-95">
                  {editingUser ? "Save Changes" : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminSidebarLayout>
  );
}

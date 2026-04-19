"use client";

import { useEffect, useState } from "react";
import AdminSidebarLayout from "@/components/AdminSidebarLayout";
import DoctorTable from "@/components/DoctorTable";
import DoctorFormModal from "@/components/DoctorFormModal";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "@/routing";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";

export default function DoctorsDirectoryPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  useEffect(() => {
    if (!authLoading && !user) router.replace("/admin/login");
  }, [user, authLoading, router]);

  const loadDoctors = async () => {
    if(!user) return;
    try {
      setIsLoading(true);
      const token = await (user as any).getIdToken();
      const res = await fetch("/api/doctors", {
        headers: { "Authorization": "Bearer " + token }
      });
      const json = await res.json();
      if(json.success) setDoctors(json.data);
    } catch (error) {
      toast.error("Failed to fetch developers");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDoctors();
  }, [user]);

  const handleSave = async (payload: any) => {
    const token = await (user as any).getIdToken();
    const isEdit = !!payload.id;
    const url = isEdit ? `/api/doctors/${payload.id}` : "/api/doctors";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { 
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (!data.success) throw new Error(data.error);

    toast.success(`Doctor ${isEdit ? "updated" : "added"} successfully`);
    setIsModalOpen(false);
    loadDoctors();
  };

  const handleDelete = async (id: string) => {
    try {
      const token = await (user as any).getIdToken();
      const res = await fetch(`/api/doctors/${id}`, {
        method: "DELETE",
        headers: { "Authorization": "Bearer " + token }
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      toast.success("Doctor deleted");
      loadDoctors();
    } catch(err: any) {
      toast.error(err.message);
    }
  };

  if (authLoading || !user) return <div className="h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-900"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <AdminSidebarLayout activeMenu="Doctors">
      <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto h-full">
        
        <div className="flex justify-between items-center bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white">Doctor Management</h1>
            <p className="text-slate-500 mt-1">Add, modify, or remove verified practitioners from the platform</p>
          </div>
          <button 
            onClick={() => { setSelectedDoctor(null); setIsModalOpen(true); }}
            className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md active:scale-95"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">Add Doctor</span>
          </button>
        </div>

        <DoctorTable doctors={doctors} isLoading={isLoading} onEdit={(d: any) => { setSelectedDoctor(d); setIsModalOpen(true); }} onDelete={handleDelete} />

      </div>

      <DoctorFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialData={selectedDoctor} 
        onSave={handleSave}
        getToken={() => (user as any)?.getIdToken()}
      />
    </AdminSidebarLayout>
  );
}

"use client";

import { useEffect, useState } from "react";
import AdminSidebarLayout from "@/components/AdminSidebarLayout";
import { Link } from "@/routing";
import { Search } from "lucide-react";
import { secureFetch } from "@/services/firebaseService";

export default function PatientsPage() {
  const [patients, setPatients] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    secureFetch("/api/patients")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setPatients(data.data);
        }
        setLoading(false);
      });
  }, []);

  const filtered = patients.filter(p => 
    p.name?.toLowerCase().includes(search.toLowerCase()) || 
    p.phone?.includes(search)
  );

  return (
    <AdminSidebarLayout activeMenu="Patients">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Patients</h1>
            <p className="text-slate-500">View and manage patient history</p>
          </div>
          <div className="relative w-full sm:w-auto">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name or phone..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 w-full sm:w-64 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary outline-none"
            />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                  <th className="px-6 py-4 font-semibold text-sm text-slate-600 dark:text-slate-300">Name</th>
                  <th className="px-6 py-4 font-semibold text-sm text-slate-600 dark:text-slate-300">Phone</th>
                  <th className="px-6 py-4 font-semibold text-sm text-slate-600 dark:text-slate-300">First Interaction</th>
                  <th className="px-6 py-4 font-semibold text-sm text-slate-600 dark:text-slate-300 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500">Loading patients...</td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500">No patients found.</td>
                  </tr>
                ) : (
                  filtered.map((patient) => (
                    <tr key={patient.id} className="hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{patient.name || "Unknown"}</td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{patient.phone}</td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                        {new Date(patient.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link href={`/admin/patients/${patient.id}` as any} className="text-primary hover:text-primary-hover font-medium text-sm">
                          View History
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminSidebarLayout>
  );
}

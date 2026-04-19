"use client";

import { Edit, Trash2 } from "lucide-react";

export default function DoctorTable({ doctors, isLoading, onEdit, onDelete }: any) {
  if (isLoading) return <div className="py-20 text-center text-slate-500">Loading directory...</div>;
  if (doctors.length === 0) return <div className="py-20 text-center text-slate-500">No doctors found. Build the directory!</div>;

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden overflow-x-auto w-full">
      <table className="w-full text-left whitespace-nowrap">
        <thead className="bg-slate-100 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
          <tr>
            <th className="px-6 py-4 font-semibold text-sm">Profile</th>
            <th className="px-6 py-4 font-semibold text-sm">Name & Specialty</th>
            <th className="px-6 py-4 font-semibold text-sm">Experience</th>
            <th className="px-6 py-4 font-semibold text-sm">Clinic Details</th>
            <th className="px-6 py-4 font-semibold text-sm">Status</th>
            <th className="px-6 py-4 font-semibold text-sm text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
          {doctors.map((doc: any) => (
            <tr key={doc.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <td className="px-6 py-4">
                <img 
                  src={doc.image || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop"} 
                  alt={doc.name} 
                  className="w-10 h-10 rounded-full object-cover border-2 border-slate-200 dark:border-slate-700 shadow-sm"
                />
              </td>
              <td className="px-6 py-4">
                <div className="font-bold text-slate-900 dark:text-white truncate">{doc.name}</div>
                <div className="text-sm text-slate-500">{doc.specialty}</div>
              </td>
              <td className="px-6 py-4 font-medium text-slate-700 dark:text-slate-300">
                {doc.experience} Years
              </td>
              <td className="px-6 py-4">
                <div className="font-medium text-slate-900 dark:text-gray-300">{doc.clinicName}</div>
                <div className="text-xs text-slate-500">{doc.location}</div>
              </td>
              <td className="px-6 py-4">
                <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                  doc.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                }`}>
                  {doc.status || "Active"}
                </span>
              </td>
              <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                <button 
                  onClick={() => onEdit(doc)}
                  className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  <Edit size={18} />
                </button>
                <button 
                  onClick={() => {
                    if(confirm("Confirm deletion of this Doctor identity?")) onDelete(doc.id);
                  }}
                  className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

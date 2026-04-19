import React from 'react';

export type Column = {
  key: string;
  label: string;
  render?: (val: any) => React.ReactNode;
};

interface BookingTableProps {
  columns: Column[];
  data: any[];
  isLoading: boolean;
}

export default function BookingTable({ columns, data, isLoading }: BookingTableProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-24 text-slate-500">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-3"></div>
        <span className="font-medium text-lg">Loading from Firebase...</span>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-20 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-medium text-slate-600 dark:text-slate-400">No bookings found</h3>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="px-6 py-4 font-bold text-sm tracking-wide border-b border-slate-200 dark:border-slate-700 whitespace-nowrap">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-slate-900 border-x border-slate-200 dark:border-slate-700">
          {data.map((row, idx) => (
            <tr key={row.id || idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-b border-slate-100 dark:border-slate-800 last:border-b-0">
              {columns.map((col) => (
                <td key={col.key} className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap">
                  {col.render ? col.render(row[col.key]) : row[col.key] || "-"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

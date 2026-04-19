"use client";

import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  BarChart, 
  Bar, 
  Cell 
} from "recharts";

const CustomTooltip = ({ active, payload, label, prefix = "" }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-800 p-3 border border-slate-200 dark:border-slate-700 shadow-xl rounded-lg outline-none">
        <p className="text-xs font-bold text-slate-500 mb-1">{label}</p>
        <p className="text-sm font-black text-primary">
          {prefix}{payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

export const BookingChart = ({ data }: { data: any[] }) => {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm h-[400px]">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-black text-slate-800 dark:text-white">Daily Velocity</h3>
        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-lg uppercase tracking-wider">Bookings</span>
      </div>
      <ResponsiveContainer width="100%" height="80%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fill: '#64748B', fontWeight: 700 }}
            dy={10} 
            tickFormatter={(str) => {
               const date = new Date(str);
               return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
            }}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fill: '#64748B', fontWeight: 700 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="bookings" 
            stroke="#3B82F6" 
            strokeWidth={4} 
            dot={{ r: 6, fill: '#3B82F6', strokeWidth: 2, stroke: '#fff' }} 
            activeDot={{ r: 10, strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export const RevenueChart = ({ data }: { data: any[] }) => {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm h-[400px]">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-black text-slate-800 dark:text-white">Revenue Scaling</h3>
        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-lg uppercase tracking-wider">Total(₹)</span>
      </div>
      <ResponsiveContainer width="100%" height="80%">
        <BarChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fill: '#64748B', fontWeight: 700 }}
            dy={10}
            tickFormatter={(str) => {
              const date = new Date(str);
              return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
           }}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fill: '#64748B', fontWeight: 700 }}
          />
          <Tooltip content={<CustomTooltip prefix="₹" />} />
          <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={'#10B981'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

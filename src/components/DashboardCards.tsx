import { BookOpen, IndianRupee, Users, Wallet } from "lucide-react";

interface CardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  subValue?: string;
  color: string;
}

export const DashboardCards = ({ metrics }: { metrics: any }) => {
  const cards: CardProps[] = [
    {
      title: "Total Bookings",
      value: metrics?.totalBookings || 0,
      icon: <BookOpen className="w-5 h-5" />,
      subValue: `${metrics?.todayBookings || 0} today`,
      color: "bg-blue-500"
    },
    {
      title: "Gross Revenue",
      value: `₹${(metrics?.totalRevenue || 0).toLocaleString()}`,
      icon: <IndianRupee className="w-5 h-5" />,
      subValue: `+₹${(metrics?.todayRevenue || 0).toLocaleString()} today`,
      color: "bg-green-600"
    },
    {
      title: "Active Capacity",
      value: metrics?.totalDoctors || 0,
      icon: <Users className="w-5 h-5" />,
      subValue: "Qualified partners",
      color: "bg-purple-600"
    },
    {
      title: "Pending Payouts",
      value: `₹${(metrics?.pendingPayouts || 0).toLocaleString()}`,
      icon: <Wallet className="w-5 h-5" />,
      subValue: "Liability backlog",
      color: "bg-orange-500"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, i) => (
        <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4 transition-all hover:shadow-lg">
          <div className={`${card.color} w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md`}>
            {card.icon}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-500 mb-0.5">{card.title}</p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-none mb-1">{card.value}</h3>
            {card.subValue && <p className="text-xs font-bold text-slate-400">{card.subValue}</p>}
          </div>
        </div>
      ))}
    </div>
  );
};

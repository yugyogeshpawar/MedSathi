import { adminDb } from "@/lib/firebaseAdmin";

export const getAnalytics = async () => {
  const [docs, labs, meds, payouts] = await Promise.all([
    adminDb.collection("doctorBookings").get(),
    adminDb.collection("labBookings").get(),
    adminDb.collection("medicineOrders").get(),
    adminDb.collection("payouts").get()
  ]);

  const allBookings = [
    ...docs.docs.map(d => ({ ...d.data(), type: 'doctor' })),
    ...labs.docs.map(d => ({ ...d.data(), type: 'lab' })),
    ...meds.docs.map(d => ({ ...d.data(), type: 'medicine' }))
  ];

  const today = new Date().toISOString().split('T')[0];

  // Basic Metrics
  const totalBookings = allBookings.length;
  const todayBookings = allBookings.filter((b: any) => {
    const bDate = b.createdAt ? new Date(b.createdAt).toISOString().split('T')[0] : '';
    return bDate === today;
  }).length;

  const totalRevenue = allBookings.reduce((acc: number, curr: any) => {
    // Determine amount (fallbacks to default if missing)
    let amount = Number(curr.amount || 0);
    if (!amount) {
       if (curr.type === 'doctor') amount = 500;
       else if (curr.type === 'lab') amount = 1000;
       else if (curr.type === 'medicine') amount = 750;
    }
    return acc + amount;
  }, 0);

  const todayRevenue = allBookings.filter((b: any) => {
    const bDate = b.createdAt ? new Date(b.createdAt).toISOString().split('T')[0] : '';
    return bDate === today;
  }).reduce((acc: number, curr: any) => {
    let amount = Number(curr.amount || 0);
    if (!amount) {
       if (curr.type === 'doctor') amount = 500;
       else if (curr.type === 'lab') amount = 1000;
       else if (curr.type === 'medicine') amount = 750;
    }
    return acc + amount;
  }, 0);

  const pendingPayouts = payouts.docs
    .map(d => d.data())
    .filter((p: any) => p.status === 'pending')
    .reduce((acc: number, curr: any) => acc + (curr.payoutAmount || 0), 0);

  // Chart Data: Group by Date (last 7 days)
  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  const chartData = last7Days.map(date => {
    const dayBookings = allBookings.filter((b: any) => {
      const bDate = b.createdAt ? new Date(b.createdAt).toISOString().split('T')[0] : '';
      return bDate === date;
    });

    const revenue = dayBookings.reduce((acc: number, curr: any) => {
      let amount = Number(curr.amount || 0);
      if (!amount) {
         if (curr.type === 'doctor') amount = 500;
         else if (curr.type === 'lab') amount = 1000;
         else if (curr.type === 'medicine') amount = 750;
      }
      return acc + amount;
    }, 0);

    return {
      date,
      bookings: dayBookings.length,
      revenue
    };
  });

  return {
    metrics: {
      totalBookings,
      todayBookings,
      totalRevenue,
      todayRevenue,
      pendingPayouts
    },
    chartData
  };
};

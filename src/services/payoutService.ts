import { adminDb } from "@/lib/firebaseAdmin";

export interface Payout {
  id?: string;
  doctorId: string;
  doctorName: string;
  bookingId: string;
  serviceType: "doctor" | "lab" | "medicine";
  amount: number;
  commission: number;
  payoutAmount: number;
  status: "pending" | "paid";
  date: string;
  createdAt: number;
}

export const createPayout = async (booking: any) => {
  const { id: bookingId, type, doctorId, doctorName, raw } = booking;
  
  // Logic for default amounts if not present in booking
  let amount = Number(raw?.amount || 500); 
  if (type === "lab") amount = Number(raw?.amount || 1000);
  if (type === "medicine") amount = Number(raw?.amount || 750);

  const commissionRate = 0.20; // 20% platform fee
  const commission = amount * commissionRate;
  const payoutAmount = amount - commission;

  const payoutData: Omit<Payout, 'id'> = {
    doctorId: doctorId || "admin", // fallback for lab/med if no doctorId
    doctorName: doctorName || (type === "doctor" ? "Unknown" : type.toUpperCase()),
    bookingId,
    serviceType: type,
    amount,
    commission,
    payoutAmount,
    status: "pending",
    date: new Date().toISOString().split('T')[0],
    createdAt: Date.now()
  };

  await adminDb.collection("payouts").add(payoutData);
};

export const getPayouts = async (filters: { doctorId?: string, status?: string }) => {
  let query: any = adminDb.collection("payouts").orderBy("createdAt", "desc");

  if (filters.doctorId) {
    query = query.where("doctorId", "==", filters.doctorId);
  }
  if (filters.status) {
    query = query.where("status", "==", filters.status);
  }

  const snapshot = await query.get();
  return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
};

export const updatePayoutStatus = async (id: string, status: "pending" | "paid") => {
  await adminDb.collection("payouts").doc(id).update({ status });
};

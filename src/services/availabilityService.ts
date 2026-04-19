import { adminDb } from "@/lib/firebaseAdmin";

export interface DoctorAvailability {
  id?: string;
  doctorId: string;
  date: string;
  slots: string[];
  bookedSlots: string[];
}

export const getDoctorAvailability = async (doctorId: string, date: string): Promise<DoctorAvailability | null> => {
  const snapshot = await adminDb.collection("doctorAvailability")
    .where("doctorId", "==", doctorId)
    .where("date", "==", date)
    .limit(1)
    .get();

  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() } as DoctorAvailability;
};

export const setDoctorAvailability = async (doctorId: string, date: string, slots: string[]) => {
  const ref = adminDb.collection("doctorAvailability");
  
  const existing = await getDoctorAvailability(doctorId, date);
  if (existing && existing.id) {
    await ref.doc(existing.id).update({
      slots,
      // Retain booked slots but filter out ones that no longer exist (optional, kept simple for now)
    });
    return { success: true };
  } else {
    await ref.add({
      doctorId,
      date,
      slots,
      bookedSlots: []
    });
    return { success: true };
  }
};

export const bookSlot = async (doctorId: string, date: string, time: string) => {
  const existing = await getDoctorAvailability(doctorId, date);
  if (!existing || !existing.id) throw new Error("No availability configured for this date.");

  if (existing.bookedSlots.includes(time)) {
    throw new Error("Slot already booked");
  }

  await adminDb.collection("doctorAvailability").doc(existing.id).update({
    bookedSlots: [...existing.bookedSlots, time]
  });
};

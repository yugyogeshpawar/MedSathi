import { adminDb } from "@/lib/firebaseAdmin";
import { v4 as uuidv4 } from "uuid";

/**
 * Creates or gets a patient by phone number.
 */
export const createOrGetPatient = async (phone: string, name: string) => {
  const patientsRef = adminDb.collection("patients");
  const snapshot = await patientsRef.where("phone", "==", phone).limit(1).get();

  if (!snapshot.empty) {
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  }

  // Create new patient
  const newPatientRef = await patientsRef.add({
    name,
    phone,
    createdAt: Date.now()
  });

  return { id: newPatientRef.id, name, phone, createdAt: Date.now() };
};

/**
 * Adds an interaction history for a patient.
 */
export const addPatientHistory = async ({
  patientId,
  bookingId,
  serviceType,
  doctorName,
  notes = "",
  date,
  status = "Pending",
  rawDetails
}: {
  patientId: string;
  bookingId: string;
  serviceType: string;
  doctorName?: string;
  notes?: string;
  date: string;
  status?: string;
  rawDetails?: any;
}) => {
  const historyRef = adminDb.collection("patientHistory");
  await historyRef.add({
    patientId,
    bookingId,
    serviceType,
    doctorName: doctorName || "-",
    notes,
    date,
    status,
    rawDetails: rawDetails || null,
    createdAt: Date.now()
  });
};

/**
 * Gets all history for a patient, sorted by latest first.
 */
export const getPatientHistory = async (patientId: string) => {
  const snapshot = await adminDb.collection("patientHistory")
    .where("patientId", "==", patientId)
    .orderBy("createdAt", "desc")
    .get();

  return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
};

import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { verifyAuth } from "@/lib/verifyAuth";
import { createOrGetPatient, addPatientHistory } from "@/services/patientService";
import { bookSlot } from "@/services/availabilityService";

export async function GET(req: NextRequest) {
  const { uid, error } = await verifyAuth(req);
  if (!uid) return NextResponse.json({ success: false, error }, { status: 401 });

  try {
    const [docs, labs, meds] = await Promise.all([
      adminDb.collection("doctorBookings").orderBy("createdAt", "desc").get(),
      adminDb.collection("labBookings").orderBy("createdAt", "desc").get(),
      adminDb.collection("medicineOrders").orderBy("createdAt", "desc").get()
    ]);

    const merged: any[] = [];

    docs.forEach((d: any) => {
      const data = d.data();
      merged.push({
        id: d.id, type: "doctor", name: data.name, phone: data.phone, date: data.date ? (data.time ? `${data.date} at ${data.time}` : data.date) : "-", status: data.status || "Pending",
        createdAtTS: data.createdAt?.toMillis ? data.createdAt.toMillis() : data.createdAt || Date.now(),
        raw: data
      });
    });

    labs.forEach((l: any) => {
      const data = l.data();
      merged.push({
        id: l.id, type: "lab", name: data.name, phone: data.phone, date: data.date || "-", status: data.status || "Pending",
        createdAtTS: data.createdAt?.toMillis ? data.createdAt.toMillis() : data.createdAt || Date.now(),
        raw: data
      });
    });

    meds.forEach((m: any) => {
      const data = m.data();
      merged.push({
        id: m.id, type: "medicine", name: data.name || "-", phone: data.phone, date: "-", status: data.status || "Pending",
        createdAtTS: data.createdAt?.toMillis ? data.createdAt.toMillis() : data.createdAt || Date.now(),
        raw: data
      });
    });

    merged.sort((a, b) => b.createdAtTS - a.createdAtTS);

    return NextResponse.json({ success: true, data: merged });
  } catch (error: any) {
    console.error("Booking merge error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const type = data.type || "doctor";
    const { name, phone, doctorName, date, time, doctorId } = data;

    // Define amount based on type if not provided
    let amount = data.amount;
    if (!amount) {
      if (type === "doctor") amount = 500;
      else if (type === "lab") amount = 1000;
      else if (type === "medicine") amount = 750;
    }

    // If it's a doctor booking, handle slot booking
    if (type === "doctor" && doctorId && date && time) {
      try {
        await bookSlot(doctorId, date, time);
      } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message }, { status: 400 });
      }
    }

    // Save the booking collection
    let collectionName = "doctorBookings";
    if (type === "lab") collectionName = "labBookings";
    else if (type === "medicine") collectionName = "medicineOrders";

    const docRef = await adminDb.collection(collectionName).add({
      ...data,
      amount,
      status: "Pending",
      createdAt: Date.now()
    });

    // Handle patient history
    if (phone) {
      const patient = await createOrGetPatient(phone, name || "Unknown");
      await addPatientHistory({
        patientId: patient.id!,
        bookingId: docRef.id,
        serviceType: type,
        doctorName: doctorName || "-",
        notes: "Booked via platform",
        date: date ? (time ? `${date} at ${time}` : date) : "-",
        status: "Pending",
        rawDetails: data
      });
    }

    return NextResponse.json({ success: true, data: { id: docRef.id, ...data } });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

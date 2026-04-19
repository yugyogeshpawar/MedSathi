import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { verifyAuth } from "@/lib/verifyAuth";
import { createPayout } from "@/services/payoutService";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { uid, error } = await verifyAuth(req);
  if (!uid) return NextResponse.json({ success: false, error }, { status: 401 });

  try {
    const { id } = await params;
    const { status, type } = await req.json();
    let collName = "";
    if (type === "doctor") collName = "doctorBookings";
    else if (type === "lab") collName = "labBookings";
    else collName = "medicineOrders";

    await adminDb.collection(collName).doc(id).update({ status });

    // Trigger Payout Creation if status is Completed
    if (status === "Completed") {
      const snap = await adminDb.collection(collName).doc(id).get();
      if (snap.exists) {
        await createPayout({ id, ...snap.data(), type });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { uid, error } = await verifyAuth(req);
  if (!uid) return NextResponse.json({ success: false, error }, { status: 401 });

  try {
    const { id } = await params;
    const { type } = await req.json();
    let collName = "";
    if (type === "doctor") collName = "doctorBookings";
    else if (type === "lab") collName = "labBookings";
    else collName = "medicineOrders";

    await adminDb.collection(collName).doc(id).delete();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

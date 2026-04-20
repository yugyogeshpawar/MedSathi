import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { verifyAuth } from "@/lib/verifyAuth";
import { createPayout } from "@/services/payoutService";
import { logActivity, createAuditLog, createNotification } from "@/services/loggingService";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { uid, role, name, error } = await verifyAuth(req);
  if (!uid) return NextResponse.json({ success: false, error }, { status: 401 });

  try {
    const { id } = await params;
    const body = await req.json();
    const { type, ...updateFields } = body;
    
    let collName = "";
    if (type === "doctor") collName = "doctorBookings";
    else if (type === "lab") collName = "labBookings";
    else collName = "medicineOrders";

    // 1. Snapshot for Audit
    const docRef = adminDb.collection(collName).doc(id);
    const existing = await docRef.get();
    const oldData = existing.exists ? existing.data() : null;

    // 2. Perform Update
    await docRef.update(updateFields);

    // 3. Activity Logging
    await logActivity({
      performedBy: { uid, name: name!, role: role! },
      action: `Updated ${type} booking`,
      module: "bookings",
      entityId: id,
      details: `${name} modified details for ${oldData?.name}`
    });

    // 4. Audit Trail
    await createAuditLog({
      performedBy: { uid, name: name!, role: role! },
      action: "Updated Booking Record",
      module: "bookings",
      entityId: id,
      before: oldData,
      after: { ...oldData, ...updateFields }
    });

    // 5. Status Transition Side Effects
    const newStatus = updateFields.status;
    if (newStatus && newStatus !== oldData?.status) {
      if (newStatus === "Cancelled") {
         await createNotification("Booking Cancelled", `The ${type} appointment for ${oldData?.name} was cancelled.`, "warning");
      }
      
      if (newStatus === "Completed") {
        if (existing.exists) {
          await createPayout({ id, ...existing.data(), ...updateFields, type });
          await createNotification("Payout Pending", `A new payout is ready for Dr. ${existing.data()?.doctorName || 'partner'}.`, "success");
        }
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

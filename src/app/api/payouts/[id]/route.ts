import { NextRequest, NextResponse } from "next/server";
import { updatePayoutStatus } from "@/services/payoutService";
import { verifyAuth } from "@/lib/verifyAuth";
import { adminDb } from "@/lib/firebaseAdmin";
import { createAuditLog } from "@/services/loggingService";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { uid, role, name, error } = await verifyAuth(req);
  if (!uid) return NextResponse.json({ success: false, error }, { status: 401 });

  try {
    const { id } = await params;
    const { status } = await req.json();
    
    if (status !== "pending" && status !== "paid") {
       return NextResponse.json({ success: false, error: "Invalid status" }, { status: 400 });
    }

    // Capture old state for audit
    const payoutDoc = await adminDb.collection("payouts").doc(id).get();
    const oldData = payoutDoc.exists ? payoutDoc.data() : null;

    await updatePayoutStatus(id, status);

    // Audit Log
    await createAuditLog({
      performedBy: { uid, name: name!, role: role! },
      action: `Payout marked as ${status}`,
      module: "payouts",
      entityId: id,
      before: oldData,
      after: { ...oldData, status }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

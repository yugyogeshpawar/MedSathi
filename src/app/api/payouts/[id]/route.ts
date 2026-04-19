import { NextRequest, NextResponse } from "next/server";
import { updatePayoutStatus } from "@/services/payoutService";
import { verifyAuth } from "@/lib/verifyAuth";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { uid, error } = await verifyAuth(req);
  if (!uid) return NextResponse.json({ success: false, error }, { status: 401 });

  try {
    const { id } = await params;
    const { status } = await req.json();
    
    if (status !== "pending" && status !== "paid") {
       return NextResponse.json({ success: false, error: "Invalid status" }, { status: 400 });
    }

    await updatePayoutStatus(id, status);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { logActivity } from "@/services/loggingService";
import { verifyAuth } from "@/lib/verifyAuth";

export async function POST(req: NextRequest) {
  const { uid, name, role, error } = await verifyAuth(req);
  if (!uid) return NextResponse.json({ success: false, error }, { status: 401 });

  try {
    const { template, patientName, phone } = await req.json();

    await logActivity({
      performedBy: { uid, name: name!, role: role! },
      action: "Sent WhatsApp Message",
      module: "bookings",
      details: `Template: ${template} sent to ${patientName} (${phone})`
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

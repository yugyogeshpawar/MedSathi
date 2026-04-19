import { NextRequest, NextResponse } from "next/server";
import { getPayouts } from "@/services/payoutService";
import { verifyAuth } from "@/lib/verifyAuth";

export async function GET(req: NextRequest) {
  const { uid, error } = await verifyAuth(req);
  if (!uid) return NextResponse.json({ success: false, error }, { status: 401 });

  try {
    const doctorId = req.nextUrl.searchParams.get("doctorId") || undefined;
    const status = req.nextUrl.searchParams.get("status") || undefined;
    
    const payouts = await getPayouts({ doctorId, status });
    return NextResponse.json({ success: true, data: payouts });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

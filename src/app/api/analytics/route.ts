import { NextRequest, NextResponse } from "next/server";
import { getAnalytics } from "@/services/analyticsService";
import { verifyAuth } from "@/lib/verifyAuth";

export async function GET(req: NextRequest) {
  const { uid, error } = await verifyAuth(req);
  if (!uid) return NextResponse.json({ success: false, error }, { status: 401 });

  try {
    const analytics = await getAnalytics();
    return NextResponse.json({ success: true, data: analytics });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

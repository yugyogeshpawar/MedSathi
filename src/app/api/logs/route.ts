import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { verifyAuth } from "@/lib/verifyAuth";

export async function GET(req: NextRequest) {
  const { uid, role, error } = await verifyAuth(req);
  if (!uid) return NextResponse.json({ success: false, error }, { status: 401 });

  // Only Super Admins can see logs
  if (role !== "admin") {
    return NextResponse.json({ success: false, error: "Access Denied" }, { status: 403 });
  }

  try {
    const snapshot = await adminDb.collection("activityLogs").orderBy("createdAt", "desc").limit(100).get();
    const logs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json({ success: true, data: logs });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

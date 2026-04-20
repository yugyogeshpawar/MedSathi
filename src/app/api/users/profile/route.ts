import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { verifyAuth } from "@/lib/verifyAuth";
import { logActivity } from "@/services/loggingService";

export async function PATCH(req: NextRequest) {
  const { uid, role, name: currentName, error } = await verifyAuth(req);
  if (!uid) return NextResponse.json({ success: false, error }, { status: 401 });

  try {
    const { name } = await req.json();

    if (!name || name.trim().length === 0) {
      return NextResponse.json({ success: false, error: "Name is required" }, { status: 400 });
    }

    await adminDb.collection("users").doc(uid).update({ name });

    await logActivity({
      performedBy: { uid, name: currentName!, role: role! },
      action: "Updated Profile",
      module: "users",
      details: `Changed name to ${name}`
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

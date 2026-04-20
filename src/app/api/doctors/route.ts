import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { verifyAuth } from "@/lib/verifyAuth";
import { logActivity, createNotification } from "@/services/loggingService";

export async function GET(req: NextRequest) {
  try {
    const snapshot = await adminDb.collection("doctors").orderBy("createdAt", "desc").get();
    const doctors = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json({ success: true, data: doctors });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { uid, role, name, error } = await verifyAuth(req);
  if (!uid) return NextResponse.json({ success: false, error }, { status: 401 });

  try {
    const data = await req.json();
    const docRef = await adminDb.collection("doctors").add({
      ...data,
      createdAt: Date.now()
    });

    // Logging & Notifications
    await logActivity({
      performedBy: { uid, name: name!, role: role! },
      action: "Created Doctor",
      module: "doctors",
      entityId: docRef.id,
      details: `Added doctor: ${data.name} (${data.specialty})`
    });

    await createNotification(
      "New Doctor Registered",
      `Dr. ${data.name} has been added to the platform.`,
      "success"
    );

    return NextResponse.json({ success: true, data: { id: docRef.id, ...data } });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

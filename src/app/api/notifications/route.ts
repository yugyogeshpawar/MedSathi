import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { verifyAuth } from "@/lib/verifyAuth";

export async function GET(req: NextRequest) {
  const { uid, error } = await verifyAuth(req);
  if (!uid) return NextResponse.json({ success: false, error }, { status: 401 });

  try {
    const snapshot = await adminDb.collection("notifications")
      .orderBy("createdAt", "desc")
      .limit(20)
      .get();
    
    const notifications = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json({ success: true, data: notifications });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const { uid, error } = await verifyAuth(req);
  if (!uid) return NextResponse.json({ success: false, error }, { status: 401 });

  try {
    const { id, isRead, all } = await req.json();

    if (all) {
      const unreadBatch = await adminDb.collection("notifications").where("isRead", "==", false).get();
      const batch = adminDb.batch();
      unreadBatch.docs.forEach(doc => {
        batch.update(doc.ref, { isRead: true });
      });
      await batch.commit();
    } else if (id) {
      await adminDb.collection("notifications").doc(id).update({ isRead });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

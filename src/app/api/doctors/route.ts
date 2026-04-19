import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { verifyAuth } from "@/lib/verifyAuth";

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
  const { uid, error } = await verifyAuth(req);
  if (!uid) return NextResponse.json({ success: false, error }, { status: 401 });

  try {
    const data = await req.json();
    const docRef = await adminDb.collection("doctors").add({
      ...data,
      createdAt: Date.now()
    });
    return NextResponse.json({ success: true, data: { id: docRef.id, ...data } });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

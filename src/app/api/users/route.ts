import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { verifyAuth } from "@/lib/verifyAuth";

export async function GET(req: NextRequest) {
  const { uid, role, error } = await verifyAuth(req);
  if (!uid) return NextResponse.json({ success: false, error }, { status: 401 });
  
  if (role !== "admin") {
    return NextResponse.json({ success: false, error: "Unauthorized: Admin only" }, { status: 403 });
  }

  try {
    const snapshot = await adminDb.collection("users").orderBy("createdAt", "desc").get();
    const users = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json({ success: true, data: users });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { uid, role, error } = await verifyAuth(req);
  if (!uid) return NextResponse.json({ success: false, error }, { status: 401 });

  if (role !== "admin") {
    return NextResponse.json({ success: false, error: "Unauthorized: Admin only" }, { status: 403 });
  }

  try {
    const { name, email, password, permissions } = await req.json();
    
    if (!email || !password || !name) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    // 1. Create user in Firebase Auth
    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName: name,
    });

    // 2. Store in Firestore users collection
    await adminDb.collection("users").doc(userRecord.uid).set({
      name,
      email,
      role: "subadmin",
      permissions: permissions || [],
      createdAt: Date.now(),
    });

    return NextResponse.json({ success: true, data: { uid: userRecord.uid } });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

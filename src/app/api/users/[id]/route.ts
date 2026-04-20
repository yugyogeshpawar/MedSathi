import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { verifyAuth } from "@/lib/verifyAuth";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { uid, role, error } = await verifyAuth(req);
  if (!uid) return NextResponse.json({ success: false, error }, { status: 401 });

  if (role !== "admin") {
    return NextResponse.json({ success: false, error: "Unauthorized: Admin only" }, { status: 403 });
  }

  try {
    const { id } = await params;
    
    // 1. Delete from Firebase Auth
    await adminAuth.deleteUser(id);
    
    // 2. Delete from Firestore
    await adminDb.collection("users").doc(id).delete();

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { uid, role, error } = await verifyAuth(req);
  if (!uid) return NextResponse.json({ success: false, error }, { status: 401 });

  if (role !== "admin") {
    return NextResponse.json({ success: false, error: "Unauthorized: Admin only" }, { status: 403 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    
    // Whitelist allowed fields for update
    const updateData: any = {};
    if (body.role) updateData.role = body.role;
    if (body.permissions) updateData.permissions = body.permissions;
    if (body.name) updateData.name = body.name;

    await adminDb.collection("users").doc(id).update(updateData);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

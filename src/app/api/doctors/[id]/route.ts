import { adminDb } from "@/lib/firebaseAdmin";
import { verifyAuth } from "@/lib/verifyAuth";
import { logActivity, createAuditLog } from "@/services/loggingService";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { uid, role, name, error } = await verifyAuth(req);
  if (!uid) return NextResponse.json({ success: false, error }, { status: 401 });

  try {
    const { id } = await params;
    const data = await req.json();
    
    // 1. Fetch current data for audit
    const docRef = adminDb.collection("doctors").doc(id);
    const existing = await docRef.get();
    const oldData = existing.exists ? existing.data() : null;

    // 2. Perform update
    await docRef.update(data);

    // 3. Create Audit Log
    await createAuditLog({
      performedBy: { uid, name: name!, role: role! },
      action: "Updated Doctor Profile",
      module: "doctors",
      entityId: id,
      before: oldData,
      after: { ...oldData, ...data }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { uid, role, name, error } = await verifyAuth(req);
  if (!uid) return NextResponse.json({ success: false, error }, { status: 401 });

  if (role !== "admin") {
    return NextResponse.json({ success: false, error: "Unauthorized: Admin only" }, { status: 403 });
  }

  try {
    const { id } = await params;
    
    // Get doc name for cleaner log
    const doc = await adminDb.collection("doctors").doc(id).get();
    const docName = doc.data()?.name || id;

    await adminDb.collection("doctors").doc(id).delete();

    // Log Activity
    await logActivity({
      performedBy: { uid, name: name!, role: role! },
      action: "Deleted Doctor",
      module: "doctors",
      entityId: id,
      details: `Removed doctor: ${docName}`
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

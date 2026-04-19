import { NextRequest, NextResponse } from "next/server";
import { adminStorage } from "@/lib/firebaseAdmin";
import { verifyAuth } from "@/lib/verifyAuth";

export async function POST(req: NextRequest) {
  const { uid, error: authError } = await verifyAuth(req);
  if (!uid) return NextResponse.json({ success: false, error: authError }, { status: 401 });

  if (!adminStorage) {
    return NextResponse.json({ success: false, error: "Firebase backend storage is not properly configured." }, { status: 500 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Convert Buffer directly to base64 Data URL
    // This perfectly bypasses Firebase Storage billing constraints by storing modest avatars right inside Firestore docs!
    const base64String = buffer.toString('base64');
    const publicUrl = `data:${file.type};base64,${base64String}`;

    return NextResponse.json({ success: true, url: publicUrl });
  } catch (error: any) {
    console.error("Storage upload failed:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

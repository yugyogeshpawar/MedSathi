import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebaseAdmin";
import { verifyAuth } from "@/lib/verifyAuth";
import { logActivity } from "@/services/loggingService";

export async function POST(req: NextRequest) {
  const { uid, role, name, error } = await verifyAuth(req);
  if (!uid) return NextResponse.json({ success: false, error }, { status: 401 });

  try {
    const { currentPassword, newPassword } = await req.json();

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json({ success: false, error: "New password must be at least 6 characters" }, { status: 400 });
    }

    // Backend Verification of Current Password
    // We use the Firebase Auth REST API to verify provided credentials
    const user = await adminAuth.getUser(uid);
    const email = user.email;

    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    const verifyResponse = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
      {
        method: "POST",
        body: JSON.stringify({ email, password: currentPassword, returnSecureToken: true }),
        headers: { "Content-Type": "application/json" }
      }
    );

    if (!verifyResponse.ok) {
      return NextResponse.json({ success: false, error: "Incorrect current password" }, { status: 401 });
    }

    // If verified, update password via Admin SDK
    await adminAuth.updateUser(uid, { password: newPassword });

    await logActivity({
      performedBy: { uid, name: name!, role: role! },
      action: "Changed Password",
      module: "users",
      details: "User successfully updated their account password"
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

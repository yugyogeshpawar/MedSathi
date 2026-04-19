import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "./firebaseAdmin";

export async function verifyAuth(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return { uid: null, error: "Missing or invalid authorization header" };
    }

    const token = authHeader.split("Bearer ")[1];

    if (!adminAuth) {
      return { uid: null, error: "Backend Firebase keys unconfigured." };
    }

    const decodedToken = await adminAuth.verifyIdToken(token);
    
    return { uid: decodedToken.uid, error: null };
  } catch (error) {
    console.error("Token verification failed:", error);
    return { uid: null, error: "Invalid or expired token" };
  }
}

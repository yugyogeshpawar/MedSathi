import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "./firebaseAdmin";

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
    
    // Fetch role from Firestore
    const userDoc = await adminDb.collection("users").doc(decodedToken.uid).get();
    
    if (!userDoc.exists) {
      // Check if this is the first user ever
      const usersSnapshot = await adminDb.collection("users").limit(1).get();
      if (usersSnapshot.empty) {
        // Bootstrap: First user is admin
        await adminDb.collection("users").doc(decodedToken.uid).set({
          email: decodedToken.email,
          role: "admin",
          permissions: ["all"],
          createdAt: Date.now()
        });
        return { uid: decodedToken.uid, role: "admin", name: "System Admin", permissions: ["all"], error: null };
      }
      return { uid: null, role: null, name: null, permissions: [], error: "User record not found" };
    }

    const userData = userDoc.data();
    return { 
      uid: decodedToken.uid, 
      role: userData?.role || "subadmin", 
      name: userData?.name || decodedToken.name || decodedToken.email || "Unknown",
      permissions: userData?.permissions || (userData?.role === 'admin' ? ["all"] : []),
      error: null 
    };
  } catch (error) {
    console.error("Token verification failed:", error);
    return { uid: null, role: null, name: null, permissions: [], error: "Invalid or expired token" };
  }
}

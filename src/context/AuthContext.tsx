"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { User, onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import { useRouter } from "@/routing";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface AuthContextType {
  user: User | null;
  role: "admin" | "subadmin" | null;
  permissions: string[];
  profile: any | null;
  loading: boolean;
  logout: () => Promise<void>;
  hasPermission: (module: string) => boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  permissions: [],
  profile: null,
  loading: true,
  logout: async () => {},
  hasPermission: () => false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<"admin" | "subadmin" | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Real-time listener for role changes
        const userDocRef = doc(db, "users", currentUser.uid);
        const unsubDoc = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setRole(data.role);
            setPermissions(data.permissions || []);
            setProfile(data);
          }
          setLoading(false);
        }, (err) => {
          console.error("Profile sync error:", err);
          setLoading(false);
        });
        
        return () => {
          unsubDoc();
        };
      } else {
        setRole(null);
        setPermissions([]);
        setProfile(null);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const logout = async () => {
    if (auth) {
      await firebaseSignOut(auth);
      router.push("/admin/login" as any);
    }
  };

  const hasPermission = (module: string) => {
    if (role === "admin") return true;
    return permissions.includes(module) || permissions.includes("all");
  };

  return (
    <AuthContext.Provider value={{ user, role, permissions, profile, loading, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

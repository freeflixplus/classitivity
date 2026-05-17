"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { auth as authApi, LoginResponse } from "@/lib/api";

// ─── Types ─────────────────────────────────────────────────────────

interface User {
  id: string;
  email: string;
  name: string;
  role: "PLATFORM_ADMIN" | "SCHOOL_ADMIN" | "TEACHER";
  schoolId?: string;
  schoolName?: string;
  curriculumVersion?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, loginPortal?: 'admin') => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  logout: () => {},
  isAuthenticated: false,
});

export const useAuth = () => useContext(AuthContext);

// ─── Storage Keys ──────────────────────────────────────────────────

const KEYS = {
  accessToken: "classitivity_access_token",
  refreshToken: "classitivity_refresh_token",
  user: "classitivity_user",
} as const;

// ─── Route Mapping ─────────────────────────────────────────────────

const roleRoutes: Record<string, string> = {
  PLATFORM_ADMIN: "/platform-admin/dashboard",
  SCHOOL_ADMIN: "/school-admin/dashboard",
  TEACHER: "/teacher/dashboard",
};

const protectedPrefixes = ["/platform-admin", "/school-admin", "/teacher"];

// ─── Provider ──────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Restore session from localStorage on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(KEYS.user);
      const storedToken = localStorage.getItem(KEYS.accessToken);
      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
      }
    } catch {
      // Corrupted storage — clear it
      localStorage.removeItem(KEYS.user);
      localStorage.removeItem(KEYS.accessToken);
      localStorage.removeItem(KEYS.refreshToken);
    } finally {
      setLoading(false);
    }
  }, []);

  // Redirect unauthenticated users away from protected routes
  useEffect(() => {
    if (loading) return;
    const isProtected = protectedPrefixes.some((p) => pathname?.startsWith(p));
    if (isProtected && !user) {
      router.replace("/login");
    }
  }, [loading, user, pathname, router]);

  const login = useCallback(
    async (email: string, password: string, loginPortal: 'admin' = 'admin') => {
      const res: LoginResponse = await authApi.login(email, password, loginPortal);

      // Persist tokens + user
      localStorage.setItem(KEYS.accessToken, res.accessToken);
      localStorage.setItem(KEYS.refreshToken, res.refreshToken);
      localStorage.setItem(KEYS.user, JSON.stringify(res.user));

      setUser(res.user);

      // Redirect based on role
      const destination = roleRoutes[res.user.role] || '/';
      router.push(destination);
    },
    [router],
  );

  const logout = useCallback(() => {
    // Fire-and-forget server logout
    authApi.logout().catch(() => {});

    // Clear local state
    localStorage.removeItem(KEYS.accessToken);
    localStorage.removeItem(KEYS.refreshToken);
    localStorage.removeItem(KEYS.user);
    setUser(null);
    router.push("/login");
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

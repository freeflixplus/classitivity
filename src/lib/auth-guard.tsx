'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

/**
 * Frontend Auth Guard
 * Architecture: Section 11 — Protected route layouts with auth guard + subscription check
 *
 * Wraps protected pages to ensure the user is logged in and has the correct role.
 * Redirects to /login if unauthenticated.
 */

interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'PLATFORM_ADMIN' | 'SCHOOL_ADMIN' | 'TEACHER';
  schoolId?: string;
  schoolName?: string;
  curriculumVersion?: string;
}

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
  fallbackUrl?: string;
}

export function AuthGuard({ children, allowedRoles, fallbackUrl = '/login' }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('classitivity_access_token');
    const userData = localStorage.getItem('classitivity_user');

    if (!token || !userData) {
      router.replace(`${fallbackUrl}?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    try {
      const parsed: AuthUser = JSON.parse(userData);

      if (!allowedRoles.includes(parsed.role)) {
        // Redirect to the user's correct dashboard based on their role
        const roleRoutes: Record<string, string> = {
          PLATFORM_ADMIN: '/platform-admin/dashboard',
          SCHOOL_ADMIN: '/school-admin/dashboard',
          TEACHER: '/teacher/dashboard',
        };
        router.replace(roleRoutes[parsed.role] || '/login');
        return;
      }

      setUser(parsed);
    } catch {
      localStorage.removeItem('classitivity_access_token');
      localStorage.removeItem('classitivity_user');
      router.replace(fallbackUrl);
    } finally {
      setLoading(false);
    }
  }, [router, pathname, allowedRoles, fallbackUrl]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}

/**
 * Hook to get the current authenticated user from localStorage
 */
export function useAuthUser(): AuthUser | null {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem('classitivity_user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch {
        setUser(null);
      }
    }
  }, []);

  return user;
}

/**
 * Hook to handle logout
 */
export function useLogout() {
  const router = useRouter();

  return async () => {
    try {
      const token = localStorage.getItem('classitivity_access_token');
      if (token) {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/auth/logout`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch {
      // Silent fail on logout API call
    } finally {
      localStorage.removeItem('classitivity_access_token');
      localStorage.removeItem('classitivity_refresh_token');
      localStorage.removeItem('classitivity_user');
      router.replace('/login');
    }
  };
}

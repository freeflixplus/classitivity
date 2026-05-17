"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";
import { useAuth } from "@/components/providers/AuthProvider";

/* ── TutorLMS-style sidebar navigation with collapsible dropdowns ── */

interface NavItem {
  label: string;
  href?: string;
  icon: string;
  children?: { label: string; href: string }[];
}

const platformNav: NavItem[] = [
  {
    label: "Dashboard",
    href: "/platform-admin/dashboard",
    icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
  },
  {
    label: "Courses & Materials",
    icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
    children: [
      { label: "All Courses", href: "/platform-admin/courses" },
      { label: "Add New Course", href: "/platform-admin/courses/new" },
      { label: "Upload Resources", href: "/platform-admin/courses/upload" },
    ],
  },
  {
    label: "Schools",
    icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
    children: [
      { label: "All Schools", href: "/platform-admin/schools" },
      { label: "Onboard School", href: "/platform-admin/schools/new" },
    ],
  },

  {
    label: "Earnings",
    icon: "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z",
    children: [
      { label: "Overview", href: "/platform-admin/earnings" },
      { label: "Transactions", href: "/platform-admin/earnings/transactions" },
    ],
  },
  {
    label: "Reports",
    href: "/platform-admin/reports",
    icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
  },
];

function NavDropdown({ item, pathname }: { item: NavItem; pathname: string | null }) {
  const isActive = item.children?.some((c) => pathname?.startsWith(c.href)) ?? false;
  const [open, setOpen] = useState(isActive);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors",
          isActive
            ? "bg-brand-50 dark:bg-brand-500/20 text-brand-600 dark:text-brand-300"
            : "text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 hover:text-brand-500 dark:hover:text-brand-400"
        )}
      >
        <span className="flex items-center gap-3">
          <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={item.icon} />
          </svg>
          {item.label}
        </span>
        <svg
          className={cn("w-4 h-4 transition-transform duration-200 shrink-0", open && "rotate-180")}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className={cn(
          "overflow-hidden transition-all duration-200",
          open ? "max-h-60 opacity-100 mt-1" : "max-h-0 opacity-0"
        )}
      >
        <div className="ml-5 pl-4 border-l-2 border-surface-200 dark:border-surface-700 space-y-0.5 py-1">
          {item.children?.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              className={cn(
                "block px-3 py-2 rounded-lg text-sm transition-colors",
                pathname === child.href
                  ? "text-brand-600 dark:text-brand-300 font-semibold bg-brand-50/60 dark:bg-brand-500/10"
                  : "text-surface-500 dark:text-surface-400 hover:text-surface-800 dark:hover:text-surface-200 hover:bg-surface-50 dark:hover:bg-surface-800"
              )}
            >
              {child.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function PlatformAdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sideOpen, setSideOpen] = useState(false);
  const { user, logout, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-50 dark:bg-surface-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-brand-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-surface-500 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  const displayName = user?.name || "Platform Admin";
  const displayEmail = user?.email || "admin@classitivity.io";
  const initials = displayName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 flex">
      {/* ── Sidebar ─────────────────────────────────────────────── */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white dark:bg-surface-900 border-r border-surface-200/60 dark:border-surface-800 flex flex-col transition-transform duration-300 lg:translate-x-0",
          sideOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-5 border-b border-surface-100 dark:border-surface-800 flex items-center gap-2.5">
          <Image src="/icon.png" alt="" width={32} height={32} style={{ width: "auto", height: "auto" }} />
          <div>
            <span className="font-display text-lg font-bold text-brand-900 dark:text-white block leading-tight">Classitivity</span>
            <span className="text-[10px] text-brand-500 font-medium uppercase tracking-wider">Platform Admin</span>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {platformNav.map((item) =>
            item.children ? (
              <NavDropdown key={item.label} item={item} pathname={pathname} />
            ) : (
              <Link
                key={item.href}
                href={item.href!}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors",
                  pathname?.startsWith(item.href!)
                    ? "bg-brand-50 dark:bg-brand-500/20 text-brand-600 dark:text-brand-300"
                    : "text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 hover:text-brand-500 dark:hover:text-brand-400"
                )}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={item.icon} />
                </svg>
                {item.label}
              </Link>
            )
          )}
        </nav>

        <div className="p-4 border-t border-surface-100 dark:border-surface-800 space-y-3">
          <div className="flex items-center gap-3 px-4 py-2">
            <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center text-sm font-semibold text-white">{initials}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-surface-800 dark:text-white truncate">{displayName}</p>
              <p className="text-xs text-surface-400 dark:text-surface-500 truncate">{displayEmail}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-surface-500 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </button>
        </div>
      </aside>

      {sideOpen && <div className="fixed inset-0 bg-black/30 z-30 lg:hidden" onClick={() => setSideOpen(false)} />}

      {/* ── Main content ────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white dark:bg-surface-900 border-b border-surface-200/60 dark:border-surface-800 px-6 py-4 flex items-center gap-4">
          <button className="lg:hidden p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-600 dark:text-surface-400" onClick={() => setSideOpen(true)}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <div className="flex-1" />
          <ThemeSwitcher />
          <span className="text-xs bg-brand-50 dark:bg-brand-500/15 text-brand-600 dark:text-brand-300 px-2.5 py-1 rounded-full font-medium">admin.classitivity.io</span>
        </header>
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";
import { useAuth } from "@/components/providers/AuthProvider";

const adminNav = [
  { label: "Overview", href: "/school-admin/dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { label: "Teachers", href: "/school-admin/teachers", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
  { label: "Subscriptions", href: "/school-admin/subscriptions", icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" },
  { label: "Billing", href: "/school-admin/billing", icon: "M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" },
  { label: "Support", href: "/school-admin/support", icon: "M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
];

export default function SchoolAdminLayout({ children }: { children: React.ReactNode }) {
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

  const displayName = user?.name || "School Admin";
  const displayEmail = user?.email || "admin@school.com";
  const initials = displayName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 flex">
      <aside className={cn(
        "fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white dark:bg-surface-900 border-r border-surface-200/60 dark:border-surface-800 flex flex-col transition-transform duration-300 lg:translate-x-0",
        sideOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-5 border-b border-surface-100 dark:border-surface-800 flex items-center gap-2.5">
          <Image src="/icon.png" alt="" width={32} height={32} />
          <div>
            <span className="font-display text-lg font-bold text-brand-900 dark:text-white block leading-tight">Classitivity</span>
            <span className="text-[10px] text-surface-400 dark:text-surface-500 font-medium uppercase tracking-wider">School Admin</span>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {adminNav.map((item) => (
            <Link key={item.href} href={item.href} className={cn(
              "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors",
              pathname === item.href
                ? "bg-brand-50 dark:bg-brand-500/15 text-brand-600 dark:text-brand-300"
                : "text-surface-600 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-800 hover:text-brand-500 dark:hover:text-brand-400"
            )}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={item.icon} /></svg>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-surface-100 dark:border-surface-800 space-y-3">
          <div className="flex items-center gap-3 px-4 py-2">
            <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-500/20 flex items-center justify-center text-sm font-semibold text-brand-600 dark:text-brand-300">{initials}</div>
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
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white dark:bg-surface-900 border-b border-surface-200/60 dark:border-surface-800 px-6 py-4 flex items-center gap-4">
          <button className="lg:hidden p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800" onClick={() => setSideOpen(true)}>
            <svg className="w-5 h-5 text-surface-600 dark:text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <h2 className="font-display text-lg font-semibold text-surface-900 dark:text-white">{user?.schoolName || "Lagos Model School"}</h2>
          <div className="flex-1" />
          <ThemeSwitcher />
          <span className="text-xs bg-brand-50 dark:bg-brand-500/15 text-brand-600 dark:text-brand-300 px-2.5 py-1 rounded-full font-medium">{user?.curriculumVersion ? `${user.curriculumVersion} Curriculum` : "🇳🇬 Nigerian Curriculum"}</span>
        </header>
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

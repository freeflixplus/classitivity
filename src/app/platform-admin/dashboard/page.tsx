"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Card, Badge } from "@/components/ui";
import { platformAdmin } from "@/lib/api";

interface DashboardStats {
  totalSchools: number;
  activeSubscriptions: number;
  totalRevenue: number;
  totalUsers: number;
  totalDocuments?: number;
  totalStudents?: number;
}

export default function PlatformAdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    platformAdmin
      .getDashboard()
      .then((data) => setStats(data.stats))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    {
      label: "Schools Onboarded",
      value: stats?.totalSchools?.toLocaleString() ?? "0",
      sub: "Across NG · UK · US · AU",
      icon: "M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z",
      color: "text-brand-600 dark:text-brand-400",
      bg: "bg-brand-50 dark:bg-brand-500/15",
    },
    {
      label: "Documents Published",
      value: stats?.totalDocuments?.toLocaleString() ?? "0",
      sub: "Lesson notes, slides, past questions",
      icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
      color: "text-violet-600 dark:text-violet-400",
      bg: "bg-violet-50 dark:bg-violet-500/15",
    },
    {
      label: "Students Enrolled",
      value: stats?.totalStudents?.toLocaleString() ?? "0",
      sub: "Active learners on the platform",
      icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-500/15",
    },
    {
      label: "Total Revenue",
      value: `₦${((stats?.totalRevenue || 0) / 100).toLocaleString()}`,
      sub: "From document purchases",
      icon: "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z",
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-500/15",
    },
  ];

  const quickActions = [
    {
      label: "Upload New Material",
      desc: "Add a lesson note, slide deck, or past questions",
      href: "/platform-admin/courses/upload",
      icon: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12",
      color: "text-brand-600 dark:text-brand-400",
      bg: "bg-brand-50 dark:bg-brand-500/10 hover:bg-brand-100 dark:hover:bg-brand-500/20",
    },
    {
      label: "Onboard a School",
      desc: "Register a new school on the platform",
      href: "/platform-admin/schools/new",
      icon: "M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z",
      color: "text-violet-600 dark:text-violet-400",
      bg: "bg-violet-50 dark:bg-violet-500/10 hover:bg-violet-100 dark:hover:bg-violet-500/20",
    },
    {
      label: "Enroll a Student",
      desc: "Add a new student account to the platform",
      href: "/platform-admin/students/enroll",
      icon: "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z",
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20",
    },
    {
      label: "View Earnings",
      desc: "Check payment records and revenue breakdown",
      href: "/platform-admin/earnings",
      icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-500/10 hover:bg-amber-100 dark:hover:bg-amber-500/20",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-surface-900 dark:text-white">
            Platform Overview
          </h1>
          <p className="text-surface-500 dark:text-surface-400 text-sm mt-1 max-w-xl">
            Teaching is hard enough without spending every evening preparing for it. Classitivity puts professional teaching materials at every teacher's fingertips — and in every student's hands.
          </p>
        </div>
        <Link
          href="/platform-admin/courses/upload"
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-semibold hover:bg-brand-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Upload Material
        </Link>
      </div>

      {/* Mission banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-600 to-brand-800 p-6 text-white">
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.5" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
        </div>
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h2 className="font-display font-bold text-lg">Not just lesson preparation. All of it.</h2>
            <p className="text-white/80 text-sm mt-0.5">
              The teaching materials, the teacher development, and the professional tools schools need to operate at their best.
            </p>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} padding="sm">
              <div className="h-4 bg-surface-100 dark:bg-surface-700 rounded animate-pulse mb-3 w-2/3" />
              <div className="h-8 bg-surface-100 dark:bg-surface-700 rounded animate-pulse w-1/2" />
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((s) => (
            <Card key={s.label} padding="sm">
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
                <svg className={`w-5 h-5 ${s.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={s.icon} />
                </svg>
              </div>
              <p className="text-xs text-surface-400 font-medium">{s.label}</p>
              <p className={`font-display text-2xl font-bold mt-0.5 ${s.color}`}>{s.value}</p>
              <p className="text-xs text-surface-400 mt-1">{s.sub}</p>
            </Card>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div>
        <h2 className="text-base font-semibold text-surface-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((a) => (
            <Link
              key={a.label}
              href={a.href}
              className={`flex flex-col gap-3 p-5 rounded-2xl border border-surface-200/60 dark:border-surface-800 transition-all duration-200 ${a.bg} group`}
            >
              <div className={`w-10 h-10 rounded-xl bg-white dark:bg-surface-700 flex items-center justify-center ${a.color} shadow-sm`}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={a.icon} />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-surface-900 dark:text-white text-sm group-hover:underline">
                  {a.label}
                </p>
                <p className="text-xs text-surface-500 mt-0.5">{a.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* What Classitivity provides */}
      <Card>
        <h3 className="font-semibold text-surface-900 dark:text-white mb-5">
          Platform Capabilities
        </h3>
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            {
              title: "For Teachers",
              icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
              color: "text-brand-600 dark:text-brand-400",
              bg: "bg-brand-50 dark:bg-brand-500/15",
              items: ["Lesson plans & notes", "PowerPoint slide decks", "Past questions & answers", "Structured by curriculum"],
            },
            {
              title: "For Schools",
              icon: "M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4",
              color: "text-violet-600 dark:text-violet-400",
              bg: "bg-violet-50 dark:bg-violet-500/15",
              items: ["Teacher development tools", "Professional operations", "Multi-school management", "Curriculum compliance"],
            },
            {
              title: "For Students",
              icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
              color: "text-emerald-600 dark:text-emerald-400",
              bg: "bg-emerald-50 dark:bg-emerald-500/15",
              items: ["Browse course materials", "Secure purchase & access", "DRM-protected viewing", "No downloads or copying"],
            },
          ].map((col) => (
            <div key={col.title}>
              <div className={`w-9 h-9 rounded-xl ${col.bg} flex items-center justify-center mb-3`}>
                <svg className={`w-5 h-5 ${col.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={col.icon} />
                </svg>
              </div>
              <h4 className="font-semibold text-surface-900 dark:text-white text-sm mb-2">{col.title}</h4>
              <ul className="space-y-1.5">
                {col.items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-xs text-surface-600 dark:text-surface-400">
                    <svg className={`w-3.5 h-3.5 ${col.color} flex-shrink-0`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

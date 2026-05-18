"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Card, Badge } from "@/components/ui";
import { teacher } from "@/lib/api";
import { useAuth } from "@/components/providers/AuthProvider";

interface DashboardData {
  assignedGrades: string[];
  subscriptions: { gradeLevel: string; status: string; trialEndsAt?: string; currentPeriodEnd?: string }[];
  recentActivity: { action: string; time: string }[];
}

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [classes, setClasses] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [dashRes, classRes] = await Promise.all([
          teacher.getDashboard(),
          teacher.getClasses(),
        ]);
        setData(dashRes);
        setClasses(classRes);
      } catch (err) {
        console.error("Failed to load dashboard", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const assignedGrades = data?.assignedGrades || [];
  const subjects = classes?.subjects || [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-surface-900 dark:text-white">Welcome back, {user?.name || "Teacher"}</h1>
        <p className="text-surface-500 dark:text-surface-400 text-sm mt-1">{user?.schoolName || "Your School"} · {user?.curriculumVersion || "Curriculum"}</p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Subscribed Classes", value: assignedGrades.length.toString(), icon: "📚" },
          { label: "Available Subjects", value: subjects.length.toString(), icon: "📖" },
          { label: "Recent Downloads", value: (data?.recentActivity?.length || 0).toString(), icon: "📥" },
          { label: "Subscription Status", value: data?.subscriptions?.[0]?.status || "None", icon: "✅" },
        ].map((stat) => (
          <Card key={stat.label} padding="sm">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{stat.icon}</span>
              <div>
                <p className="text-xs text-surface-500 dark:text-surface-400 font-medium">{stat.label}</p>
                <p className="font-display text-xl font-bold text-surface-900 dark:text-white">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Subscribed Classes */}
      {assignedGrades.length > 0 ? (
        <div>
          <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">Your Subscribed Classes</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {assignedGrades.map((grade: string) => (
              <Link key={grade} href={`/teacher/classes?grade=${grade}`}>
                <Card hover padding="md" className="group">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 rounded-2xl bg-brand-500 text-white flex items-center justify-center font-display font-bold text-lg">{grade}</div>
                    <Badge variant="success">Active</Badge>
                  </div>
                  <p className="font-semibold text-surface-900 dark:text-white mb-1">{grade} — All Subjects</p>
                  <p className="text-xs text-surface-500 dark:text-surface-400">{subjects.length} subjects available</p>
                  <div className="mt-3 flex items-center text-brand-500 text-sm font-medium group-hover:translate-x-1 transition-transform">
                    Browse Materials →
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <Card padding="lg" className="text-center">
          <div className="text-5xl mb-4">📭</div>
          <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-2">No Active Subscriptions</h3>
          <p className="text-surface-500 dark:text-surface-400">Your school hasn&apos;t subscribed to any grade levels yet. Contact your School Admin to get access to teaching materials.</p>
        </Card>
      )}

      {/* Available Subjects */}
      {subjects.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">Available Subjects</h2>
          <div className="flex flex-wrap gap-2">
            {subjects.map((s: { code: string; name: string }) => (
              <Badge key={s.code} variant="brand">{s.name}</Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

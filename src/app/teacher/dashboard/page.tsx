"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Card, Badge } from "@/components/ui";
import { teacher } from "@/lib/api";
import { useAuth } from "@/components/providers/AuthProvider";

interface DashboardData {
  assignedGrades: string[];
  recentActivity: { action: string, time: string }[];
}

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await teacher.getDashboard();
        setData(res);
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

  // Fallbacks if data fails to load or hasn't loaded yet
  const assignedGrades = data?.assignedGrades || ["JSS1", "JSS2"];
  const recentLessons = [
    { subject: "Mathematics", title: "Algebraic Expressions", week: 3, term: "Term 1" },
    { subject: "English Language", title: "Comprehension Passages", week: 2, term: "Term 1" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-surface-900 dark:text-white">Welcome back, {user?.name || "Teacher"}</h1>
        <p className="text-surface-500 dark:text-surface-400 text-sm mt-1">{user?.curriculumVersion || "Nigerian Curriculum"} · {user?.schoolName || "Lagos Model School"}</p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Assigned Classes", value: assignedGrades.length.toString(), color: "brand" },
          { label: "Total Subjects", value: (assignedGrades.length * 8).toString(), color: "brand" },
          { label: "Lessons Available", value: "156", color: "brand" },
          { label: "Resources Accessed", value: "89", color: "brand" },
        ].map((stat) => (
          <Card key={stat.label} padding="sm">
            <p className="text-xs text-surface-500 dark:text-surface-400 font-medium">{stat.label}</p>
            <p className="font-display text-2xl font-bold text-surface-900 dark:text-white mt-1">{stat.value}</p>
          </Card>
        ))}
      </div>

      {/* Assigned classes */}
      <div>
        <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">Your Classes</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {assignedGrades.map((grade) => (
            <Link key={grade} href={`/teacher/classes/${grade.toLowerCase()}`}>
              <Card hover padding="md" className="group">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-brand-500 text-white flex items-center justify-center font-display font-bold text-lg">{grade}</div>
                  <Badge variant="brand">8 subjects</Badge>
                </div>
                <p className="font-semibold text-surface-900 dark:text-white mb-1">{grade} — All Subjects</p>
                <div className="w-full bg-surface-100 dark:bg-surface-800 rounded-full h-2 mt-3">
                  <div className="bg-brand-500 h-2 rounded-full transition-all" style={{ width: `75%` }} />
                </div>
                <p className="text-xs text-surface-500 dark:text-surface-400 mt-1">75% accessed this term</p>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent */}
      <div>
        <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">Recent Lessons</h2>
        <Card padding="none" className="overflow-hidden">
          <div className="divide-y divide-surface-200 dark:divide-surface-800">
            {recentLessons.map((lesson) => (
              <div key={lesson.title} className="flex items-center gap-4 px-5 py-4 hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-500/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-brand-500 dark:text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-surface-900 dark:text-white truncate">{lesson.title}</p>
                  <p className="text-xs text-surface-500 dark:text-surface-400">{lesson.subject} · Week {lesson.week} · {lesson.term}</p>
                </div>
                <svg className="w-5 h-5 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

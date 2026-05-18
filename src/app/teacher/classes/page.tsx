"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Card, Badge } from "@/components/ui";
import { teacher } from "@/lib/api";

const subjectColors: Record<string, string> = {
  MATH: "bg-brand-500",
  ENG: "bg-emerald-500",
  BSC: "bg-amber-500",
  SST: "bg-purple-500",
  CVE: "bg-rose-500",
  ICT: "bg-cyan-500",
  FRN: "bg-indigo-500",
  BTC: "bg-teal-500",
};

export default function ClassesPage() {
  const searchParams = useSearchParams();
  const selectedGrade = searchParams.get("grade");
  const [data, setData] = useState<{ assignedGrades: string[]; subjects: { code: string; name: string }[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    teacher.getClasses()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const grades = data?.assignedGrades || [];
  const subjects = data?.subjects || [];

  if (grades.length === 0) {
    return (
      <div className="space-y-8">
        <h1 className="font-display text-2xl font-bold text-surface-900 dark:text-white">My Classes</h1>
        <Card padding="lg" className="text-center">
          <div className="text-5xl mb-4">📭</div>
          <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-2">No Subscribed Classes</h3>
          <p className="text-surface-500 dark:text-surface-400">Your school hasn&apos;t subscribed to any grade levels yet. Contact your School Admin to get started.</p>
        </Card>
      </div>
    );
  }

  // If a grade is selected, show subjects for that grade
  const activeGrade = selectedGrade || grades[0];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-surface-900 dark:text-white">My Classes</h1>
        <p className="text-surface-500 dark:text-surface-400 text-sm mt-1">Select a class to browse teaching materials.</p>
      </div>

      {/* Grade tabs */}
      <div className="flex gap-2 flex-wrap">
        {grades.map((grade: string) => (
          <Link key={grade} href={`/teacher/classes?grade=${grade}`}>
            <button
              className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                activeGrade === grade
                  ? "bg-brand-500 text-white shadow-lg shadow-brand-500/25"
                  : "bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400 hover:bg-surface-200 dark:hover:bg-surface-700"
              }`}
            >
              {grade}
            </button>
          </Link>
        ))}
      </div>

      {/* Subjects grid */}
      <div>
        <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-4 flex items-center gap-2">
          <span className="w-10 h-10 rounded-xl bg-brand-500 text-white flex items-center justify-center font-display font-bold">{activeGrade?.substring(0, 2)}</span>
          {activeGrade} — Subjects
          <Badge variant="success">Subscribed</Badge>
        </h2>

        {subjects.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {subjects.map((s: { code: string; name: string }, i: number) => (
              <Link key={s.code} href={`/teacher/classes/${activeGrade?.toLowerCase()}/${s.code.toLowerCase()}`}>
                <Card hover padding="md" className="group animate-fade-in-up" style={{ animationDelay: `${i * 0.06}s` } as React.CSSProperties}>
                  <div className={`w-10 h-10 ${subjectColors[s.code] || "bg-brand-500"} rounded-xl flex items-center justify-center mb-3`}>
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                  </div>
                  <p className="font-semibold text-surface-800 dark:text-white text-sm mb-0.5">{s.name}</p>
                  <p className="text-xs text-surface-400 dark:text-surface-500">View lesson plans & materials</p>
                  <div className="mt-3 flex items-center text-brand-500 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Open →
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card padding="lg" className="text-center">
            <p className="text-surface-500 dark:text-surface-400">No subjects have been added to your curriculum yet. The Platform Admin needs to upload materials first.</p>
          </Card>
        )}
      </div>
    </div>
  );
}

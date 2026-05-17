import React from "react";
import Link from "next/link";
import { Card, Badge } from "@/components/ui";

const subjects = [
  { name: "Mathematics", code: "MATH", lessons: 42, color: "bg-brand-500" },
  { name: "English Language", code: "ENG", lessons: 38, color: "bg-emerald-500" },
  { name: "Basic Science", code: "BSC", lessons: 35, color: "bg-amber-500" },
  { name: "Social Studies", code: "SST", lessons: 30, color: "bg-purple-500" },
  { name: "Civic Education", code: "CVE", lessons: 28, color: "bg-rose-500" },
  { name: "Computer Studies", code: "ICT", lessons: 32, color: "bg-cyan-500" },
  { name: "French", code: "FRN", lessons: 24, color: "bg-indigo-500" },
  { name: "Basic Technology", code: "BTC", lessons: 26, color: "bg-teal-500" },
];

export default function ClassesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-surface-900">My Classes</h1>
        <p className="text-surface-500 text-sm mt-1">Select a class to view subjects and lesson resources.</p>
      </div>
      <div>
        <h2 className="text-lg font-semibold text-surface-900 mb-4 flex items-center gap-2">
          <span className="w-10 h-10 rounded-xl bg-brand-500 text-white flex items-center justify-center font-display font-bold">J2</span>
          JSS2 — Junior Secondary 2
          <Badge variant="success">Active</Badge>
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {subjects.map((s, i) => (
            <Link key={s.code} href={`/teacher/classes/jss2/${s.code.toLowerCase()}`}>
              <Card hover padding="md" className="group animate-fade-in-up" style={{ animationDelay: `${i * 0.06}s` } as React.CSSProperties}>
                <div className={`w-10 h-10 ${s.color} rounded-xl flex items-center justify-center mb-3`}>
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                </div>
                <p className="font-semibold text-surface-800 text-sm mb-0.5">{s.name}</p>
                <p className="text-xs text-surface-400">{s.lessons} lessons · 3 terms</p>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

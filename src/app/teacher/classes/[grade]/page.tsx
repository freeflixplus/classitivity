import React from "react";
import { Card, Button } from "@/components/ui";
import Link from "next/link";

export default function ClassDetails({ params }: { params: Promise<{ grade: string }> }) {
  const resolvedParams = React.use(params);
  const gradeStr = resolvedParams.grade.toUpperCase();
  
  const subjects = [
    { code: "MTH", name: "Mathematics" },
    { code: "ENG", name: "English Language" },
    { code: "BSC", name: "Basic Science" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/teacher/classes" className="text-brand-500 hover:text-brand-600 text-sm font-medium mb-2 inline-flex items-center gap-1">
            ← Back to Classes
          </Link>
          <h1 className="font-display text-2xl font-bold text-surface-900 dark:text-white">{gradeStr} Overview</h1>
          <p className="text-surface-500 dark:text-surface-400 text-sm mt-1">Select a subject to view lesson plans and resources.</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {subjects.map((sub) => (
          <Link key={sub.code} href={`/teacher/classes/${resolvedParams.grade}/${sub.code.toLowerCase()}`}>
            <Card hover padding="md" className="h-full flex flex-col items-start">
              <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-lg mb-4">
                {sub.code}
              </div>
              <h3 className="font-semibold text-surface-900 dark:text-white">{sub.name}</h3>
              <p className="text-sm text-surface-500 mt-1 mb-4">View lessons, slides, and notes</p>
              <div className="mt-auto text-brand-500 text-sm font-medium">Explore subject →</div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

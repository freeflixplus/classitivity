"use client";
import React, { useState } from "react";
import { Card, Badge, Button, SecureViewer } from "@/components/ui";
import Link from "next/link";

interface Resource {
  id: string;
  title: string;
  type: "pptx" | "pdf" | "docx";
  url: string;
}

const mockLessons = [
  {
    week: 1,
    title: "Introduction to Algebraic Expressions",
    resources: [
      { id: "1", title: "Lesson Slides", type: "pptx" as const, url: "https://www.learningcontainer.com/wp-content/uploads/2019/09/sample-pptx-file.pptx" },
      { id: "2", title: "Teacher's Guide", type: "pdf" as const, url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
    ]
  },
  {
    week: 2,
    title: "Solving Linear Equations",
    resources: [
      { id: "3", title: "Interactive Presentation", type: "pptx" as const, url: "https://www.learningcontainer.com/wp-content/uploads/2019/09/sample-pptx-file.pptx" },
      { id: "4", title: "Student Handout", type: "docx" as const, url: "https://www.learningcontainer.com/wp-content/uploads/2019/09/sample-docx-file-for-testing.docx" },
    ]
  }
];

export default function SubjectDetails({ params }: { params: Promise<{ grade: string, subject: string }> }) {
  const resolvedParams = React.use(params);
  const gradeStr = resolvedParams.grade.toUpperCase();
  const subjectStr = resolvedParams.subject.toUpperCase();

  const [activeDoc, setActiveDoc] = useState<Resource | null>(null);

  const getIconColor = (type: string) => {
    if (type === "pptx") return "bg-orange-50 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400";
    if (type === "pdf") return "bg-red-50 text-red-600 dark:bg-red-500/20 dark:text-red-400";
    return "bg-blue-50 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400";
  };

  return (
    <div className="space-y-8">
      {/* Viewer Overlay */}
      {activeDoc && (
        <SecureViewer 
          url={activeDoc.url}
          title={activeDoc.title}
          fileType={activeDoc.type}
          onClose={() => setActiveDoc(null)}
        />
      )}

      <div>
        <Link href={`/teacher/classes/${resolvedParams.grade}`} className="text-brand-500 hover:text-brand-600 text-sm font-medium mb-2 inline-flex items-center gap-1">
          ← Back to {gradeStr}
        </Link>
        <div className="flex items-center gap-3">
          <h1 className="font-display text-2xl font-bold text-surface-900 dark:text-white">{gradeStr} {subjectStr}</h1>
          <Badge variant="success">Term 1</Badge>
        </div>
        <p className="text-surface-500 dark:text-surface-400 text-sm mt-1">Lesson plans and secure DRM resources for this subject.</p>
      </div>

      <div className="space-y-4">
        {mockLessons.map((lesson) => (
          <Card key={lesson.week} padding="md">
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-xs font-bold text-brand-500 uppercase tracking-wider mb-1">Week {lesson.week}</p>
                <h3 className="text-lg font-semibold text-surface-900 dark:text-white">{lesson.title}</h3>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {lesson.resources.map((res) => (
                <button
                  key={res.id}
                  onClick={() => setActiveDoc(res)}
                  className="flex items-center gap-3 p-3 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800/50 hover:border-brand-300 hover:bg-brand-50 dark:hover:border-brand-500/30 dark:hover:bg-brand-500/10 transition-all text-left"
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs uppercase ${getIconColor(res.type)}`}>
                    {res.type}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-surface-900 dark:text-white truncate">{res.title}</p>
                    <p className="text-xs text-surface-500 dark:text-surface-400 truncate">Read Only</p>
                  </div>
                </button>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

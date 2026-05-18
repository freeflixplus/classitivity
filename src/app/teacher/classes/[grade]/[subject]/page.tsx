"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, Badge, Button } from "@/components/ui";
import { teacher } from "@/lib/api";

const resourceTypeLabels: Record<string, string> = {
  LESSON_PLAN: "Lesson Plan",
  POWERPOINT: "PowerPoint Slides",
  STUDENT_NOTES: "Student Notes",
  OBJECTIVE_QUESTIONS: "Objective Questions",
  THEORY_QUESTIONS: "Theory Questions",
  LESSON_OBJECTIVES: "Lesson Objectives",
};

const resourceTypeIcons: Record<string, string> = {
  LESSON_PLAN: "📄",
  POWERPOINT: "📊",
  STUDENT_NOTES: "📝",
  OBJECTIVE_QUESTIONS: "✅",
  THEORY_QUESTIONS: "📋",
  LESSON_OBJECTIVES: "🎯",
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

export default function SubjectLessonsPage() {
  const params = useParams();
  const grade = (params.grade as string)?.toUpperCase();
  const subject = (params.subject as string)?.toUpperCase();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState<string | null>(null);

  useEffect(() => {
    if (!grade || !subject) return;
    teacher.getLessons(grade, subject)
      .then(setData)
      .catch((err) => setError(err.message || "Failed to load lessons"))
      .finally(() => setLoading(false));
  }, [grade, subject]);

  const handleDownload = (resourceId: string, fileName: string) => {
    // Navigate to the secure viewer route
    // The viewer handles both view-only (DRM) and downloadable files
    import("next/navigation").then(({ useRouter }) => {
       // Since this is inside a component, it's better to just use window.location or next/link
       window.location.href = `/teacher/viewer/${resourceId}`;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Link href="/teacher/classes" className="text-brand-500 hover:text-brand-600 text-sm font-medium">← Back to Classes</Link>
        <Card padding="lg" className="text-center">
          <div className="text-5xl mb-4">🔒</div>
          <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-2">Access Restricted</h3>
          <p className="text-surface-500 dark:text-surface-400">{error}</p>
          <p className="text-surface-400 dark:text-surface-500 text-sm mt-2">Your school may need an active subscription for {grade} to access these materials.</p>
        </Card>
      </div>
    );
  }

  const lessons = data?.lessons || [];
  const subjectInfo = data?.subject || { code: subject, name: subject };

  // Group lessons by term
  const terms = [1, 2, 3];
  const lessonsByTerm = terms.map((term) => ({
    term,
    lessons: lessons.filter((l: any) => l.term === term),
  }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Link href="/teacher/classes" className="text-brand-500 hover:text-brand-600 text-sm font-medium mb-3 inline-block">← Back to Classes</Link>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-brand-500 text-white flex items-center justify-center text-xl">📚</div>
          <div>
            <h1 className="font-display text-2xl font-bold text-surface-900 dark:text-white">{subjectInfo.name}</h1>
            <p className="text-surface-500 dark:text-surface-400 text-sm">{grade} · {lessons.length} lessons available</p>
          </div>
        </div>
      </div>

      {/* Lessons by term */}
      {lessonsByTerm.map(({ term, lessons: termLessons }) => (
        <div key={term}>
          <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-4 flex items-center gap-2">
            <Badge variant="brand">Term {term}</Badge>
            <span className="text-surface-400 text-sm font-normal">{termLessons.length} lessons</span>
          </h2>

          {termLessons.length === 0 ? (
            <Card padding="md" className="text-center">
              <p className="text-surface-400 dark:text-surface-500 text-sm">No published lessons for Term {term} yet.</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {termLessons.map((lesson: any) => (
                <Card key={lesson.id} padding="md" className="animate-fade-in-up">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-surface-900 dark:text-white">{lesson.title}</h3>
                      <p className="text-xs text-surface-500 dark:text-surface-400">Week {lesson.week}</p>
                    </div>
                    <Badge variant="default">{lesson.resources.length} resource{lesson.resources.length !== 1 ? "s" : ""}</Badge>
                  </div>

                  {lesson.resources.length > 0 ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {lesson.resources.map((res: any) => (
                        <button
                          key={res.id}
                          onClick={() => handleDownload(res.id, res.title || res.fileName || "download")}
                          disabled={downloading === res.id}
                          className="flex items-center gap-3 p-3 rounded-xl bg-surface-50 dark:bg-surface-800 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors text-left group disabled:opacity-50"
                        >
                          <span className="text-2xl">{resourceTypeIcons[res.type] || "📄"}</span>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-surface-800 dark:text-white truncate">{resourceTypeLabels[res.type] || res.type}</p>
                            <p className="text-xs text-surface-400">{formatFileSize(res.fileSize)}</p>
                          </div>
                          {downloading === res.id ? (
                            <div className="w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <svg className="w-5 h-5 text-surface-400 group-hover:text-brand-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                          )}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-surface-400 dark:text-surface-500 italic">No resources uploaded for this lesson yet.</p>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      ))}

      {lessons.length === 0 && (
        <Card padding="lg" className="text-center">
          <div className="text-5xl mb-4">📭</div>
          <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-2">No Lessons Yet</h3>
          <p className="text-surface-500 dark:text-surface-400">Materials for {subjectInfo.name} in {grade} haven&apos;t been uploaded yet. Check back soon!</p>
        </Card>
      )}
    </div>
  );
}

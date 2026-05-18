"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, Button, Input } from "@/components/ui";
import { platformAdmin } from "@/lib/api";

export default function AddNewCoursePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "", subjectCode: "mathematics", curriculumVersion: "NG",
    gradeLevel: "JSS1", term: "1", week: "1", description: "", status: "DRAFT",
  });
  const [toast, setToast] = useState<{ show: boolean; type: "success" | "error"; title: string; message: string }>({
    show: false, type: "success", title: "", message: "",
  });

  const showToast = (type: "success" | "error", title: string, message: string) => {
    setToast({ show: true, type, title, message });
    if (type === "success") {
      setTimeout(() => {
        setToast(prev => ({ ...prev, show: false }));
        router.push("/platform-admin/courses");
      }, 2500);
    } else {
      setTimeout(() => setToast(prev => ({ ...prev, show: false })), 6000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.title.trim()) {
      showToast("error", "Validation Error", "Please enter a course title.");
      return;
    }

    setSaving(true);
    try {
      await platformAdmin.createCourse({
        ...form,
        term: parseInt(form.term),
        week: parseInt(form.week),
      });
      showToast("success", "Course Created! ✅", `"${form.title}" has been created successfully. Redirecting to courses...`);
    } catch (err: any) {
      const errorMsg = err?.message || "An unexpected error occurred while creating the course.";
      showToast("error", "Failed to Create Course ❌", errorMsg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Toast notification */}
      {toast.show && (
        <div className="fixed top-6 right-6 z-[100] animate-in slide-in-from-top-4 fade-in duration-300 max-w-md">
          <div className={`rounded-2xl shadow-2xl border p-5 ${
            toast.type === "success" 
              ? "bg-emerald-50 dark:bg-emerald-900/90 border-emerald-200 dark:border-emerald-700"
              : "bg-red-50 dark:bg-red-900/90 border-red-200 dark:border-red-700"
          }`}>
            <div className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                toast.type === "success" ? "bg-emerald-100 dark:bg-emerald-800" : "bg-red-100 dark:bg-red-800"
              }`}>
                {toast.type === "success" ? (
                  <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                ) : (
                  <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-bold ${
                  toast.type === "success" ? "text-emerald-800 dark:text-emerald-300" : "text-red-800 dark:text-red-300"
                }`}>{toast.title}</p>
                <p className={`text-xs mt-1 ${
                  toast.type === "success" ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
                }`}>{toast.message}</p>
              </div>
              <button onClick={() => setToast(p => ({ ...p, show: false }))} className="text-surface-400 hover:text-surface-600">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          </div>
        </div>
      )}

      <div>
        <h1 className="font-display text-2xl font-bold text-surface-900 dark:text-white">Add New Course</h1>
        <p className="text-surface-500 dark:text-surface-400 text-sm mt-1">Create a new lesson or course module. After creating, upload documents with pricing.</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input label="Course Title" placeholder="e.g. Introduction to Algebra" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300">Curriculum</label>
              <select value={form.curriculumVersion} onChange={(e) => setForm({ ...form, curriculumVersion: e.target.value })} className="w-full rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 px-4 py-2.5 text-sm text-surface-800 dark:text-surface-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400">
                <option value="NG">Nigerian Curriculum (NG)</option>
                <option value="UK">UK National Curriculum</option>
                <option value="US">US Common Core</option>
                <option value="AU">Australian Curriculum</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300">Subject</label>
              <select value={form.subjectCode} onChange={(e) => setForm({ ...form, subjectCode: e.target.value })} className="w-full rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 px-4 py-2.5 text-sm text-surface-800 dark:text-surface-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400">
                <option value="mathematics">Mathematics</option>
                <option value="english">English Language</option>
                <option value="basic_science">Basic Science</option>
                <option value="social_studies">Social Studies</option>
                <option value="basic_technology">Basic Technology</option>
                <option value="civic_education">Civic Education</option>
                <option value="physics">Physics</option>
                <option value="chemistry">Chemistry</option>
                <option value="biology">Biology</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300">Grade Level</label>
              <select value={form.gradeLevel} onChange={(e) => setForm({ ...form, gradeLevel: e.target.value })} className="w-full rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 px-4 py-2.5 text-sm text-surface-800 dark:text-surface-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400">
                <option value="PRI1">Primary 1</option>
                <option value="PRI2">Primary 2</option>
                <option value="PRI3">Primary 3</option>
                <option value="PRI4">Primary 4</option>
                <option value="PRI5">Primary 5</option>
                <option value="PRI6">Primary 6</option>
                <option value="JSS1">JSS 1 (Year 7)</option>
                <option value="JSS2">JSS 2 (Year 8)</option>
                <option value="JSS3">JSS 3 (Year 9)</option>
                <option value="SS1">SS 1 (Year 10)</option>
                <option value="SS2">SS 2 (Year 11)</option>
                <option value="SS3">SS 3 (Year 12)</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300">Term</label>
                <select value={form.term} onChange={(e) => setForm({ ...form, term: e.target.value })} className="w-full rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 px-4 py-2.5 text-sm text-surface-800 dark:text-surface-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400">
                  <option value="1">Term 1</option>
                  <option value="2">Term 2</option>
                  <option value="3">Term 3</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300">Week</label>
                <select value={form.week} onChange={(e) => setForm({ ...form, week: e.target.value })} className="w-full rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 px-4 py-2.5 text-sm text-surface-800 dark:text-surface-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400">
                  {Array.from({ length: 13 }, (_, i) => (
                    <option key={i + 1} value={String(i + 1)}>Week {i + 1}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300">Description</label>
            <textarea
              rows={4}
              placeholder="Brief description of this course..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 px-4 py-2.5 text-sm text-surface-800 dark:text-surface-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300">Status</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 px-4 py-2.5 text-sm text-surface-800 dark:text-surface-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400">
              <option value="DRAFT">Draft — Save but don&apos;t publish</option>
              <option value="PUBLISHED">Published — Visible to teachers</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-surface-200 dark:border-surface-800">
            <Button variant="ghost" type="button" onClick={() => router.back()}>Cancel</Button>
            <Button type="submit" loading={saving}>{saving ? "Creating..." : "Create Course"}</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

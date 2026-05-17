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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await platformAdmin.createCourse({
        ...form,
        term: parseInt(form.term),
        week: parseInt(form.week),
      });
      router.push("/platform-admin/courses");
    } catch (err: any) {
      alert(err.message || "Failed to create course");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
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
              <option value="PUBLISHED">Published — Visible to students</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-surface-200 dark:border-surface-800">
            <Button variant="ghost" type="button" onClick={() => router.back()}>Cancel</Button>
            <Button type="submit" loading={saving}>Create Course</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Card, Badge, Button, Modal, Input } from "@/components/ui";
import { platformAdmin } from "@/lib/api";

export default function AllCoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCourses() {
      try {
        const res = await platformAdmin.getContentOverview();
        setCourses(res.data || []);
      } catch (err) {
        console.error("Failed to load courses", err);
      } finally {
        setLoading(false);
      }
    }
    loadCourses();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-surface-900 dark:text-white">All Courses</h1>
          <p className="text-surface-500 dark:text-surface-400 text-sm mt-1">Manage lessons, materials, and resources across all curricula.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/platform-admin/courses/upload">
            <Button variant="secondary" icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
            }>Upload Resources</Button>
          </Link>
          <Link href="/platform-admin/courses/new">
            <Button icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            }>Add New Course</Button>
          </Link>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-3">
        <select className="bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-surface-900 dark:text-white text-sm rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-brand-500 outline-none">
          <option>All Curricula</option>
          <option>Nigerian Curriculum (NG)</option>
          <option>UK National Curriculum</option>
          <option>US Common Core</option>
          <option>Australian Curriculum</option>
        </select>
        <select className="bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-surface-900 dark:text-white text-sm rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-brand-500 outline-none">
          <option>All Grades</option>
          <option>JSS 1 (Year 7)</option>
          <option>JSS 2 (Year 8)</option>
          <option>JSS 3 (Year 9)</option>
        </select>
        <select className="bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-surface-900 dark:text-white text-sm rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-brand-500 outline-none">
          <option>All Status</option>
          <option>Published</option>
          <option>Draft</option>
        </select>
        <div className="flex-1" />
        <div className="relative">
          <input type="text" placeholder="Search courses..." className="w-64 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-surface-900 dark:text-white text-sm rounded-xl pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-brand-500 outline-none" />
          <svg className="w-4 h-4 text-surface-400 absolute left-3.5 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
      </div>

      {/* Courses table */}
      <Card padding="none" className="overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800/50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Course / Lesson</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Subject</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Resources</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Status</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-200 dark:divide-surface-800">
              {courses.map((l) => (
                <tr key={l.id} className="hover:bg-surface-50 dark:hover:bg-surface-700/30 transition-colors">
                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-surface-900 dark:text-white">{l.title}</p>
                    <p className="text-xs text-surface-500">{l.gradeLevel} · Term {l.term} · Week {l.week}</p>
                  </td>
                  <td className="px-5 py-4 text-sm text-surface-600 dark:text-surface-300">{l.subject?.name}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm text-surface-600 dark:text-surface-300">{l.resources?.length || l._count?.resources || 0}/6</span>
                      <div className="w-16 bg-surface-200 dark:bg-surface-700 rounded-full h-1.5">
                        <div className="bg-brand-500 h-1.5 rounded-full" style={{ width: `${((l.resources?.length || l._count?.resources || 0) / 6) * 100}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <Badge variant={l.status === "PUBLISHED" ? "success" : l.status === "DRAFT" ? "default" : "warning"}>
                      {l.status}
                    </Badge>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex gap-1 justify-end">
                      <Button variant="ghost" size="sm" className="text-surface-500 hover:text-surface-900 dark:hover:text-white">Edit</Button>
                      <Button variant="ghost" size="sm" className="text-surface-500 hover:text-red-600">Delete</Button>
                    </div>
                  </td>
                </tr>
              ))}
              {courses.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <svg className="w-12 h-12 text-surface-300 dark:text-surface-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                      <p className="text-sm text-surface-500 dark:text-surface-400">No courses created yet.</p>
                      <Link href="/platform-admin/courses/new">
                        <Button size="sm">Create Your First Course</Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}

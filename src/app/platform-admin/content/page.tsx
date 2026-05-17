"use client";
import React, { useEffect, useState } from "react";
import { Card, Badge, Button, Modal, Input } from "@/components/ui";
import { platformAdmin } from "@/lib/api";

export default function ContentCMSPage() {
  const [content, setContent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function loadContent() {
      try {
        const res = await platformAdmin.getContentOverview();
        setContent(res.data || []);
      } catch (err) {
        console.error("Failed to load content", err);
      } finally {
        setLoading(false);
      }
    }
    loadContent();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-surface-900 dark:text-white">Content CMS</h1>
          <p className="text-surface-500 dark:text-surface-400 text-sm mt-1">Manage global curriculum content, lessons, and resources.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>Add Lesson</Button>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <select className="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-surface-900 dark:text-white text-sm rounded-xl px-4 py-2 focus:ring-2 focus:ring-brand-500 outline-none">
          <option>Nigerian Curriculum (NG)</option>
          <option>UK National Curriculum</option>
        </select>
        <select className="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-surface-900 dark:text-white text-sm rounded-xl px-4 py-2 focus:ring-2 focus:ring-brand-500 outline-none">
          <option>JSS 2 (Year 8)</option>
          <option>JSS 1 (Year 7)</option>
        </select>
        <div className="flex-1" />
        <div className="relative">
          <input type="text" placeholder="Search lessons..." className="w-64 bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-surface-900 dark:text-white text-sm rounded-xl pl-10 pr-4 py-2 focus:ring-2 focus:ring-brand-500 outline-none" />
          <svg className="w-4 h-4 text-surface-400 absolute left-3.5 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
      </div>

      <Card padding="none" className="overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800/50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Lesson Title</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Subject</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Resources</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Status</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-200 dark:divide-surface-800">
              {content.map((l) => (
                <tr key={l.id} className="hover:bg-surface-50 dark:hover:bg-surface-700/30 transition-colors">
                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-surface-900 dark:text-white">{l.title}</p>
                    <p className="text-xs text-surface-500">{l.gradeLevel} · Term {l.term} · Week {l.week}</p>
                  </td>
                  <td className="px-5 py-4 text-sm text-surface-600 dark:text-surface-300">{l.subject?.name}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm text-surface-600 dark:text-surface-300">{l._count?.resources || 0}/6</span>
                      <div className="w-16 bg-surface-200 dark:bg-surface-700 rounded-full h-1.5">
                        <div className="bg-brand-500 h-1.5 rounded-full" style={{ width: `${((l._count?.resources || 0) / 6) * 100}%` }} />
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
                    </div>
                  </td>
                </tr>
              ))}
              {content.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-sm text-surface-500 dark:text-surface-400">
                    No lessons published yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Lesson">
        <form className="space-y-4">
          <Input label="Lesson Title" placeholder="e.g. Introduction to Algebra" required />
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300">Curriculum</label>
              <select className="w-full rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 px-4 py-2.5 text-sm text-surface-800 dark:text-surface-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400">
                <option value="NG">Nigerian (NG)</option>
                <option value="UK">United Kingdom (UK)</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300">Subject</label>
              <select className="w-full rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 px-4 py-2.5 text-sm text-surface-800 dark:text-surface-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400">
                <option value="math">Mathematics</option>
                <option value="eng">English Language</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300">Grade Level</label>
              <select className="w-full rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 px-4 py-2.5 text-sm text-surface-800 dark:text-surface-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400">
                <option value="JSS1">JSS 1</option>
                <option value="JSS2">JSS 2</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300">Term</label>
              <select className="w-full rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 px-4 py-2.5 text-sm text-surface-800 dark:text-surface-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400">
                <option value="1">Term 1</option>
                <option value="2">Term 2</option>
                <option value="3">Term 3</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)} type="button">Cancel</Button>
            <Button type="submit" onClick={(e) => { e.preventDefault(); setIsModalOpen(false); }}>Create Lesson</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Card, Badge, Button, Input } from "@/components/ui";
import { platformAdmin } from "@/lib/api";

export default function SchoolsPage() {
  const [schools, setSchools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit Modal State
  const [editingSchool, setEditingSchool] = useState<any>(null);
  const [editName, setEditName] = useState("");
  const [editIsActive, setEditIsActive] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadSchools();
  }, []);

  async function loadSchools() {
    try {
      const res = await platformAdmin.getSchools();
      setSchools(res.data || []);
    } catch (err) {
      console.error("Failed to load schools", err);
    } finally {
      setLoading(false);
    }
  }

  const handleEditClick = (school: any) => {
    setEditingSchool(school);
    setEditName(school.name);
    setEditIsActive(school.isActive);
  };

  const handleSaveEdit = async () => {
    if (!editingSchool) return;
    setIsSaving(true);
    try {
      await platformAdmin.updateSchool(editingSchool.id, {
        name: editName,
        isActive: editIsActive,
      });
      setEditingSchool(null);
      await loadSchools();
    } catch (err) {
      console.error("Failed to update school", err);
      alert("Failed to update school. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 relative">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-surface-900 dark:text-white">All Schools</h1>
          <p className="text-surface-500 dark:text-surface-400 text-sm mt-1">Manage tenants, their active curricula, and subscriptions.</p>
        </div>
        <Link href="/platform-admin/schools/new">
          <Button icon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          }>Onboard School</Button>
        </Link>
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
                <th className="text-left px-5 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">School Name</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Region</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Teachers</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Status</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-200 dark:divide-surface-800">
              {schools.map((school) => (
                <tr key={school.id} className="hover:bg-surface-50 dark:hover:bg-surface-700/30 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-500/20 flex items-center justify-center font-bold text-brand-600 dark:text-brand-400 text-xs">
                        {school.curriculumVersion}
                      </div>
                      <span className="text-sm font-medium text-surface-900 dark:text-white">{school.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-surface-600 dark:text-surface-300">
                    {school.curriculumVersion === "NG" ? "Nigeria" : school.curriculumVersion === "UK" ? "United Kingdom" : school.curriculumVersion === "US" ? "United States" : "Australia"}
                  </td>
                  <td className="px-5 py-4 text-sm text-surface-600 dark:text-surface-300">{school._count?.users ?? 0}</td>
                  <td className="px-5 py-4">
                    <Badge variant={school.isActive ? "success" : "danger"}>
                      {school.isActive ? "active" : "suspended"}
                    </Badge>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Button variant="ghost" size="sm" className="text-surface-500 dark:text-surface-400" onClick={() => handleEditClick(school)}>Manage</Button>
                  </td>
                </tr>
              ))}
              {schools.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <svg className="w-12 h-12 text-surface-300 dark:text-surface-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                      <p className="text-sm text-surface-500 dark:text-surface-400">No schools registered yet.</p>
                      <Link href="/platform-admin/schools/new">
                        <Button size="sm">Onboard Your First School</Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </Card>

      {/* Edit School Modal */}
      {editingSchool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-surface-900 rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-surface-200 dark:border-surface-800 flex items-center justify-between">
              <h3 className="font-display text-lg font-bold text-surface-900 dark:text-white">Manage School</h3>
              <button
                onClick={() => setEditingSchool(null)}
                className="p-2 rounded-lg text-surface-400 hover:text-surface-600 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <Input
                label="School Name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Enter school name"
              />

              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Account Status</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setEditIsActive(true)}
                    className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-colors ${
                      editIsActive
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/30 dark:text-emerald-400'
                        : 'bg-white border-surface-200 text-surface-600 hover:bg-surface-50 dark:bg-surface-900 dark:border-surface-700 dark:text-surface-400'
                    }`}
                  >
                    Active
                  </button>
                  <button
                    onClick={() => setEditIsActive(false)}
                    className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-colors ${
                      !editIsActive
                        ? 'bg-red-50 border-red-200 text-red-700 dark:bg-red-500/10 dark:border-red-500/30 dark:text-red-400'
                        : 'bg-white border-surface-200 text-surface-600 hover:bg-surface-50 dark:bg-surface-900 dark:border-surface-700 dark:text-surface-400'
                    }`}
                  >
                    Suspended
                  </button>
                </div>
                <p className="text-xs text-surface-500 mt-2">
                  Suspending a school prevents all its teachers and admins from accessing the platform.
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-surface-200 dark:border-surface-800 flex justify-end gap-3 bg-surface-50 dark:bg-surface-800/50">
              <Button variant="ghost" onClick={() => setEditingSchool(null)} disabled={isSaving}>
                Cancel
              </Button>
              <Button onClick={handleSaveEdit} disabled={isSaving || !editName.trim()}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

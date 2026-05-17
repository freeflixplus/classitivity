"use client";
import React, { useEffect, useState } from "react";
import { Card, Badge, Button, Input } from "@/components/ui";
import { schoolAdmin } from "@/lib/api";

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // New teacher form
  const [newTeacherName, setNewTeacherName] = useState("");
  const [newTeacherEmail, setNewTeacherEmail] = useState("");
  const [adding, setAdding] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    loadTeachers();
  }, []);

  async function loadTeachers() {
    try {
      const data = await schoolAdmin.getTeachers();
      setTeachers(data);
    } catch (err) {
      console.error("Failed to load teachers", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddTeacher(e: React.FormEvent) {
    e.preventDefault();
    setAdding(true);
    try {
      await schoolAdmin.addTeacher(newTeacherName, newTeacherEmail);
      setNewTeacherName("");
      setNewTeacherEmail("");
      setShowAddForm(false);
      loadTeachers(); // reload list
    } catch (err) {
      console.error("Failed to add teacher", err);
    } finally {
      setAdding(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-surface-900 dark:text-white">Teachers</h1>
          <p className="text-surface-500 dark:text-surface-400 text-sm mt-1">Manage teacher accounts and class assignments.</p>
        </div>
        <Button variant="primary" size="md" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? "Cancel" : "+ Add Teacher"}
        </Button>
      </div>

      {showAddForm && (
        <Card className="animate-fade-in-up">
          <h3 className="font-semibold text-surface-900 dark:text-white mb-4">Add New Teacher</h3>
          <form onSubmit={handleAddTeacher} className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1">
              <Input label="Full Name" value={newTeacherName} onChange={(e) => setNewTeacherName(e.target.value)} required />
            </div>
            <div className="flex-1">
              <Input label="Email Address" type="email" value={newTeacherEmail} onChange={(e) => setNewTeacherEmail(e.target.value)} required />
            </div>
            <Button type="submit" loading={adding}>Save Teacher</Button>
          </form>
        </Card>
      )}

      <Card padding="none" className="overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800/50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Teacher</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Last Login</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-200 dark:divide-surface-800">
                {teachers.map((t) => (
                  <tr key={t.id} className="hover:bg-surface-50 dark:hover:bg-surface-700/30 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-50 dark:bg-brand-500/20 flex items-center justify-center text-xs font-semibold text-brand-600 dark:text-brand-400 uppercase">
                          {t.name.split(" ")[1]?.[0] || t.name[0]}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-surface-900 dark:text-white">{t.name}</p>
                          <p className="text-xs text-surface-500 dark:text-surface-400">{t.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant={t.isActive ? "success" : "default"}>{t.isActive ? "Active" : "Inactive"}</Badge>
                    </td>
                    <td className="px-5 py-4 text-sm text-surface-600 dark:text-surface-400">
                      {t.lastLoginAt ? new Date(t.lastLoginAt).toLocaleDateString() : "Never"}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button className="text-surface-400 hover:text-brand-500 transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
                      </button>
                    </td>
                  </tr>
                ))}
                {teachers.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-5 py-8 text-center text-sm text-surface-500 dark:text-surface-400">
                      No teachers added yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

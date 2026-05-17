"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, Button, Input } from "@/components/ui";
import { platformAdmin } from "@/lib/api";

export default function OnboardSchoolPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", curriculumVersion: "NG", country: "Nigeria", adminName: "", email: "", phone: "" });
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await platformAdmin.createSchool(form);
      setResult(res);
    } catch (err: any) {
      alert(err.message || "Failed to create school");
    } finally {
      setSaving(false);
    }
  };

  if (result) {
    return (
      <div className="max-w-3xl mx-auto space-y-8">
        <Card className="text-center py-8">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-surface-900 dark:text-white font-display">School Created!</h2>
          <p className="text-surface-500 dark:text-surface-400 mt-2 text-sm">{result.message}</p>
          <div className="flex justify-center gap-3 mt-6">
            <Button variant="ghost" onClick={() => { setResult(null); setForm({ name: "", curriculumVersion: "NG", country: "Nigeria", adminName: "", email: "", phone: "" }); }}>Add Another</Button>
            <Button onClick={() => router.push("/platform-admin/schools")}>View All Schools</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-surface-900 dark:text-white">Onboard New School</h1>
        <p className="text-surface-500 dark:text-surface-400 text-sm mt-1">Register a new school and create their admin account.</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input label="School Name" placeholder="e.g. Greenfield Academy" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />

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
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300">Country</label>
              <select value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className="w-full rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 px-4 py-2.5 text-sm text-surface-800 dark:text-surface-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400">
                <option>Nigeria</option>
                <option>United Kingdom</option>
                <option>United States</option>
                <option>Australia</option>
              </select>
            </div>
          </div>

          <hr className="border-surface-200 dark:border-surface-800" />
          <p className="text-sm font-semibold text-surface-700 dark:text-surface-300">School Administrator</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Admin Full Name" placeholder="e.g. John Doe" required value={form.adminName} onChange={(e) => setForm({ ...form, adminName: e.target.value })} />
            <Input label="Admin Email" type="email" placeholder="admin@school.edu" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <Input label="Phone Number (optional)" type="tel" placeholder="+234 800 000 0000" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />

          <div className="flex justify-end gap-3 pt-4 border-t border-surface-200 dark:border-surface-800">
            <Button variant="ghost" type="button" onClick={() => router.back()}>Cancel</Button>
            <Button type="submit" loading={saving}>Create School Account</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

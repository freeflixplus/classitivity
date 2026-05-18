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
  const [toast, setToast] = useState<{ show: boolean; type: "success" | "error"; title: string; message: string }>({
    show: false, type: "success", title: "", message: "",
  });

  const showToast = (type: "success" | "error", title: string, message: string) => {
    setToast({ show: true, type, title, message });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), type === "error" ? 6000 : 4000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim() || !form.adminName.trim() || !form.email.trim()) {
      showToast("error", "Validation Error", "Please fill in all required fields: School Name, Admin Name, and Admin Email.");
      return;
    }

    setSaving(true);
    try {
      const res = await platformAdmin.createSchool(form);
      setResult(res);
      showToast("success", "School Created! ✅", res.message || `${form.name} has been registered successfully.`);
    } catch (err: any) {
      const errorMsg = err?.message || "Failed to create school. Please check the details and try again.";
      showToast("error", "Failed to Create School ❌", errorMsg);
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
            <Button type="submit" loading={saving}>{saving ? "Creating..." : "Create School Account"}</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

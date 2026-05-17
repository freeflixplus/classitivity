"use client";
import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card, Button, Badge, Input } from "@/components/ui";
import { platformAdmin } from "@/lib/api";

interface UploadFile {
  file: File;
  id: string;
  status: "pending" | "uploading" | "done" | "error";
  progress: number;
  price: string;
  currency: string;
  resourceType: string;
}

const RESOURCE_TYPES = [
  { value: "LESSON_PLAN", label: "Lesson Plan" },
  { value: "POWERPOINT", label: "Presentation (PPT)" },
  { value: "STUDENT_NOTES", label: "Student Notes" },
  { value: "OBJECTIVE_QUESTIONS", label: "Objective Questions" },
  { value: "THEORY_QUESTIONS", label: "Theory Questions" },
  { value: "LESSON_OBJECTIVES", label: "Lesson Objectives" },
];

const CURRENCIES = [
  { value: "NGN", label: "₦ Nigerian Naira (NGN)", symbol: "₦" },
  { value: "USD", label: "$ US Dollar (USD)", symbol: "$" },
  { value: "GBP", label: "£ British Pound (GBP)", symbol: "£" },
  { value: "AUD", label: "A$ Australian Dollar (AUD)", symbol: "A$" },
];

export default function UploadResourcesPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [lessonId, setLessonId] = useState("");
  const [globalCurrency, setGlobalCurrency] = useState("NGN");

  const addFiles = (fileList: FileList) => {
    const accepted = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "application/msword",
      "application/vnd.ms-powerpoint",
    ];
    const newFiles: UploadFile[] = Array.from(fileList)
      .filter((f) => accepted.includes(f.type) || f.name.match(/\.(pdf|docx?|pptx?)$/i))
      .map((f) => ({
        file: f,
        id: Math.random().toString(36).slice(2),
        status: "pending" as const,
        progress: 0,
        price: "",
        currency: globalCurrency,
        resourceType: f.name.match(/\.pptx?$/i) ? "POWERPOINT" : f.name.match(/\.pdf$/i) ? "LESSON_PLAN" : "STUDENT_NOTES",
      }));
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files) addFiles(e.dataTransfer.files);
  };

  const updateFile = (id: string, updates: Partial<UploadFile>) => {
    setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, ...updates } : f)));
  };

  const handleUploadAll = async () => {
    const pendingFiles = files.filter((f) => f.status === "pending");
    
    for (const f of pendingFiles) {
      if (!f.price || parseFloat(f.price) < 0) {
        alert(`Please set a price for "${f.file.name}". Set 0 for free documents.`);
        return;
      }
    }

    for (const f of pendingFiles) {
      updateFile(f.id, { status: "uploading" });
      
      try {
        // Upload the file via FormData (with pricing attached)
        await platformAdmin.uploadResource(
          lessonId || "placeholder",
          f.file,
          f.resourceType,
          Math.round(parseFloat(f.price) * 100), // Convert to smallest unit
          f.currency
        );

        // Simulate upload progress
        for (let p = 0; p <= 100; p += 25) {
          await new Promise((r) => setTimeout(r, 200));
          updateFile(f.id, { progress: Math.min(p, 100) });
        }
        
        updateFile(f.id, { status: "done", progress: 100 });
      } catch (err) {
        console.error("Upload failed for", f.file.name, err);
        updateFile(f.id, { status: "error" });
      }
    }
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const getFileIcon = (name: string) => {
    if (name.match(/\.pdf$/i)) return { color: "text-red-500 bg-red-50 dark:bg-red-500/15", label: "PDF" };
    if (name.match(/\.pptx?$/i)) return { color: "text-orange-500 bg-orange-50 dark:bg-orange-500/15", label: "PPT" };
    if (name.match(/\.docx?$/i)) return { color: "text-blue-500 bg-blue-50 dark:bg-blue-500/15", label: "DOC" };
    return { color: "text-surface-500 bg-surface-50 dark:bg-surface-700", label: "FILE" };
  };

  const currSymbol = CURRENCIES.find((c) => c.value === globalCurrency)?.symbol || "₦";

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-surface-900 dark:text-white">Upload Resources</h1>
        <p className="text-surface-500 dark:text-surface-400 text-sm mt-1">
          Upload lesson documents (PDF, DOCX, PPTX) and set the price students pay to access each file.
        </p>
      </div>

      {/* Global settings */}
      <Card>
        <h3 className="text-sm font-semibold text-surface-700 dark:text-surface-300 mb-3">Upload Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300">Default Currency</label>
            <select
              value={globalCurrency}
              onChange={(e) => {
                setGlobalCurrency(e.target.value);
                setFiles((prev) => prev.map((f) => f.status === "pending" ? { ...f, currency: e.target.value } : f));
              }}
              className="w-full rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 px-4 py-2.5 text-sm text-surface-800 dark:text-surface-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400"
            >
              {CURRENCIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300">Assign to Course (optional)</label>
            <input
              type="text"
              value={lessonId}
              onChange={(e) => setLessonId(e.target.value)}
              placeholder="Course ID or leave blank"
              className="w-full rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 px-4 py-2.5 text-sm text-surface-800 dark:text-surface-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400"
            />
          </div>
        </div>
      </Card>

      {/* Drop zone */}
      <Card
        className={`border-2 border-dashed transition-colors cursor-pointer ${
          dragActive
            ? "border-brand-500 bg-brand-50/50 dark:bg-brand-500/10"
            : "border-surface-300 dark:border-surface-700 hover:border-brand-400 dark:hover:border-brand-500"
        }`}
        padding="lg"
      >
        <div
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center gap-4 py-8"
        >
          <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-500/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-surface-800 dark:text-white">
              Drag & drop files here, or <span className="text-brand-500 underline">browse</span>
            </p>
            <p className="text-xs text-surface-400 mt-1">Supported: PDF, DOCX, PPTX · Max 50 MB per file</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.ppt,.pptx"
            className="hidden"
            onChange={(e) => e.target.files && addFiles(e.target.files)}
          />
        </div>
      </Card>

      {/* File list with PRICING */}
      {files.length > 0 && (
        <Card padding="none" className="overflow-hidden">
          <div className="px-5 py-3 bg-surface-50 dark:bg-surface-800/50 border-b border-surface-200 dark:border-surface-700 flex items-center justify-between">
            <span className="text-sm font-medium text-surface-700 dark:text-surface-300">
              {files.length} file{files.length > 1 ? "s" : ""} — Set price for each document
            </span>
            <Button size="sm" onClick={handleUploadAll} disabled={files.every(f => f.status === "done")}>
              Upload & Save All
            </Button>
          </div>
          <div className="divide-y divide-surface-200 dark:divide-surface-800">
            {files.map((f) => {
              const icon = getFileIcon(f.file.name);
              return (
                <div key={f.id} className="px-5 py-4">
                  <div className="flex items-start gap-4">
                    <span className={`text-xs font-bold px-2.5 py-1.5 rounded-lg ${icon.color}`}>
                      {icon.label}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-surface-800 dark:text-white truncate">{f.file.name}</p>
                      <p className="text-xs text-surface-400">{(f.file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    {f.status === "done" && <Badge variant="success">Uploaded</Badge>}
                    {f.status === "error" && <Badge variant="danger">Failed</Badge>}
                    {f.status === "uploading" && (
                      <div className="w-24 mt-1">
                        <div className="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-1.5">
                          <div className="bg-brand-500 h-1.5 rounded-full transition-all" style={{ width: `${f.progress}%` }} />
                        </div>
                      </div>
                    )}
                    {f.status === "pending" && (
                      <button onClick={() => removeFile(f.id)} className="text-surface-400 hover:text-red-500 transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    )}
                  </div>

                  {/* Pricing row — only for pending files */}
                  {f.status === "pending" && (
                    <div className="mt-3 flex items-end gap-3 pl-10">
                      <div className="space-y-1 flex-1 max-w-[200px]">
                        <label className="block text-xs font-medium text-surface-500">
                          Price ({CURRENCIES.find(c => c.value === f.currency)?.symbol})
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 text-sm">
                            {CURRENCIES.find(c => c.value === f.currency)?.symbol}
                          </span>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={f.price}
                            onChange={(e) => updateFile(f.id, { price: e.target.value })}
                            placeholder="0.00"
                            className="w-full rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 pl-8 pr-3 py-2 text-sm text-surface-800 dark:text-surface-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400"
                          />
                        </div>
                        <p className="text-[10px] text-surface-400">Set 0 for free access</p>
                      </div>
                      <div className="space-y-1">
                        <label className="block text-xs font-medium text-surface-500">Type</label>
                        <select
                          value={f.resourceType}
                          onChange={(e) => updateFile(f.id, { resourceType: e.target.value })}
                          className="rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 px-3 py-2 text-sm text-surface-800 dark:text-surface-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                        >
                          {RESOURCE_TYPES.map((t) => (
                            <option key={t.value} value={t.value}>{t.label}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="block text-xs font-medium text-surface-500">Currency</label>
                        <select
                          value={f.currency}
                          onChange={(e) => updateFile(f.id, { currency: e.target.value })}
                          className="rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 px-3 py-2 text-sm text-surface-800 dark:text-surface-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                        >
                          {CURRENCIES.map((c) => (
                            <option key={c.value} value={c.value}>{c.value}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Security & workflow info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-start gap-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl p-4 border border-emerald-200 dark:border-emerald-500/20">
          <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <div>
            <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">Content Protection</p>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5">Right-click disabled, download blocked, print restricted via Secure Viewer.</p>
          </div>
        </div>
        <div className="flex items-start gap-3 bg-brand-50 dark:bg-brand-500/10 rounded-xl p-4 border border-brand-200 dark:border-brand-500/20">
          <svg className="w-5 h-5 text-brand-600 dark:text-brand-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <div>
            <p className="text-sm font-medium text-brand-800 dark:text-brand-300">Payment Workflow</p>
            <p className="text-xs text-brand-600 dark:text-brand-400 mt-0.5">Students see the price → Pay via Paystack/Stripe → Document opens in Secure Viewer.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

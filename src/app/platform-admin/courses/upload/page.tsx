"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, Button, Badge } from "@/components/ui";
import { platformAdmin } from "@/lib/api";

interface UploadFile {
  file: File;
  id: string;
  status: "pending" | "uploading" | "done" | "error";
  progress: number;
  price: string;
  currency: string;
  resourceType: string;
  errorMessage?: string;
}

const RESOURCE_TYPES = [
  { value: "LESSON_PLAN", label: "Lesson Plan", icon: "📄" },
  { value: "POWERPOINT", label: "Presentation (PPT)", icon: "📊" },
  { value: "STUDENT_NOTES", label: "Student Notes", icon: "📝" },
  { value: "OBJECTIVE_QUESTIONS", label: "Objective Questions", icon: "✅" },
  { value: "THEORY_QUESTIONS", label: "Theory Questions", icon: "📋" },
  { value: "LESSON_OBJECTIVES", label: "Lesson Objectives", icon: "🎯" },
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
  const [availableLessons, setAvailableLessons] = useState<any[]>([]);
  const [loadingLessons, setLoadingLessons] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  // Toast notification state
  const [toast, setToast] = useState<{ show: boolean; type: "success" | "error"; title: string; message: string }>({
    show: false, type: "success", title: "", message: "",
  });

  useEffect(() => {
    platformAdmin.getLessons(1, 200)
      .then(res => setAvailableLessons(res.data || []))
      .catch(err => console.error("Failed to load lessons", err))
      .finally(() => setLoadingLessons(false));
  }, []);

  const showToast = useCallback((type: "success" | "error", title: string, message: string) => {
    setToast({ show: true, type, title, message });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 5000);
  }, []);

  const addFiles = (fileList: FileList) => {
    const newFiles: UploadFile[] = Array.from(fileList)
      .filter((f) => f.name.match(/\.(pdf|docx?|pptx?)$/i))
      .map((f) => ({
        file: f,
        id: Math.random().toString(36).slice(2),
        status: "pending" as const,
        progress: 0,
        price: "0",
        currency: globalCurrency,
        resourceType: f.name.match(/\.pptx?$/i) ? "POWERPOINT" : f.name.match(/\.pdf$/i) ? "LESSON_PLAN" : "STUDENT_NOTES",
      }));
    
    if (newFiles.length === 0 && fileList.length > 0) {
      showToast("error", "Unsupported File", "Only PDF, DOC, DOCX, PPT, and PPTX files are supported.");
      return;
    }
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
    if (!lessonId) {
      showToast("error", "No Course Selected", "Please select a course/lesson to assign these resources to before uploading.");
      return;
    }

    const pendingFiles = files.filter((f) => f.status === "pending");
    if (pendingFiles.length === 0) {
      showToast("error", "No Files", "Please add files to upload first.");
      return;
    }

    setIsUploading(true);
    let successCount = 0;
    let failCount = 0;
    const errors: string[] = [];

    for (const f of pendingFiles) {
      updateFile(f.id, { status: "uploading", progress: 10 });

      try {
        // Simulate progress during network upload
        const progressInterval = setInterval(() => {
          setFiles(prev => prev.map(pf => {
            if (pf.id === f.id && pf.status === "uploading" && pf.progress < 85) {
              return { ...pf, progress: pf.progress + Math.random() * 15 };
            }
            return pf;
          }));
        }, 300);

        await platformAdmin.uploadResource(
          lessonId,
          f.file,
          f.resourceType,
          Math.round(parseFloat(f.price || "0") * 100),
          f.currency
        );

        clearInterval(progressInterval);
        updateFile(f.id, { status: "done", progress: 100 });
        successCount++;
      } catch (err: any) {
        const errMsg = err?.message || "Unknown error occurred during upload.";
        updateFile(f.id, { status: "error", errorMessage: errMsg });
        failCount++;
        errors.push(`${f.file.name}: ${errMsg}`);
      }
    }

    setIsUploading(false);

    if (failCount === 0) {
      showToast("success", "Upload Complete! ✅", `${successCount} file${successCount > 1 ? "s" : ""} uploaded successfully.`);
    } else if (successCount === 0) {
      showToast("error", "Upload Failed ❌", errors.join("\n"));
    } else {
      showToast("error", "Partial Upload", `${successCount} succeeded, ${failCount} failed.\n${errors.join("\n")}`);
    }
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const retryFile = (id: string) => {
    updateFile(id, { status: "pending", progress: 0, errorMessage: undefined });
  };

  const getFileIcon = (name: string) => {
    if (name.match(/\.pdf$/i)) return { color: "text-red-500 bg-red-50 dark:bg-red-500/15", label: "PDF" };
    if (name.match(/\.pptx?$/i)) return { color: "text-orange-500 bg-orange-50 dark:bg-orange-500/15", label: "PPT" };
    if (name.match(/\.docx?$/i)) return { color: "text-blue-500 bg-blue-50 dark:bg-blue-500/15", label: "DOC" };
    return { color: "text-surface-500 bg-surface-50 dark:bg-surface-700", label: "FILE" };
  };

  const doneCount = files.filter(f => f.status === "done").length;
  const errorCount = files.filter(f => f.status === "error").length;
  const pendingCount = files.filter(f => f.status === "pending").length;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
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
                  <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-bold ${
                  toast.type === "success" ? "text-emerald-800 dark:text-emerald-300" : "text-red-800 dark:text-red-300"
                }`}>{toast.title}</p>
                <p className={`text-xs mt-1 whitespace-pre-line ${
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
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300">Assign to Course/Lesson</label>
            <select
              value={lessonId}
              onChange={(e) => setLessonId(e.target.value)}
              disabled={loadingLessons}
              className="w-full rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 px-4 py-2.5 text-sm text-surface-800 dark:text-surface-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 disabled:opacity-50"
            >
              <option value="" disabled>
                {loadingLessons ? "Loading courses..." : availableLessons.length === 0 ? "No courses found — create one first" : "Select a course/lesson..."}
              </option>
              {availableLessons.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.subject?.name || "Unknown"} ({l.gradeLevel}) — Term {l.term} Week {l.week}: {l.title}
                </option>
              ))}
            </select>
            {!loadingLessons && availableLessons.length === 0 && (
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                No courses exist yet.{" "}
                <a href="/platform-admin/courses/new" className="underline font-medium">Create a course first</a> to upload resources.
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* Drop zone */}
      <Card
        className={`border-2 border-dashed transition-all duration-200 cursor-pointer ${
          dragActive
            ? "border-brand-500 bg-brand-50/50 dark:bg-brand-500/10 scale-[1.01]"
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
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${
            dragActive ? "bg-brand-100 dark:bg-brand-500/30" : "bg-brand-50 dark:bg-brand-500/20"
          }`}>
            <svg className="w-8 h-8 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-surface-800 dark:text-white">
              Drag & drop files here, or <span className="text-brand-500 underline">browse</span>
            </p>
            <p className="text-xs text-surface-400 mt-1">Supported: PDF, DOC, DOCX, PPT, PPTX · Max 50 MB per file</p>
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

      {/* File list */}
      {files.length > 0 && (
        <Card padding="none" className="overflow-hidden">
          <div className="px-5 py-3 bg-surface-50 dark:bg-surface-800/50 border-b border-surface-200 dark:border-surface-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-surface-700 dark:text-surface-300">
                {files.length} file{files.length > 1 ? "s" : ""}
              </span>
              {doneCount > 0 && <Badge variant="success">{doneCount} uploaded</Badge>}
              {errorCount > 0 && <Badge variant="danger">{errorCount} failed</Badge>}
              {pendingCount > 0 && <Badge variant="default">{pendingCount} pending</Badge>}
            </div>
            <Button
              size="sm"
              onClick={handleUploadAll}
              disabled={isUploading || pendingCount === 0}
              loading={isUploading}
            >
              {isUploading ? "Uploading..." : `Upload ${pendingCount > 0 ? pendingCount : "All"} File${pendingCount !== 1 ? "s" : ""}`}
            </Button>
          </div>
          <div className="divide-y divide-surface-200 dark:divide-surface-800">
            {files.map((f) => {
              const icon = getFileIcon(f.file.name);
              return (
                <div key={f.id} className={`px-5 py-4 transition-colors ${
                  f.status === "done" ? "bg-emerald-50/30 dark:bg-emerald-500/5" : 
                  f.status === "error" ? "bg-red-50/30 dark:bg-red-500/5" : ""
                }`}>
                  <div className="flex items-start gap-4">
                    <span className={`text-xs font-bold px-2.5 py-1.5 rounded-lg ${icon.color}`}>
                      {icon.label}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-surface-800 dark:text-white truncate">{f.file.name}</p>
                      <p className="text-xs text-surface-400">{(f.file.size / 1024 / 1024).toFixed(2)} MB</p>
                      {f.status === "error" && f.errorMessage && (
                        <p className="text-xs text-red-500 dark:text-red-400 mt-1">⚠️ {f.errorMessage}</p>
                      )}
                    </div>
                    {f.status === "done" && (
                      <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        <Badge variant="success">Uploaded</Badge>
                      </div>
                    )}
                    {f.status === "error" && (
                      <div className="flex items-center gap-2">
                        <Badge variant="danger">Failed</Badge>
                        <button onClick={() => retryFile(f.id)} className="text-xs text-brand-500 hover:text-brand-600 font-medium underline">Retry</button>
                      </div>
                    )}
                    {f.status === "uploading" && (
                      <div className="flex items-center gap-2 w-32">
                        <div className="flex-1 bg-surface-200 dark:bg-surface-700 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-brand-400 to-brand-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(f.progress, 100)}%` }}
                          />
                        </div>
                        <span className="text-xs text-brand-500 font-medium whitespace-nowrap">{Math.round(f.progress)}%</span>
                      </div>
                    )}
                    {f.status === "pending" && (
                      <button onClick={() => removeFile(f.id)} className="text-surface-400 hover:text-red-500 transition-colors p-1">
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
                            <option key={t.value} value={t.value}>{t.icon} {t.label}</option>
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

      {/* Security info */}
      <div className="flex items-start gap-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl p-4 border border-emerald-200 dark:border-emerald-500/20">
        <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        <div>
          <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">Content Protection</p>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5">All uploaded documents (PDF, DOC, DOCX, PPT, PPTX) are protected with DRM watermarking, right-click disabled, and print restrictions via Secure Viewer.</p>
        </div>
      </div>
    </div>
  );
}

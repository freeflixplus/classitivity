"use client";
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface SecureViewerProps {
  url: string;
  title: string;
  fileType: "pdf" | "pptx" | "docx" | "xlsx";
  onClose: () => void;
}

export function SecureViewer({ url, title, fileType, onClose }: SecureViewerProps) {
  const [isLoading, setIsLoading] = useState(true);

  // Disable keyboard shortcuts (Ctrl+S, Ctrl+P)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === "s" || e.key === "p")) {
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Google Docs Viewer URL format
  // Note: For this to work in production, the 'url' must be a publicly accessible HTTP/HTTPS URL
  const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface-900/95 backdrop-blur-sm p-4 lg:p-8 animate-fade-in"
         onContextMenu={(e) => e.preventDefault()} // Prevent right-click globally in viewer
    >
      <div className="w-full max-w-6xl h-full flex flex-col bg-white dark:bg-surface-900 rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
        
        {/* Secure Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold uppercase text-xs">
              {fileType}
            </div>
            <div>
              <h3 className="font-semibold text-surface-900 dark:text-white leading-tight">{title}</h3>
              <p className="text-xs text-brand-500 font-medium">Secured View · Download Disabled</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-surface-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Viewer Area */}
        <div className="flex-1 relative bg-surface-100 dark:bg-surface-950 overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface-50 dark:bg-surface-900 z-10">
              <div className="w-10 h-10 border-3 border-brand-500 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-surface-600 dark:text-surface-400 font-medium text-sm animate-pulse-soft">
                Loading encrypted document...
              </p>
            </div>
          )}

          {/* 
            Google Docs iframe wrapper. 
            We use negative top margin to hide the Google Docs toolbar 
            which contains the "Pop-out/Download" button.
          */}
          <div className="absolute w-full h-[calc(100%+60px)] -top-[60px] left-0 pointer-events-auto">
            <iframe
              src={viewerUrl}
              className="w-full h-full border-none"
              onLoad={() => setIsLoading(false)}
              title={title}
            />
          </div>

          {/* Invisible overlay over the top 60px to prevent clicking anywhere near where the toolbar used to be */}
          <div className="absolute top-0 left-0 right-0 h-[60px] bg-transparent z-20" />
        </div>
      </div>
    </div>
  );
}

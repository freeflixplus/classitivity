"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { teacher } from "@/lib/api";
import { Card, Button } from "@/components/ui";

export default function ResourceViewerPage() {
  const params = useParams();
  const router = useRouter();
  const resourceId = params.resourceId as string;

  const [resource, setResource] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!resourceId) return;
    teacher.getResourceUrl(resourceId)
      .then(setResource)
      .catch((err) => setError(err.message || "Failed to load resource"))
      .finally(() => setLoading(false));
  }, [resourceId]);

  // Disable right-click
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };
    document.addEventListener("contextmenu", handleContextMenu);
    return () => document.removeEventListener("contextmenu", handleContextMenu);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 max-w-lg mx-auto mt-20 text-center">
        <Card padding="lg">
          <div className="text-5xl mb-4">🔒</div>
          <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-2">Access Denied</h3>
          <p className="text-surface-500 dark:text-surface-400 mb-6">{error}</p>
          <Button variant="primary" onClick={() => router.back()}>Go Back</Button>
        </Card>
      </div>
    );
  }

  const isPPT = resource?.fileName?.toLowerCase().endsWith('.ppt') || resource?.fileName?.toLowerCase().endsWith('.pptx');
  const viewerUrl = isPPT 
    ? `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(resource.url)}` 
    : resource.url; // Use native browser PDF viewer for PDFs

  return (
    <div className="flex flex-col h-screen bg-surface-100 dark:bg-surface-900">
      <div className="flex items-center justify-between px-6 py-4 bg-white dark:bg-surface-800 border-b border-surface-200 dark:border-surface-700 shadow-sm z-10">
        <div>
          <h1 className="font-display font-semibold text-surface-900 dark:text-white">{resource.fileName}</h1>
          <p className="text-xs text-surface-500">
            {resource.isViewOnly ? "View-Only Mode" : "Document Viewer"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {resource.isDownloadable && (
            <Button variant="primary" size="sm" onClick={() => {
              const link = document.createElement("a");
              link.href = resource.url;
              link.download = resource.fileName;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}>
              Download
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={() => router.back()}>Close</Button>
        </div>
      </div>
      
      {/* Viewer Container */}
      <div className="flex-1 relative overflow-hidden pointer-events-none select-none">
         {/* We re-enable pointer events for the iframe so users can scroll, but keep select-none */}
        <iframe 
          src={viewerUrl} 
          className="w-full h-full border-none pointer-events-auto"
          title={resource.fileName}
        />
        
        {/* Anti-copy overlay for PDFs if not PPT (since Office Viewer handles its own DRM) */}
        {!isPPT && resource.isViewOnly && (
          <div className="absolute inset-0 z-20 bg-transparent" onContextMenu={(e) => e.preventDefault()} />
        )}
      </div>
    </div>
  );
}

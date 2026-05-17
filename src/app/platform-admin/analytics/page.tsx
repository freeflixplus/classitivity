"use client";
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui";
import { platformAdmin } from "@/lib/api";

interface AnalyticsData {
  monthlyActiveUsers: number;
  resourceViews: number;
  downloads: number;
  avgSession: string;
  topSubjects: { name: string; views: number; pct: number }[];
  resourceTypeBreakdown: { type: string; count: number; pct: number }[];
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const response = await platformAdmin.getAnalytics();
        setData(response);
      } catch (err) {
        console.error("Failed to load analytics data", err);
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-surface-900 dark:text-white">Analytics</h1>
        <p className="text-surface-500 dark:text-surface-400 text-sm mt-1">Platform-wide usage, revenue, and content engagement metrics.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : data ? (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Monthly Active Users", value: data.monthlyActiveUsers.toLocaleString() },
              { label: "Resource Views", value: data.resourceViews.toLocaleString() },
              { label: "Downloads", value: data.downloads.toLocaleString() },
              { label: "Avg Session", value: data.avgSession },
            ].map((s) => (
              <Card key={s.label} padding="sm">
                <p className="text-xs text-surface-500 font-medium">{s.label}</p>
                <p className="font-display text-2xl font-bold text-surface-900 dark:text-white mt-1">{s.value}</p>
              </Card>
            ))}
          </div>
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <h3 className="font-semibold text-surface-900 dark:text-white mb-4">Top Subjects</h3>
              <div className="space-y-3">
                {data.topSubjects.map((s) => (
                  <div key={s.name}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-surface-700 dark:text-surface-300">{s.name}</span>
                      <span className="text-sm text-surface-500">{s.views.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-surface-100 dark:bg-surface-700 rounded-full h-2">
                      <div className="bg-brand-500 h-2 rounded-full" style={{ width: `${s.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
            <Card>
              <h3 className="font-semibold text-surface-900 dark:text-white mb-4">Resource Type Breakdown</h3>
              <div className="space-y-4">
                {data.resourceTypeBreakdown.map((r) => (
                  <div key={r.type}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-surface-700 dark:text-surface-300">{r.type}</span>
                      <span className="text-sm text-surface-500">{r.count.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-surface-100 dark:bg-surface-700 rounded-full h-2">
                      <div className="bg-brand-400 h-2 rounded-full" style={{ width: `${r.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </>
      ) : (
        <div className="text-center py-12 text-surface-500">Failed to load analytics data.</div>
      )}
    </div>
  );
}

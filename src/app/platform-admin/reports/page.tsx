"use client";
import React, { useEffect, useState } from "react";
import { Card, Badge } from "@/components/ui";
import { platformAdmin } from "@/lib/api";

export default function ReportsPage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const data = await platformAdmin.getAnalytics();
        setAnalytics(data);
      } catch (err) {
        console.error("Failed to load analytics", err);
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-surface-900 dark:text-white">Reports</h1>
        <p className="text-surface-500 dark:text-surface-400 text-sm mt-1">Platform usage, engagement metrics, and content performance.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {/* Metric cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Monthly Active Users", value: analytics?.monthlyActiveUsers || 0, icon: "👥" },
              { label: "Resource Views", value: analytics?.resourceViews || 0, icon: "👁️" },
              { label: "Downloads", value: analytics?.downloads || 0, icon: "📥" },
              { label: "Avg. Session", value: analytics?.avgSession || "0m", icon: "⏱️" },
            ].map((m) => (
              <Card key={m.label} padding="sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-surface-500 font-medium">{m.label}</p>
                    <p className="font-display text-2xl font-bold text-surface-900 dark:text-white mt-1">{m.value}</p>
                  </div>
                  <span className="text-2xl">{m.icon}</span>
                </div>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top subjects */}
            <Card>
              <h3 className="text-lg font-bold text-surface-900 dark:text-white font-display mb-4">Top Subjects</h3>
              {analytics?.topSubjects?.length > 0 ? (
                <div className="space-y-4">
                  {analytics.topSubjects.map((s: any) => (
                    <div key={s.name}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-surface-700 dark:text-surface-300">{s.name}</span>
                        <span className="text-surface-500">{s.views} views</span>
                      </div>
                      <div className="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-2">
                        <div className="bg-brand-500 h-2 rounded-full" style={{ width: `${s.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-surface-400 py-4">No data yet — views will appear once students start accessing content.</p>
              )}
            </Card>

            {/* Resource type breakdown */}
            <Card>
              <h3 className="text-lg font-bold text-surface-900 dark:text-white font-display mb-4">Resource Types</h3>
              {analytics?.resourceTypeBreakdown?.length > 0 ? (
                <div className="space-y-4">
                  {analytics.resourceTypeBreakdown.map((r: any) => (
                    <div key={r.type}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-surface-700 dark:text-surface-300">{r.type}</span>
                        <span className="text-surface-500">{r.count} accessed</span>
                      </div>
                      <div className="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-2">
                        <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${r.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-surface-400 py-4">No resource access data recorded yet.</p>
              )}
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

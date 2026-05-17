"use client";
import React, { useEffect, useState } from "react";
import { Card, Badge } from "@/components/ui";
import { schoolAdmin } from "@/lib/api";

export default function SchoolAdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const res = await schoolAdmin.getDashboard();
        setData(res);
      } catch (err) {
        console.error("Failed to load school dashboard", err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-surface-900 dark:text-white">School Overview</h1>
        <p className="text-surface-500 dark:text-surface-400 text-sm mt-1">Manage your school's subscriptions, teachers, and billing.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Active Subscriptions", value: data?.stats.activeSubscriptions || 0, icon: "📚" },
              { label: "Total Teachers", value: data?.stats.totalTeachers || 0, icon: "👨‍🏫" },
              { label: "Resources Accessed", value: data?.stats.resourcesAccessed || 0, icon: "📄" },
              { label: "Next Renewal", value: data?.stats.nextRenewal || "-", icon: "📅" },
            ].map((stat) => (
              <Card key={stat.label} padding="sm">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-surface-500 dark:text-surface-400 font-medium">{stat.label}</p>
                  <span className="text-lg">{stat.icon}</span>
                </div>
                <p className="font-display text-2xl font-bold text-surface-900 dark:text-white">{stat.value}</p>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <h3 className="font-semibold text-surface-900 dark:text-white mb-4">Active Subscriptions</h3>
              <div className="space-y-3">
                {data?.activeSubscriptions?.map((sub: any) => (
                  <div key={sub.gradeLevel} className="flex items-center justify-between p-3 bg-surface-50 dark:bg-surface-800/50 rounded-xl border border-surface-100 dark:border-surface-700/50">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-brand-500 text-white flex items-center justify-center font-bold text-sm">
                        {sub.gradeLevel.substring(0, 2)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-surface-800 dark:text-surface-200">{sub.gradeLevel}</p>
                        <p className="text-xs text-surface-500 dark:text-surface-400">All subjects included</p>
                      </div>
                    </div>
                    <Badge variant="success">Active</Badge>
                  </div>
                ))}
                {(!data?.activeSubscriptions || data.activeSubscriptions.length === 0) && (
                  <p className="text-sm text-surface-500">No active subscriptions found.</p>
                )}
              </div>
            </Card>

            <Card>
              <h3 className="font-semibold text-surface-900 dark:text-white mb-4">Recent Teacher Activity</h3>
              <div className="space-y-3">
                {data?.recentActivity?.map((a: any, i: number) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-brand-50 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-xs uppercase">
                      {a.name.split(" ")[1]?.[0] || a.name[0]}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-surface-900 dark:text-white">{a.name}</p>
                      <p className="text-xs text-surface-500 dark:text-surface-400">{a.action}</p>
                    </div>
                    <span className="text-xs text-surface-400">
                      {new Date(a.time).toLocaleDateString()}
                    </span>
                  </div>
                ))}
                {(!data?.recentActivity || data.recentActivity.length === 0) && (
                  <p className="text-sm text-surface-500">No recent activity.</p>
                )}
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

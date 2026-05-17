"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Card, Badge, Button } from "@/components/ui";
import { platformAdmin } from "@/lib/api";

export default function EarningsOverviewPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const dashboard = await platformAdmin.getDashboard();
        setStats(dashboard.stats);
      } catch (err) {
        console.error("Failed to load earnings data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-surface-900 dark:text-white">Earnings Overview</h1>
          <p className="text-surface-500 dark:text-surface-400 text-sm mt-1">Revenue summary across all schools and payment gateways.</p>
        </div>
        <Link href="/platform-admin/earnings/transactions">
          <Button variant="secondary">View Transactions</Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {/* Revenue cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card padding="sm">
              <p className="text-xs text-surface-500 font-medium">Total Revenue</p>
              <p className="font-display text-2xl font-bold text-surface-900 dark:text-white mt-1">
                {formatCurrency(stats?.totalRevenue || 0)}
              </p>
              <p className="text-xs text-emerald-500 mt-0.5">All time</p>
            </Card>
            <Card padding="sm">
              <p className="text-xs text-surface-500 font-medium">Active Subscriptions</p>
              <p className="font-display text-2xl font-bold text-surface-900 dark:text-white mt-1">
                {stats?.activeSubscriptions || 0}
              </p>
              <p className="text-xs text-brand-500 mt-0.5">Currently active</p>
            </Card>
            <Card padding="sm">
              <p className="text-xs text-surface-500 font-medium">Total Schools</p>
              <p className="font-display text-2xl font-bold text-surface-900 dark:text-white mt-1">
                {stats?.totalSchools || 0}
              </p>
              <p className="text-xs text-surface-400 mt-0.5">Registered</p>
            </Card>
            <Card padding="sm">
              <p className="text-xs text-surface-500 font-medium">Total Users</p>
              <p className="font-display text-2xl font-bold text-surface-900 dark:text-white mt-1">
                {stats?.totalUsers || 0}
              </p>
              <p className="text-xs text-surface-400 mt-0.5">Platform-wide</p>
            </Card>
          </div>

          {/* Revenue by gateway */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <h3 className="text-lg font-bold text-surface-900 dark:text-white font-display mb-4">Revenue by Gateway</h3>
              <div className="space-y-4">
                {[
                  { gateway: "Paystack", region: "Nigeria", amount: formatCurrency((stats?.totalRevenue || 0) * 0.6), pct: 60, color: "bg-emerald-500" },
                  { gateway: "Stripe", region: "UK, US, AU", amount: formatCurrency((stats?.totalRevenue || 0) * 0.4), pct: 40, color: "bg-brand-500" },
                ].map((g) => (
                  <div key={g.gateway}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-surface-700 dark:text-surface-300 font-medium">{g.gateway} <span className="text-surface-400">({g.region})</span></span>
                      <span className="text-surface-900 dark:text-white font-semibold">{g.amount}</span>
                    </div>
                    <div className="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-2">
                      <div className={`${g.color} h-2 rounded-full transition-all`} style={{ width: `${g.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-bold text-surface-900 dark:text-white font-display mb-4">Subscription Breakdown</h3>
              <div className="space-y-3">
                {[
                  { plan: "Monthly", count: 12, color: "bg-blue-500" },
                  { plan: "Termly", count: 8, color: "bg-purple-500" },
                  { plan: "Annually", count: 5, color: "bg-emerald-500" },
                ].map((p) => (
                  <div key={p.plan} className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${p.color}`} />
                    <span className="text-sm text-surface-700 dark:text-surface-300 flex-1">{p.plan}</span>
                    <span className="text-sm font-semibold text-surface-900 dark:text-white">{p.count} schools</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

"use client";
import React, { useEffect, useState } from "react";
import { Card, Badge, Button } from "@/components/ui";
import { schoolAdmin } from "@/lib/api";

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSubs() {
      try {
        const data = await schoolAdmin.getSubscriptions();
        setSubscriptions(data);
      } catch (err) {
        console.error("Failed to load subscriptions", err);
      } finally {
        setLoading(false);
      }
    }
    loadSubs();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-surface-900 dark:text-white">Subscriptions</h1>
          <p className="text-surface-500 dark:text-surface-400 text-sm mt-1">Manage class-level subscriptions and billing cycles.</p>
        </div>
        <Button variant="primary" size="md">+ Add Subscription</Button>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {subscriptions.map((sub) => (
            <Card key={sub.id} hover padding="md">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-brand-500 text-white flex items-center justify-center font-display font-bold">
                  {sub.gradeLevel.substring(0, 3)}
                </div>
                <Badge variant={sub.status === "ACTIVE" ? "success" : "warning"}>{sub.status}</Badge>
              </div>
              <p className="font-semibold text-surface-900 dark:text-white mb-1">{sub.gradeLevel} - All Subjects</p>
              <div className="space-y-2 mt-3">
                <div className="flex justify-between text-sm">
                  <span className="text-surface-500 dark:text-surface-400">Billing</span>
                  <span className="text-surface-900 dark:text-white font-medium">{sub.billingCycle}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-surface-500 dark:text-surface-400">Expires</span>
                  <span className="text-surface-900 dark:text-white font-medium">
                    {sub.currentPeriodEnd ? new Date(sub.currentPeriodEnd).toLocaleDateString() : "-"}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 mt-4 pt-4 border-t border-surface-100 dark:border-surface-800">
                <Button variant="outline" size="sm" className="flex-1">Manage</Button>
                <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10">Cancel</Button>
              </div>
            </Card>
          ))}
          {subscriptions.length === 0 && (
            <div className="col-span-full py-12 text-center">
              <p className="text-surface-500">No active subscriptions found. Add a subscription to get started.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

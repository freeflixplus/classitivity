"use client";
import React, { useEffect, useState } from "react";
import { Card, Badge, Button } from "@/components/ui";
import { schoolAdmin } from "@/lib/api";

export default function BillingPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBilling() {
      try {
        const data = await schoolAdmin.getBillingHistory();
        setPayments(data);
      } catch (err) {
        console.error("Failed to load billing history", err);
      } finally {
        setLoading(false);
      }
    }
    loadBilling();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-surface-900 dark:text-white">Billing & Payments</h1>
          <p className="text-surface-500 dark:text-surface-400 text-sm mt-1">View your transaction history and manage payment methods.</p>
        </div>
        <Button variant="outline" size="md">Download All Receipts</Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card padding="none" className="overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800/50">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Date</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Description</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Amount</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Status</th>
                    <th className="px-5 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-200 dark:divide-surface-800">
                  {payments.map((p) => (
                    <tr key={p.id} className="hover:bg-surface-50 dark:hover:bg-surface-700/30 transition-colors">
                      <td className="px-5 py-4 text-sm font-medium text-surface-900 dark:text-white">
                        {new Date(p.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm text-surface-900 dark:text-white">
                          {p.subscription?.gradeLevel} Subscription ({p.subscription?.billingCycle})
                        </p>
                        <p className="text-xs text-surface-500 dark:text-surface-400">Ref: {p.gatewayRef || p.id}</p>
                      </td>
                      <td className="px-5 py-4 text-sm font-semibold text-surface-900 dark:text-white">
                        {p.currency} {(p.amount / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-5 py-4">
                        <Badge variant={p.status === "SUCCEEDED" ? "success" : p.status === "PENDING" ? "warning" : "danger"}>
                          {p.status}
                        </Badge>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button className="text-brand-500 hover:text-brand-600 font-medium text-sm transition-colors">Receipt</button>
                      </td>
                    </tr>
                  ))}
                  {payments.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-5 py-8 text-center text-sm text-surface-500 dark:text-surface-400">
                        No payment history found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <h3 className="font-semibold text-surface-900 dark:text-white mb-4">Payment Method</h3>
            <div className="p-4 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-6 bg-brand-500 rounded text-[10px] font-bold text-white flex items-center justify-center">VISA</div>
                <div>
                  <p className="text-sm font-medium text-surface-900 dark:text-white">•••• 4242</p>
                  <p className="text-xs text-surface-500">Expires 12/26</p>
                </div>
              </div>
              <button className="text-surface-400 hover:text-surface-600 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
              </button>
            </div>
            <Button variant="outline" className="w-full mt-4">Add Payment Method</Button>
          </Card>
        </div>
      </div>
    </div>
  );
}

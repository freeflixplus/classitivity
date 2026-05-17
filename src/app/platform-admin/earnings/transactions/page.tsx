"use client";
import React, { useEffect, useState } from "react";
import { Card, Badge } from "@/components/ui";
import { platformAdmin } from "@/lib/api";

export default function TransactionsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPayments() {
      try {
        const res = await platformAdmin.getPayments();
        setPayments(res.data || []);
      } catch (err) {
        console.error("Failed to load transactions", err);
      } finally {
        setLoading(false);
      }
    }
    loadPayments();
  }, []);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  };

  const formatAmount = (amount: number, currency: string = "USD") => {
    const symbols: Record<string, string> = { USD: "$", GBP: "£", NGN: "₦", AUD: "A$" };
    return `${symbols[currency] || currency + " "}${amount.toLocaleString()}`;
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-surface-900 dark:text-white">Transactions</h1>
        <p className="text-surface-500 dark:text-surface-400 text-sm mt-1">Full transaction history across all schools and payment gateways.</p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <select className="bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-surface-900 dark:text-white text-sm rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-brand-500 outline-none">
          <option>All Gateways</option>
          <option>Paystack</option>
          <option>Stripe</option>
        </select>
        <select className="bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-surface-900 dark:text-white text-sm rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-brand-500 outline-none">
          <option>All Status</option>
          <option>Succeeded</option>
          <option>Pending</option>
          <option>Failed</option>
        </select>
        <div className="flex-1" />
        <div className="relative">
          <input type="text" placeholder="Search transactions..." className="w-64 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-surface-900 dark:text-white text-sm rounded-xl pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-brand-500 outline-none" />
          <svg className="w-4 h-4 text-surface-400 absolute left-3.5 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
      </div>

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
                <th className="text-left px-5 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">School</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Amount</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Gateway</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-200 dark:divide-surface-800">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-surface-50 dark:hover:bg-surface-700/30 transition-colors">
                  <td className="px-5 py-4 text-sm text-surface-600 dark:text-surface-400">{formatDate(p.createdAt)}</td>
                  <td className="px-5 py-4 text-sm text-surface-900 dark:text-white font-medium">{p.school?.name || "—"}</td>
                  <td className="px-5 py-4 text-sm text-surface-900 dark:text-white font-semibold">{formatAmount(p.amount, p.currency)}</td>
                  <td className="px-5 py-4">
                    <Badge className="bg-surface-100 text-surface-600 dark:bg-surface-700 dark:text-surface-300 border-none">
                      {p.gateway || "—"}
                    </Badge>
                  </td>
                  <td className="px-5 py-4">
                    <Badge variant={p.status === "SUCCEEDED" ? "success" : p.status === "PENDING" ? "warning" : "danger"}>
                      {p.status?.toLowerCase()}
                    </Badge>
                  </td>
                </tr>
              ))}
              {payments.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-sm text-surface-500 dark:text-surface-400">
                    No transactions recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}

import React from "react";
import { Card, Badge } from "@/components/ui";

export default function PaymentsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-surface-900 dark:text-white">Payments</h1>
        <p className="text-surface-500 dark:text-surface-400 text-sm mt-1">Transaction history across all schools and regions.</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue", value: "$128.4k" },
          { label: "This Month", value: "$42.8k" },
          { label: "Successful", value: "2,847" },
          { label: "Failed", value: "23" },
        ].map((s) => (
          <Card key={s.label} padding="sm">
            <p className="text-xs text-surface-500 font-medium">{s.label}</p>
            <p className="font-display text-2xl font-bold text-surface-900 dark:text-white mt-1">{s.value}</p>
          </Card>
        ))}
      </div>
      <Card padding="none" className="overflow-hidden">
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
            {[
              { date: "May 8, 2026", school: "Lagos Model School", amount: "₦120,000", gateway: "Paystack", status: "succeeded" },
              { date: "May 7, 2026", school: "Kensington Academy", amount: "£249", gateway: "Stripe", status: "succeeded" },
              { date: "May 6, 2026", school: "PS 204 Brooklyn", amount: "$29", gateway: "Stripe", status: "succeeded" },
              { date: "May 5, 2026", school: "Greenfield Academy", amount: "₦18,000", gateway: "Paystack", status: "failed" },
            ].map((p, i) => (
              <tr key={i} className="hover:bg-surface-50 dark:hover:bg-surface-700/30 transition-colors">
                <td className="px-5 py-4 text-sm text-surface-600 dark:text-surface-400">{p.date}</td>
                <td className="px-5 py-4 text-sm text-surface-900 dark:text-white font-medium">{p.school}</td>
                <td className="px-5 py-4 text-sm text-surface-900 dark:text-white font-semibold">{p.amount}</td>
                <td className="px-5 py-4"><Badge className="bg-surface-100 text-surface-600 dark:bg-surface-700 dark:text-surface-300 border-none">{p.gateway}</Badge></td>
                <td className="px-5 py-4"><Badge variant={p.status === "succeeded" ? "success" : "danger"}>{p.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

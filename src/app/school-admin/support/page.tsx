import React from "react";
import { Card, Button, Input } from "@/components/ui";

export default function SupportPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-surface-900 dark:text-white">Support</h1>
        <p className="text-surface-500 dark:text-surface-400 text-sm mt-1">Get help with your account or report an issue.</p>
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="font-semibold text-surface-900 dark:text-white mb-4">Contact Support</h3>
          <form className="space-y-4">
            <Input label="Subject" placeholder="Brief description of your issue" />
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Message</label>
              <textarea 
                className="w-full rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 px-4 py-2.5 text-sm text-surface-900 dark:text-white placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all min-h-[120px]" 
                placeholder="Describe your issue in detail..." 
              />
            </div>
            <Button variant="primary" size="md">Send Message</Button>
          </form>
        </Card>
        <Card>
          <h3 className="font-semibold text-surface-900 dark:text-white mb-4">Quick Help</h3>
          <div className="space-y-3">
            {["How do I add a new teacher?", "How do I change my subscription?", "How do I download invoices?", "How does DRM protection work?"].map((q) => (
              <button key={q} className="w-full text-left p-3 rounded-xl bg-surface-50 dark:bg-surface-800/50 hover:bg-brand-50 dark:hover:bg-brand-500/10 text-sm font-medium text-surface-700 dark:text-surface-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                {q}
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

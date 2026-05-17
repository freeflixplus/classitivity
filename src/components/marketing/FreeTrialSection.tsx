"use client";
import React from "react";
import Link from "next/link";
import { Section, Button, Card } from "@/components/ui";

const trustSignals = [
  "Full platform access — no restrictions during trial",
  "No credit card required to start",
  "Your school set up and ready in under 5 minutes",
];

export function FreeTrialSection() {
  return (
    <Section className="bg-surface-50 dark:bg-surface-950">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-surface-900 dark:text-white tracking-tight mb-5 animate-fade-in-up">
          Try Classitivity Free for 3 Days
        </h2>
        <p className="text-lg text-surface-500 dark:text-surface-400 leading-relaxed mb-10 animate-fade-in-up stagger-1">
          No payment. No commitment. No risk. Register your school, explore the full platform, experience the teaching resources, attend a live training session, and browse the template library — all completely free for 3 days.
        </p>
        <Card padding="lg" className="max-w-md mx-auto mb-10 animate-fade-in-up stagger-2">
          <div className="space-y-4">
            {trustSignals.map((signal) => (
              <div key={signal} className="flex items-center gap-3 text-left">
                <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center shrink-0">
                  <svg className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                </div>
                <span className="text-sm font-medium text-surface-700 dark:text-surface-300">{signal}</span>
              </div>
            ))}
          </div>
        </Card>
        <div className="animate-fade-in-up stagger-3">
          <Link href="/register">
            <Button variant="primary" size="xl">
              Start Your Free Trial Now
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Button>
          </Link>
        </div>
      </div>
    </Section>
  );
}

"use client";
import React from "react";
import Link from "next/link";
import { Section, SectionHeader, Card, Button, Badge } from "@/components/ui";

const cycles = [
  { cycle: "Monthly", desc: "Maximum flexibility. Pay month by month. Cancel anytime.", popular: false },
  { cycle: "Termly", desc: "Aligned to your school calendar. Pay per term.", popular: false },
  { cycle: "Annually", desc: "Best value. Full academic year. Save up to 25% vs monthly.", popular: true },
];

export function PricingSnapshotSection() {
  return (
    <Section className="bg-surface-50 dark:bg-surface-950">
      <SectionHeader
        badge="Simple Pricing"
        title="One Price Per Class. Everything Included."
        description="Lesson resources, weekly teacher training, and the full template library — all included in one simple class-level subscription. Choose your billing cycle and scale as your school grows."
      />
      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {cycles.map((plan, i) => (
          <Card key={plan.cycle} padding="lg" className={`text-center animate-fade-in-up relative ${plan.popular ? "border-brand-500 shadow-glow ring-1 ring-brand-500/20" : ""}`} style={{ animationDelay: `${i * 0.1}s` } as React.CSSProperties}>
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1">
                <Badge variant="brand" size="md">⭐ Most Popular</Badge>
              </div>
            )}
            <h3 className="font-display text-xl font-bold text-surface-900 dark:text-white mb-3">{plan.cycle}</h3>
            <p className="text-sm text-surface-500 dark:text-surface-400 leading-relaxed">{plan.desc}</p>
          </Card>
        ))}
      </div>
      <div className="text-center mt-10 space-y-3 animate-fade-in-up stagger-3">
        <Link href="/pricing">
          <Button variant="primary" size="lg">
            See Full Pricing by Curriculum Version
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </Button>
        </Link>
        <p className="text-sm text-surface-400 dark:text-surface-500">Start with a 3-day free trial. No payment details required.</p>
      </div>
    </Section>
  );
}

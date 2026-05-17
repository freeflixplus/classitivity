"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Button, Badge, Card } from "@/components/ui";

const plans = [
  { cycle: "Monthly", price: "$29", period: "/month per class", desc: "Rolling 30-day billing. Cancel anytime.", popular: false },
  { cycle: "Termly", price: "$69", period: "/term per class", desc: "Aligned to your academic calendar. Save 20%.", popular: true },
  { cycle: "Annually", price: "$199", period: "/year per class", desc: "Best value — full academic year. Save 43%.", popular: false },
];

const features = ["All subjects within the class", "Lesson plans (view-only)", "PowerPoint slides (embedded)", "Student notes (downloadable PDF)", "Objective questions (downloadable PDF)", "Theory questions (downloadable PDF)", "Scheme of Work access", "Multiple teacher accounts", "School Admin dashboard", "Priority email support"];

export function PricingCards() {
  const [annual, setAnnual] = useState(true);

  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <Card key={plan.cycle} padding="lg" className={`relative animate-fade-in-up ${plan.popular ? "border-brand-500 shadow-glow ring-1 ring-brand-500/20 scale-[1.03]" : ""}`} style={{ animationDelay: `${i * 0.1}s` } as React.CSSProperties}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2"><Badge variant="brand" size="md">Most Popular</Badge></div>
              )}
              <div className="text-center mb-8">
                <h3 className="font-display text-xl font-bold text-surface-900 mb-2">{plan.cycle}</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="font-display text-5xl font-bold gradient-text">{plan.price}</span>
                  <span className="text-surface-400 text-sm">{plan.period}</span>
                </div>
                <p className="text-sm text-surface-500 mt-2">{plan.desc}</p>
              </div>
              <ul className="space-y-3 mb-8">
                {features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-surface-600">
                    <svg className="w-5 h-5 text-brand-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/register">
                <Button variant={plan.popular ? "primary" : "outline"} size="lg" className="w-full">
                  Start Free Trial
                </Button>
              </Link>
            </Card>
          ))}
        </div>
        <p className="text-center text-sm text-surface-400 mt-8">All plans include a 3-day free trial. No credit card required.</p>
      </div>
    </section>
  );
}

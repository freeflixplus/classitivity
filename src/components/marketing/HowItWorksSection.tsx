"use client";
import React from "react";
import Link from "next/link";
import { Section, SectionHeader, Card, Button } from "@/components/ui";

const steps = [
  { step: "01", title: "Register Your School", desc: "Sign up online in minutes. Select your curriculum version, provide your school details, and start your free 3-day trial immediately. No payment details required." },
  { step: "02", title: "Explore the Platform", desc: "During your free trial your school has full access. Let your teachers explore the lesson resources, attend a training session, and browse the template library." },
  { step: "03", title: "Subscribe to Your Classes", desc: "Choose the class levels your school needs. Subscribe monthly, termly, or annually. Instant access confirmed the moment payment is made." },
  { step: "04", title: "Set Up Your Teachers", desc: "Your School Admin assigns teachers to their classes in minutes. Teachers receive login credentials by email and are ready to go immediately." },
  { step: "05", title: "Teach, Train, and Thrive", desc: "Teachers access their full resource bundles, join weekly training sessions, and download professional templates — all from one simple platform." },
];

export function HowItWorksSection() {
  return (
    <Section>
      <SectionHeader badge="How It Works" title="Up and Running in Minutes" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {steps.map((s, i) => (
          <Card key={s.step} hover className="text-center group animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` } as React.CSSProperties}>
            <div className="w-14 h-14 rounded-2xl bg-brand-50 dark:bg-brand-500/15 flex items-center justify-center mx-auto mb-4 group-hover:bg-brand-500 transition-colors duration-300">
              <span className="font-display text-xl font-bold text-brand-500 group-hover:text-white transition-colors duration-300">{s.step}</span>
            </div>
            <h3 className="font-semibold text-surface-900 dark:text-white mb-2">{s.title}</h3>
            <p className="text-sm text-surface-500 dark:text-surface-400">{s.desc}</p>
          </Card>
        ))}
      </div>
      <div className="text-center mt-12 animate-fade-in-up stagger-5">
        <Link href="/register">
          <Button variant="primary" size="lg">
            Start Your Free Trial — No Payment Required
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </Button>
        </Link>
      </div>
    </Section>
  );
}

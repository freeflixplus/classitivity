"use client";
import React, { useState } from "react";
import { Section, SectionHeader } from "@/components/ui";

const faqs = [
  { q: "What does 'per class' mean?", a: "A subscription unlocks all subjects within a single grade level (e.g. JSS2, Year 7, Grade 6). Every subject in that class comes included." },
  { q: "What's included in the 3-day free trial?", a: "Full access to all lesson resources — lesson plans, slides, notes, and assessment questions — for your selected grade levels. No credit card required." },
  { q: "Can I change my billing cycle?", a: "Yes. You can switch between monthly, termly, and annual billing at any time. Changes take effect at the start of your next billing period." },
  { q: "What payment methods do you accept?", a: "We accept card payments via Stripe (UK, US, AU) and Paystack (Nigeria). Local currency billing is available for all four regions." },
  { q: "Can teachers download all resources?", a: "Student notes, objective questions, and theory questions are downloadable as watermarked PDFs. Lesson plans and PowerPoint slides are view-only." },
  { q: "Is our content protected?", a: "Absolutely. We enforce enterprise-grade DRM at the server level. Raw file URLs are never exposed to the client, and all downloadable PDFs are watermarked." },
];

export function PricingFAQ() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <Section className="bg-surface-50">
      <SectionHeader badge="FAQ" title="Frequently asked questions" />
      <div className="max-w-3xl mx-auto space-y-3">
        {faqs.map((faq, i) => (
          <div key={i} className="bg-white rounded-2xl border border-surface-200/60 overflow-hidden transition-all">
            <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between px-6 py-5 text-left">
              <span className="text-sm font-semibold text-surface-800">{faq.q}</span>
              <svg className={`w-5 h-5 text-surface-400 transition-transform duration-200 ${open === i ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            <div className={`transition-all duration-300 ${open === i ? "max-h-40 opacity-100" : "max-h-0 opacity-0"} overflow-hidden`}>
              <p className="px-6 pb-5 text-sm text-surface-500 leading-relaxed">{faq.a}</p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

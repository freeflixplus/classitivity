"use client";
import React from "react";
import { Section, SectionHeader, Card } from "@/components/ui";

const testimonials = [
  {
    name: "Headteacher",
    role: "Lagos Private School, Nigeria",
    quote: "The lesson resources alone would have been worth the subscription. But the weekly teacher training has genuinely changed how our staff approach their classrooms. It is the most useful professional development our teachers have ever received.",
    avatar: "HT",
  },
  {
    name: "Year 6 Teacher",
    role: "International British School, Dubai",
    quote: "I used to spend my entire Sunday evening preparing for the week. Now I spend thirty minutes reviewing what Classitivity has already prepared. And the report sheet templates have saved our admin team days of work every term.",
    avatar: "Y6",
  },
  {
    name: "School Principal",
    role: "Secondary School, Abuja",
    quote: "The quality of the content is outstanding. The theory questions are excellent for exam preparation and the weekly training sessions keep our teachers sharp and motivated all year long.",
    avatar: "SP",
  },
];

export function TestimonialsSection() {
  return (
    <Section className="bg-white dark:bg-surface-900">
      <SectionHeader badge="Testimonials" title="What Teachers and Schools Are Saying" />
      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <Card key={t.avatar} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` } as React.CSSProperties}>
            <div className="mb-4">
              <svg className="w-8 h-8 text-brand-200 dark:text-brand-500/30" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151C7.563 6.068 6 8.789 6 11h4v10H0z" /></svg>
            </div>
            <p className="text-sm text-surface-600 dark:text-surface-400 leading-relaxed mb-5">{t.quote}</p>
            <div className="flex items-center gap-3 border-t border-surface-100 dark:border-surface-800 pt-4">
              <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-500/20 flex items-center justify-center text-sm font-semibold text-brand-600 dark:text-brand-300">{t.avatar}</div>
              <div><p className="text-sm font-semibold text-surface-800 dark:text-white">{t.name}</p><p className="text-xs text-surface-400 dark:text-surface-500">{t.role}</p></div>
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
}

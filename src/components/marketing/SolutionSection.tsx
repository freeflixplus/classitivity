"use client";
import React from "react";
import { Section, SectionHeader, Card } from "@/components/ui";

const pillars = [
  {
    icon: "📚",
    title: "Complete Lesson Resources",
    subtitle: "Everything Teachers Need for Every Lesson",
    description: "A full curriculum-aligned resource bundle for every class, every subject, and every lesson of the academic year. Lesson plans, PowerPoint presentations, student notes, lesson objectives, objective questions, and theory questions — all structured, all ready, all waiting.",
    color: "from-brand-500 to-brand-600",
  },
  {
    icon: "🎓",
    title: "Weekly Teacher Training",
    subtitle: "Professional Development Built Into Your Subscription",
    description: "Every week, your teachers get access to a live online training session covering classroom management, assessment strategies, lesson delivery, student engagement, differentiation, and more. No extra cost. No separate booking. It is included in every Classitivity subscription.",
    color: "from-emerald-500 to-emerald-600",
  },
  {
    icon: "📋",
    title: "Professional School Templates",
    subtitle: "Ready-to-Use Templates for Every School Need",
    description: "A growing library of professionally designed school templates — student report sheets, attendance registers, lesson observation forms, parent communication letters, staff meeting agendas, school calendars, and more. Editable, branded, and ready to use.",
    color: "from-purple-500 to-purple-600",
  },
];

export function SolutionSection() {
  return (
    <Section id="solution" className="bg-white dark:bg-surface-900">
      <SectionHeader
        badge="The Complete Solution"
        title="One Subscription. Three Powerful Things Your School Gets."
        description="When your school subscribes to Classitivity, you are not just getting lesson resources. You are getting a complete school support system built around three pillars."
      />
      <div className="grid lg:grid-cols-3 gap-8">
        {pillars.map((pillar, i) => (
          <Card key={pillar.title} padding="none" hover className="group animate-fade-in-up overflow-hidden" style={{ animationDelay: `${i * 0.15}s` } as React.CSSProperties}>
            <div className={`bg-gradient-to-br ${pillar.color} p-6 text-white`}>
              <span className="text-3xl block mb-3">{pillar.icon}</span>
              <h3 className="font-display text-xl font-bold mb-1">{pillar.title}</h3>
              <p className="text-sm text-white/80 font-medium">{pillar.subtitle}</p>
            </div>
            <div className="p-6">
              <p className="text-sm text-surface-600 dark:text-surface-400 leading-relaxed">{pillar.description}</p>
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
}

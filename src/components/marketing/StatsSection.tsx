"use client";
import React from "react";
import { Section } from "@/components/ui";

const stats = [
  { icon: "📚", value: "4", label: "Curriculum Versions" },
  { icon: "🌍", value: "4", label: "Global Markets" },
  { icon: "🎓", value: "Weekly", label: "Teacher Training Included" },
  { icon: "📋", value: "Full", label: "Template Library Included" },
];

export function StatsSection() {
  return (
    <Section className="bg-white dark:bg-surface-900 !py-12">
      <p className="text-center text-sm font-semibold uppercase tracking-wider text-surface-400 dark:text-surface-500 mb-8 animate-fade-in">Trusted by Schools Across the World</p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <div key={stat.label} className="text-center animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
            <span className="text-2xl mb-2 block">{stat.icon}</span>
            <p className="font-display text-3xl font-bold gradient-text">{stat.value}</p>
            <p className="text-sm text-surface-500 dark:text-surface-400 mt-1 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

"use client";

import React, { useState } from "react";
import { Section, SectionHeader, Badge } from "@/components/ui";
import { allCurriculums, type CurriculumConfig } from "@/config/curriculum";

export function CurriculumSection() {
  const [active, setActive] = useState<CurriculumConfig>(allCurriculums[0]);

  return (
    <Section id="curriculum" className="bg-surface-50 dark:bg-surface-950">
      <SectionHeader
        badge="4 Curriculum Regions"
        title="One platform, every curriculum"
        description="Region-specific grade structures, subjects, terms, and payment providers."
      />
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {allCurriculums.map((c) => (
          <button key={c.code} onClick={() => setActive(c)}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
              active.code === c.code
                ? "bg-brand-500 text-white shadow-glow"
                : "bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400 hover:bg-brand-50 dark:hover:bg-brand-500/15 hover:text-brand-600 dark:hover:text-brand-300"
            }`}>
            <span className="mr-2">{c.flag}</span>{c.shortLabel}
          </button>
        ))}
      </div>
      <div className="max-w-4xl mx-auto animate-scale-in" key={active.code}>
        <div className="bg-white dark:bg-surface-900 rounded-3xl border border-surface-200/60 dark:border-surface-800 shadow-card overflow-hidden">
          <div className="bg-gradient-to-r from-brand-500 to-brand-600 px-8 py-6 text-white">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-brand-100 text-sm font-medium uppercase tracking-wider mb-1">{active.code} Curriculum</p>
                <h3 className="text-2xl font-display font-bold">{active.label}</h3>
              </div>
              <div className="flex gap-2">
                <Badge className="bg-white/20 text-white border-none">{active.currency.primary}</Badge>
                <Badge className="bg-white/20 text-white border-none">{active.paymentProvider === "stripe" ? "Stripe" : "Paystack"}</Badge>
              </div>
            </div>
          </div>
          <div className="p-8">
            <p className="text-xs font-semibold uppercase tracking-wider text-surface-400 dark:text-surface-500 mb-4">Grade Structure</p>
            <div className="space-y-4">
              {active.gradeGroups.map((group) => (
                <div key={group.label}>
                  <p className="text-sm font-semibold text-surface-700 dark:text-surface-300 mb-2">{group.label}</p>
                  <div className="flex flex-wrap gap-2">
                    {group.grades.map((grade) => (
                      <span key={grade} className="px-3 py-1.5 rounded-lg bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-xs font-medium text-surface-600 dark:text-surface-400 hover:border-brand-300 dark:hover:border-brand-500/30 hover:bg-brand-50 dark:hover:bg-brand-500/10 hover:text-brand-600 dark:hover:text-brand-300 transition-colors cursor-default">{grade}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-surface-100 dark:border-surface-800">
              <p className="text-xs font-semibold uppercase tracking-wider text-surface-400 dark:text-surface-500 mb-3">Key Examinations</p>
              <div className="flex flex-wrap gap-2">
                {active.examRefs.map((exam) => (<Badge key={exam} variant="brand" size="md">{exam}</Badge>))}
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-surface-100 dark:border-surface-800 grid grid-cols-3 gap-4">
              <div><p className="text-xs text-surface-400 dark:text-surface-500 mb-1">Term Model</p><p className="text-sm font-semibold text-surface-800 dark:text-white capitalize">{active.termModel}</p></div>
              <div><p className="text-xs text-surface-400 dark:text-surface-500 mb-1">Region</p><p className="text-sm font-semibold text-surface-800 dark:text-white">{active.region}</p></div>
              <div><p className="text-xs text-surface-400 dark:text-surface-500 mb-1">Currencies</p><p className="text-sm font-semibold text-surface-800 dark:text-white">{[active.currency.primary, ...active.currency.alternatives].join(", ")}</p></div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

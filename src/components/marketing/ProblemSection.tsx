"use client";
import React from "react";
import { Section, SectionHeader } from "@/components/ui";

export function ProblemSection() {
  return (
    <Section className="bg-surface-50 dark:bg-surface-950">
      <SectionHeader
        title="Teaching is Hard Enough Without Spending Every Evening Preparing for It"
      />
      <div className="max-w-3xl mx-auto">
        <div className="space-y-5 text-base sm:text-lg text-surface-600 dark:text-surface-400 leading-relaxed">
          <p>
            Every Sunday evening, teachers across the world face the same reality. Lesson plans to write. Presentations to build. Notes to prepare. Questions to find. Hours of personal time spent on preparation before a single student walks through the door.
          </p>
          <p>
            And it does not stop there. Schools are constantly looking for ways to develop their teachers, improve classroom delivery, and run their operations more professionally — without the budget or time to make it happen consistently.
          </p>
          <p className="font-semibold text-surface-800 dark:text-surface-200">
            Classitivity was built to solve all of it. Not just the lesson preparation. Not just the resources. All of it — the teaching materials, the teacher development, and the professional tools your school needs to operate at its best.
          </p>
        </div>
      </div>
    </Section>
  );
}

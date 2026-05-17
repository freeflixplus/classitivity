"use client";

import React from "react";
import { Section, SectionHeader, Card } from "@/components/ui";

const teachingFeatures = [
  { icon: "M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2", title: "Full-Year Scheme of Work", description: "Every subject for every subscribed class comes with a complete year-long Scheme of Work mapping out every topic, every week, every term." },
  { icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253", title: "Lesson Plans", description: "Detailed, ready-to-use lesson plans for every lesson covering methodology, timing, classroom activities, and delivery guidance." },
  { icon: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z", title: "PowerPoint Presentations", description: "Professionally designed slides for every lesson, viewable directly from the platform on any device. No downloading, no formatting issues." },
  { icon: "M13 10V3L4 14h7v7l9-11h-7z", title: "Lesson Objectives", description: "Clear, measurable learning objectives for every lesson, aligned to curriculum standards. Teachers and students always know what success looks like." },
  { icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z", title: "Student Notes", description: "Clean, curriculum-aligned student notes for every lesson. Downloadable as PDF so teachers can distribute, print, or share digitally." },
  { icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01", title: "Objective Questions", description: "Ready-made multiple choice and short-answer questions for every lesson topic. Perfect for assessments, homework, and end-of-topic checks." },
  { icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z", title: "Theory Questions", description: "Structured, exam-style theory questions for every lesson. Ideal for homework assignments, class tests, and exam preparation." },
];

const trainingFeatures = [
  { title: "Live Online Sessions Every Week", description: "Every week of the school term, Classitivity hosts a live online teacher training session covering classroom management, assessment techniques, lesson pacing, and more." },
  { title: "Recorded and On-Demand", description: "Every training session is recorded and made available on the platform so teachers can watch at a time that suits them. A growing library of professional development." },
  { title: "Relevant and Practical", description: "Every session is designed by the Eduvation instructional design team to be immediately useful in the classroom — grounded in real teaching practice." },
  { title: "No Extra Cost", description: "Weekly teacher training is included in every Classitivity subscription at every level. It is not an add-on. It is not a premium feature. It is part of what Classitivity is." },
];

const templateFeatures = [
  "Student report sheets", "Attendance registers", "Lesson observation forms",
  "Parent communication letters", "Permission slip templates", "Staff meeting agendas",
  "School calendar templates", "Timetable templates", "Assessment tracking sheets",
  "Certificate templates", "School newsletter templates", "End-of-term report templates",
];

export function FeaturesSection() {
  return (
    <Section id="features" className="bg-white dark:bg-surface-900">
      <SectionHeader
        badge="Everything Included"
        title="Everything Inside a Classitivity Subscription"
        description="Here is exactly what your school gets from the moment you subscribe."
      />

      {/* Teaching Resources */}
      <div className="mb-20">
        <h3 className="font-display text-2xl font-bold text-surface-900 dark:text-white mb-2 text-center">📚 Teaching Resources</h3>
        <p className="text-surface-500 dark:text-surface-400 text-center mb-10 max-w-2xl mx-auto">Seven resource types per lesson, all professionally structured and curriculum-aligned.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {teachingFeatures.map((feature, i) => (
            <Card key={feature.title} hover className="group animate-fade-in-up relative overflow-hidden" style={{ animationDelay: `${i * 0.08}s` } as React.CSSProperties}>
              <div className="absolute inset-0 bg-gradient-to-br from-brand-500/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-500/15 text-brand-500 flex items-center justify-center mb-5 group-hover:bg-brand-500 group-hover:text-white transition-colors duration-300">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={feature.icon} /></svg>
                </div>
                <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-surface-500 dark:text-surface-400 leading-relaxed">{feature.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Weekly Teacher Training */}
      <div className="mb-20">
        <h3 className="font-display text-2xl font-bold text-surface-900 dark:text-white mb-2 text-center">🎓 Weekly Teacher Training</h3>
        <p className="text-surface-500 dark:text-surface-400 text-center mb-10 max-w-2xl mx-auto">Professional development that comes included with every subscription.</p>
        <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {trainingFeatures.map((f, i) => (
            <Card key={f.title} hover className="animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` } as React.CSSProperties}>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/15 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </div>
              <h4 className="font-semibold text-surface-900 dark:text-white mb-2">{f.title}</h4>
              <p className="text-sm text-surface-500 dark:text-surface-400 leading-relaxed">{f.description}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Professional School Templates */}
      <div>
        <h3 className="font-display text-2xl font-bold text-surface-900 dark:text-white mb-2 text-center">📋 Professional School Templates</h3>
        <p className="text-surface-500 dark:text-surface-400 text-center mb-10 max-w-2xl mx-auto">A growing library of ready-to-use, professionally designed school documents.</p>
        <div className="max-w-3xl mx-auto">
          <Card padding="lg">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {templateFeatures.map((t) => (
                <div key={t} className="flex items-center gap-2.5 text-sm text-surface-600 dark:text-surface-400">
                  <svg className="w-4 h-4 text-purple-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  {t}
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm text-surface-500 dark:text-surface-400 border-t border-surface-100 dark:border-surface-800 pt-4">
              New templates are added regularly based on feedback from schools. All templates are editable, branded, and available to download immediately.
            </p>
          </Card>
        </div>
      </div>
    </Section>
  );
}

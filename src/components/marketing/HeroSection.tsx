"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 hero-gradient-light" />
      <div className="absolute inset-0 dot-pattern" />
      <div className="absolute top-20 right-10 w-72 h-72 bg-brand-300/15 dark:bg-brand-500/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-brand-500/10 dark:bg-brand-500/5 rounded-full blur-3xl animate-float stagger-3" />
      <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-brand-200/20 dark:bg-brand-400/10 rounded-full blur-2xl animate-pulse-soft" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-brand-50 dark:bg-brand-500/15 border border-brand-200 dark:border-brand-500/30 rounded-full px-4 py-1.5 text-sm font-medium text-brand-700 dark:text-brand-300 mb-8 animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse-soft" />
              Trusted by schools across the world
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-surface-900 dark:text-white tracking-tight leading-[1.08] animate-fade-in-up">
              Everything Your School Needs to{" "}
              <span className="gradient-text">Teach, Train, and Thrive.</span>
            </h1>

            <p className="mt-7 text-lg sm:text-xl text-surface-500 dark:text-surface-400 leading-relaxed max-w-xl mx-auto lg:mx-0 animate-fade-in-up stagger-2">
              Classitivity gives schools a complete teaching ecosystem — structured lesson resources for every class, every subject, and every week of the academic year, plus weekly teacher training and a full library of professional school templates.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up stagger-3">
              <Link href="/register">
                <Button variant="primary" size="xl">
                  Start Your 3-Day Free Trial
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </Button>
              </Link>
              <Link href="/how-it-works">
                <Button variant="outline" size="xl">See How It Works</Button>
              </Link>
            </div>

            <p className="mt-5 text-sm text-surface-400 dark:text-surface-500 animate-fade-in stagger-4">
              No payment required to start · Cancel anytime
            </p>
          </div>

          {/* Dashboard mockup */}
          <div className="relative animate-fade-in-up stagger-2">
            <div className="absolute -inset-8 bg-gradient-to-tr from-brand-500/10 via-brand-300/5 to-transparent rounded-3xl blur-2xl" />
            <div className="relative">
              <div className="absolute top-6 -right-4 w-full h-full bg-brand-100 dark:bg-brand-900/30 rounded-3xl transform rotate-3 opacity-60" />
              <div className="absolute top-3 -right-2 w-full h-full bg-brand-200 dark:bg-brand-800/20 rounded-3xl transform rotate-1.5 opacity-40" />
              <div className="relative bg-white dark:bg-surface-900 rounded-3xl shadow-xl border border-surface-200/50 dark:border-surface-700/50 overflow-hidden">
                <div className="bg-surface-50 dark:bg-surface-800 border-b border-surface-200 dark:border-surface-700 px-6 py-4 flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  </div>
                  <div className="flex-1 bg-surface-200 dark:bg-surface-700 rounded-lg h-7 flex items-center px-3">
                    <span className="text-xs text-surface-400 dark:text-surface-500">ng.classitivity.io/dashboard</span>
                  </div>
                </div>
                <div className="p-6 space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Image src="/icon.png" alt="" width={28} height={28} />
                      <div>
                        <p className="text-sm font-semibold text-surface-800 dark:text-white">Teacher Dashboard</p>
                        <p className="text-xs text-surface-400 dark:text-surface-500">Nigerian Curriculum · JSS2</p>
                      </div>
                    </div>
                    <span className="text-xs bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-full font-medium">Active</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { name: "Mathematics", lessons: 42, color: "bg-brand-500" },
                      { name: "English", lessons: 38, color: "bg-emerald-500" },
                      { name: "Basic Science", lessons: 35, color: "bg-amber-500" },
                      { name: "Social Studies", lessons: 30, color: "bg-purple-500" },
                    ].map((subj) => (
                      <div key={subj.name} className="p-3 rounded-xl bg-surface-50 dark:bg-surface-800 border border-surface-100 dark:border-surface-700 hover:border-brand-200 dark:hover:border-brand-500/30 transition-colors">
                        <div className={`w-8 h-8 ${subj.color} rounded-lg mb-2 flex items-center justify-center`}>
                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                        </div>
                        <p className="text-xs font-semibold text-surface-800 dark:text-white">{subj.name}</p>
                        <p className="text-[10px] text-surface-400 dark:text-surface-500">{subj.lessons} lessons</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 overflow-hidden">
                    {["Lesson Plan", "Slides", "Notes", "Training", "Templates"].map((r) => (
                      <span key={r} className="text-[10px] font-medium bg-brand-50 dark:bg-brand-500/15 text-brand-600 dark:text-brand-300 px-2.5 py-1 rounded-full whitespace-nowrap">{r}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

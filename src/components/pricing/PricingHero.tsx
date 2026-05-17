"use client";
import React from "react";

export function PricingHero() {
  return (
    <section className="relative pt-32 pb-16 overflow-hidden">
      <div className="absolute inset-0 hero-gradient-light" />
      <div className="absolute inset-0 dot-pattern" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <span className="inline-flex items-center gap-2 bg-brand-50 border border-brand-200 rounded-full px-4 py-1.5 text-sm font-medium text-brand-700 mb-6 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-brand-500" />
          Simple Pricing
        </span>
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-surface-900 tracking-tight animate-fade-in-up">
          One class, one subscription, <span className="gradient-text">all subjects</span>
        </h1>
        <p className="mt-5 text-lg text-surface-500 max-w-2xl mx-auto animate-fade-in-up stagger-1">
          Subscribe per grade level. Every subject within that class is unlocked — lesson plans, slides, notes, and assessments included.
        </p>
      </div>
    </section>
  );
}

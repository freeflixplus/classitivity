"use client";
import React from "react";
import Link from "next/link";
import { Section, Button } from "@/components/ui";

export function CTASection() {
  return (
    <Section className="relative overflow-hidden">
      <div className="absolute inset-0 hero-gradient rounded-3xl mx-4 sm:mx-6 lg:mx-8" />
      <div className="absolute inset-0 dot-pattern opacity-20 mx-4 sm:mx-6 lg:mx-8 rounded-3xl" />
      <div className="relative z-10 text-center py-10">
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-5">
          Give Your School Everything It Needs to Succeed
        </h2>
        <p className="text-lg text-brand-200 max-w-2xl mx-auto mb-10">
          Complete lesson resources. Weekly teacher training. Professional school templates. All in one subscription. Join schools worldwide who have made Classitivity the backbone of their teaching year.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register">
            <Button variant="secondary" size="xl" className="bg-white text-brand-600 hover:bg-brand-50">
              Get Started — It&apos;s Free for 3 Days
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Button>
          </Link>
          <Link href="/pricing">
            <Button variant="ghost" size="xl" className="text-white border-white/30 border hover:bg-white/10">
              View Pricing
            </Button>
          </Link>
        </div>
      </div>
    </Section>
  );
}

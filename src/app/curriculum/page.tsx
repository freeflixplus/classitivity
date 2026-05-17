import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Section, SectionHeader, Card, Button, Badge } from "@/components/ui";

export const metadata = {
  title: "Curriculum Versions — Classitivity",
  description: "Classitivity is available in four fully distinct curriculum versions: Nigerian, UK, US, and Australian. Each built to align precisely with national education standards.",
};

const versions = [
  {
    id: "ng", flag: "🇳🇬", code: "NG", headline: "Classitivity NG — Built for Nigerian Schools",
    subheadline: "From KG1 to SS3. Every Subject. Every Term. Every Lesson.",
    body: "The Nigerian version of Classitivity is fully aligned to the Nigerian national curriculum and covers the complete school journey from Kindergarten through to Senior Secondary School. Every lesson plan, scheme of work, student note, and assessment question is mapped to Nigerian curriculum standards and structured around the Nigerian three-term academic calendar.",
    grades: [
      { label: "Early Years", items: "KG1, KG2" },
      { label: "Primary School", items: "Primary 1 through Primary 6" },
      { label: "Junior Secondary", items: "JSS1, JSS2, JSS3" },
      { label: "Senior Secondary", items: "SSS1, SSS2, SSS3" },
    ],
    examPrep: "Theory questions and objective questions are structured to progressively prepare students for the BECE examination at JSS3 and the WAEC and NECO examinations at SSS3.",
    pricing: "From ₦20,000 per class per month",
    currency: "Nigerian Naira (NGN) — USD also accepted",
    cta: "Start Free Trial — Nigerian Curriculum",
    color: "from-emerald-500 to-emerald-600",
  },
  {
    id: "uk", flag: "🇬🇧", code: "UK", headline: "Classitivity UK — Built for British Curriculum Schools Worldwide",
    subheadline: "From Nursery to Year 13. Every Key Stage. Including A-Levels.",
    body: "The UK version of Classitivity is fully aligned to the British national curriculum and is available to schools in the United Kingdom and to international schools worldwide that follow the British curriculum. From Early Years Foundation Stage through to A-Level preparation.",
    grades: [
      { label: "Early Years Foundation Stage", items: "Nursery, Reception" },
      { label: "Key Stage 1", items: "Year 1, Year 2" },
      { label: "Key Stage 2", items: "Year 3, Year 4, Year 5, Year 6" },
      { label: "Key Stage 3", items: "Year 7, Year 8, Year 9" },
      { label: "Key Stage 4", items: "Year 10, Year 11 — GCSE preparation" },
      { label: "Key Stage 5", items: "Year 12, Year 13 — A-Level preparation" },
    ],
    examPrep: null,
    pricing: "From £20 per class per month",
    currency: "British Pounds Sterling (GBP) — EUR and USD also accepted",
    cta: "Start Free Trial — UK Curriculum",
    color: "from-brand-500 to-brand-600",
  },
  {
    id: "us", flag: "🇺🇸", code: "US", headline: "Classitivity US — Built for American Curriculum Schools",
    subheadline: "From Pre-K to Grade 12. Aligned to Common Core Standards.",
    body: "The US version of Classitivity is aligned to the American Common Core curriculum standards and covers the complete Pre-K to Grade 12 school journey. Built for schools across North America.",
    grades: [
      { label: "Early Childhood", items: "Pre-K, Kindergarten" },
      { label: "Elementary School", items: "Grade 1 through Grade 5" },
      { label: "Middle School", items: "Grade 6, Grade 7, Grade 8" },
      { label: "High School", items: "Grade 9, Grade 10, Grade 11, Grade 12" },
    ],
    examPrep: null,
    pricing: "From $30 per class per month",
    currency: "US Dollars (USD) — CAD also accepted",
    cta: "Start Free Trial — US Curriculum",
    color: "from-blue-500 to-blue-600",
  },
  {
    id: "au", flag: "🇦🇺", code: "AU", headline: "Classitivity AU — Built for Australian Curriculum Schools",
    subheadline: "From Pre-School to Year 12. Aligned to the Australian National Curriculum.",
    body: "The Australian version of Classitivity is fully aligned to the Australian national curriculum and covers the complete school journey from Pre-School through to Year 12. Built for schools across Australia and the wider Australasia region.",
    grades: [
      { label: "Early Childhood", items: "Pre-School, Foundation (Prep)" },
      { label: "Primary School", items: "Year 1 through Year 6" },
      { label: "Junior Secondary", items: "Year 7, Year 8, Year 9, Year 10" },
      { label: "Senior Secondary", items: "Year 11, Year 12 — VCE, HSC, and QCE framework support" },
    ],
    examPrep: null,
    pricing: "From A$40 per class per month",
    currency: "Australian Dollars (AUD) — NZD also accepted",
    cta: "Start Free Trial — Australian Curriculum",
    color: "from-amber-500 to-amber-600",
  },
];

export default function CurriculumPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          <div className="absolute inset-0 hero-gradient-light" />
          <div className="absolute inset-0 dot-pattern" />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <Image src="/icon.png" alt="" width={56} height={56} className="mx-auto mb-6 animate-float" />
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-surface-900 dark:text-white tracking-tight animate-fade-in-up">
              Your Curriculum. Your Market.{" "}
              <span className="gradient-text">Your Version of Classitivity.</span>
            </h1>
            <p className="mt-5 text-lg text-surface-500 dark:text-surface-400 max-w-2xl mx-auto animate-fade-in-up stagger-1">
              Classitivity is available in four fully distinct curriculum versions, each built to align precisely with national education standards. Every version delivers the same complete experience — lesson resources, weekly teacher training, and the full template library.
            </p>
          </div>
        </section>

        {/* Version Sections */}
        {versions.map((v, idx) => (
          <Section key={v.id} id={v.id} className={idx % 2 === 0 ? "bg-white dark:bg-surface-900" : "bg-surface-50 dark:bg-surface-950"}>
            <div className="max-w-4xl mx-auto">
              <div className={`bg-gradient-to-br ${v.color} rounded-2xl p-8 text-white mb-8`}>
                <span className="text-4xl mb-3 block">{v.flag}</span>
                <h2 className="font-display text-2xl sm:text-3xl font-bold mb-2">{v.headline}</h2>
                <p className="text-white/80 font-medium">{v.subheadline}</p>
              </div>

              <div className="space-y-6">
                <p className="text-base text-surface-600 dark:text-surface-400 leading-relaxed">{v.body}</p>

                <Card padding="lg">
                  <h3 className="font-semibold text-surface-900 dark:text-white mb-4">Grade Coverage:</h3>
                  <div className="space-y-3">
                    {v.grades.map((g) => (
                      <div key={g.label} className="flex gap-3">
                        <span className="text-sm font-semibold text-surface-700 dark:text-surface-300 w-48 shrink-0">{g.label}:</span>
                        <span className="text-sm text-surface-500 dark:text-surface-400">{g.items}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                {v.examPrep && (
                  <div className="bg-brand-50 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-500/30 rounded-2xl p-5">
                    <p className="text-sm text-brand-800 dark:text-brand-200 font-medium"><strong>Exam Preparation:</strong> {v.examPrep}</p>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-4">
                  <Badge variant="brand" size="md">{v.pricing}</Badge>
                  <span className="text-sm text-surface-400 dark:text-surface-500">Currency: {v.currency}</span>
                </div>

                <Link href="/register">
                  <Button variant="primary" size="lg">
                    {v.cta}
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </Button>
                </Link>
              </div>
            </div>
          </Section>
        ))}

        {/* What Every Version Includes */}
        <Section className="bg-white dark:bg-surface-900">
          <SectionHeader title="Same Standard. Every Version. No Exceptions." />
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { emoji: "📚", title: "Complete Lesson Resources", desc: "Full resource bundle for every lesson of the academic year" },
              { emoji: "🎓", title: "Weekly Teacher Training", desc: "Live and recorded professional development every week of term" },
              { emoji: "📋", title: "Professional Template Library", desc: "Full school document library, always growing" },
            ].map((pillar) => (
              <Card key={pillar.title} hover className="text-center">
                <span className="text-3xl block mb-3">{pillar.emoji}</span>
                <h3 className="font-semibold text-surface-900 dark:text-white mb-2">{pillar.title}</h3>
                <p className="text-sm text-surface-500 dark:text-surface-400">{pillar.desc}</p>
              </Card>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/register">
              <Button variant="primary" size="xl">Start Your Free Trial</Button>
            </Link>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}

import React from "react";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Section, SectionHeader, Card } from "@/components/ui";
import { CTASection } from "@/components/marketing/CTASection";

export const metadata = {
  title: "About — Classitivity",
  description: "We believe every teacher deserves to walk into every classroom completely prepared. Learn the story behind Classitivity and the Eduvation team.",
};

const values = [
  {
    icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
    title: "Teacher First",
    desc: "Everything on Classitivity is built with the teacher at the centre. Every resource, every training session, every template is designed to be practical, immediately useful, and genuinely relevant.",
  },
  {
    icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    title: "Quality Without Compromise",
    desc: "Every lesson plan, PowerPoint, question set, training session, and template goes through a rigorous development process. We would rather take longer to get it right than publish something that lets a teacher down.",
  },
  {
    icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    title: "Global Standards, Local Relevance",
    desc: "Children in Lagos deserve the same quality of teaching resources as children in London, Los Angeles, or Melbourne. Classitivity brings global quality standards to every market with locally relevant content.",
  },
  {
    icon: "M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z",
    title: "Complete, Not Partial",
    desc: "Resources alone are not enough. Training alone is not enough. Templates alone are not enough. Schools need all three working together. Classitivity is the only platform that brings all three together.",
  },
  {
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
    title: "Simple by Design",
    desc: "A platform that is complicated to use is a platform that does not get used. Classitivity is designed to be intuitive, fast, and frictionless — because teachers should spend energy on education, not software.",
  },
  {
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
    title: "Education is a Partnership",
    desc: "Every school that subscribes is a partner. Your feedback shapes our content. Your teachers' needs inform our training topics. Your challenges inspire new templates. Your success is what we measure ourselves by.",
  },
];

export default function AboutPage() {
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
              We Believe Every Teacher Deserves to Walk Into Every Classroom{" "}
              <span className="gradient-text">Completely Prepared</span>
            </h1>
            <p className="mt-5 text-lg text-surface-500 dark:text-surface-400 max-w-2xl mx-auto animate-fade-in-up stagger-1">
              Classitivity was built because great teaching should never be held back by a lack of time, resources, or support.
            </p>
          </div>
        </section>

        {/* Our Story */}
        <Section className="bg-white dark:bg-surface-900">
          <SectionHeader title="Why Classitivity Exists" />
          <div className="max-w-3xl mx-auto space-y-5 text-base text-surface-600 dark:text-surface-400 leading-relaxed">
            <p>
              Teaching is one of the most important and demanding professions in the world. Teachers shape the minds, the confidence, and the futures of every child that passes through their classroom. Yet every day, teachers across the world spend hours of their personal time doing things that have nothing to do with teaching — searching for resources, writing lesson plans, building presentations, piecing together assessments, and attending expensive external training that may or may not be relevant.
            </p>
            <p>
              And behind the scenes, school administrators are producing the same documents over and over — report sheets, letters, registers, forms — with no consistent templates, no professional designs, and no central resource to draw from.
            </p>
            <p className="font-semibold text-surface-800 dark:text-surface-200">
              We built Classitivity to solve all of it. Not just the lesson preparation. Not just the resources. The whole picture — the teaching materials teachers need every day, the professional development that keeps them growing every week, and the administrative tools that help schools run with the polish and efficiency they deserve.
            </p>
            <p>
              Classitivity is the platform we wished existed. We built it so every school, in every market, at every level, could have what only the most privileged and well-resourced schools previously had access to.
            </p>
          </div>
        </Section>

        {/* Eduvation Connection */}
        <Section className="bg-surface-50 dark:bg-surface-950">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-surface-900 dark:text-white mb-6 tracking-tight">
              Built by <span className="gradient-text">Eduvation</span>. Powered by Instructional Expertise.
            </h2>
            <div className="space-y-5 text-base text-surface-600 dark:text-surface-400 leading-relaxed text-left">
              <p>
                Classitivity is a product of Eduvation, an instructional design brand working at the intersection of education, content, and technology. Eduvation&apos;s work spans school education, corporate training, curriculum development, and learning design — bringing genuine educational expertise to everything Classitivity delivers.
              </p>
              <p>
                The weekly teacher training sessions that come with every Classitivity subscription are not outsourced or generic. They are designed and delivered by the Eduvation instructional design team — practitioners who understand how people learn, how teachers teach, and what makes the difference between a lesson that works and one that does not.
              </p>
              <p className="font-semibold text-surface-800 dark:text-surface-200">
                When your school subscribes to Classitivity, you are not just getting software. You are getting the accumulated knowledge, experience, and passion of a team that has dedicated itself to transforming the quality of education.
              </p>
            </div>
          </div>
        </Section>

        {/* Values */}
        <Section className="bg-white dark:bg-surface-900">
          <SectionHeader badge="Our Values" title="What We Stand For" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <Card key={v.title} hover className="text-center animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` } as React.CSSProperties}>
                <div className="w-14 h-14 bg-brand-50 dark:bg-brand-500/15 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={v.icon} /></svg>
                </div>
                <h3 className="font-semibold text-surface-900 dark:text-white mb-2">{v.title}</h3>
                <p className="text-sm text-surface-500 dark:text-surface-400 leading-relaxed">{v.desc}</p>
              </Card>
            ))}
          </div>
        </Section>

        {/* Closing CTA */}
        <Section className="relative overflow-hidden">
          <div className="absolute inset-0 hero-gradient rounded-3xl mx-4 sm:mx-6 lg:mx-8" />
          <div className="absolute inset-0 dot-pattern opacity-20 mx-4 sm:mx-6 lg:mx-8 rounded-3xl" />
          <div className="relative z-10 text-center py-10">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight mb-5">Come and See What We Have Built</h2>
            <p className="text-lg text-brand-200 max-w-xl mx-auto mb-8">We are proud of Classitivity. We think you will be too. Start your free trial and experience it for yourself.</p>
            <a href="/register" className="inline-flex items-center justify-center gap-3 px-8 py-4 text-lg font-semibold bg-white text-brand-600 rounded-2xl hover:bg-brand-50 transition-colors shadow-md">
              Start Your Free Trial
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </a>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}

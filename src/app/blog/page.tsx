import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Section, SectionHeader, Card, Badge } from "@/components/ui";

export const metadata = {
  title: "Blog — Classitivity",
  description: "Practical teaching advice, curriculum insights, professional development ideas, and education news for schools across the world.",
};

const categories = [
  "Teaching Strategies", "Lesson Planning", "Teacher Development", "Assessment and Exams",
  "School Leadership", "School Administration", "Curriculum Updates", "Eduvation Insights",
];

const posts = [
  {
    title: "Why Nigerian Teachers Are Spending 10+ Hours a Week on Lesson Preparation — And How to Change That",
    category: "Lesson Planning",
    readTime: "6 min read",
    excerpt: "The average Nigerian teacher spends over 10 hours a week on lesson preparation. Here is why that number is too high and what can be done about it.",
    date: "May 2026",
  },
  {
    title: "What a Great Lesson Plan Actually Looks Like in 2026",
    category: "Teaching Strategies",
    readTime: "8 min read",
    excerpt: "The anatomy of an effective lesson plan has evolved. We break down what today's best lesson plans include and why structure matters more than ever.",
    date: "May 2026",
  },
  {
    title: "The Difference Between Objective Questions and Theory Questions — And Why Your Students Need Both",
    category: "Assessment and Exams",
    readTime: "5 min read",
    excerpt: "Both question types serve different assessment purposes. Understanding when to use each is critical for effective student evaluation.",
    date: "May 2026",
  },
  {
    title: "How to Use a Scheme of Work to Transform Your School's Academic Year",
    category: "School Leadership",
    readTime: "7 min read",
    excerpt: "A well-structured Scheme of Work is the backbone of a successful academic year. Here is how to use one effectively.",
    date: "May 2026",
  },
  {
    title: "Why Weekly Teacher Training Is the Most Undervalued Investment a School Can Make",
    category: "Teacher Development",
    readTime: "6 min read",
    excerpt: "Regular, relevant professional development transforms teaching quality. We explain why weekly training beats annual workshops every time.",
    date: "May 2026",
  },
  {
    title: "The 10 School Templates Every Administrator Wishes They Had From Day One",
    category: "School Administration",
    readTime: "5 min read",
    excerpt: "From report sheets to parent letters, these are the templates that save school administrators hours every week.",
    date: "May 2026",
  },
  {
    title: "Five Things Every Headteacher Should Know Before Choosing a Teaching Resource Platform",
    category: "School Leadership",
    readTime: "7 min read",
    excerpt: "Not all resource platforms are created equal. Here are the five critical factors to evaluate before committing your school.",
    date: "May 2026",
  },
  {
    title: "How International British Curriculum Schools Maintain Teaching Quality Across Borders",
    category: "Curriculum Updates",
    readTime: "6 min read",
    excerpt: "British curriculum schools around the world face unique challenges in maintaining consistent teaching standards. Here is how the best ones succeed.",
    date: "May 2026",
  },
];

const categoryColors: Record<string, string> = {
  "Teaching Strategies": "brand",
  "Lesson Planning": "success",
  "Teacher Development": "warning",
  "Assessment and Exams": "danger",
  "School Leadership": "brand",
  "School Administration": "default",
  "Curriculum Updates": "success",
  "Eduvation Insights": "brand",
};

export default function BlogPage() {
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
              The Classitivity Blog
            </h1>
            <p className="mt-5 text-lg text-surface-500 dark:text-surface-400 max-w-2xl mx-auto animate-fade-in-up stagger-1">
              Ideas, insights, and inspiration for teachers and school leaders. Practical teaching advice, curriculum insights, professional development ideas, and education news.
            </p>
          </div>
        </section>

        {/* Categories */}
        <Section className="!py-8 bg-white dark:bg-surface-900">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <span key={cat} className="px-4 py-2 rounded-xl bg-surface-100 dark:bg-surface-800 text-sm font-medium text-surface-600 dark:text-surface-400 hover:bg-brand-50 dark:hover:bg-brand-500/15 hover:text-brand-600 dark:hover:text-brand-300 transition-colors cursor-pointer">
                {cat}
              </span>
            ))}
          </div>
        </Section>

        {/* Posts Grid */}
        <Section className="bg-white dark:bg-surface-900 !pt-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, i) => (
              <Card key={post.title} hover className="group animate-fade-in-up flex flex-col" style={{ animationDelay: `${i * 0.08}s` } as React.CSSProperties}>
                {/* Placeholder image area */}
                <div className="h-40 bg-gradient-to-br from-brand-100 to-brand-200 dark:from-brand-900/30 dark:to-brand-800/20 rounded-xl mb-4 flex items-center justify-center">
                  <svg className="w-12 h-12 text-brand-400/50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant={(categoryColors[post.category] || "default") as "brand" | "success" | "warning" | "danger" | "default"} size="sm">{post.category}</Badge>
                  <span className="text-xs text-surface-400">{post.readTime}</span>
                </div>
                <h3 className="font-semibold text-surface-900 dark:text-white mb-2 group-hover:text-brand-500 transition-colors leading-snug flex-1">
                  {post.title}
                </h3>
                <p className="text-sm text-surface-500 dark:text-surface-400 leading-relaxed mb-3">{post.excerpt}</p>
                <p className="text-xs text-surface-400">{post.date}</p>
              </Card>
            ))}
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}

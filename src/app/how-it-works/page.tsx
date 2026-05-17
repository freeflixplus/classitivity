import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Section, SectionHeader, Card, Button, Badge } from "@/components/ui";

export const metadata = {
  title: "How It Works — Classitivity",
  description: "Everything your school needs. Simpler than you think. Learn how Classitivity works for teachers, school admins, and your entire school.",
};

const gettingStartedSteps = [
  { step: "01", title: "Register Your School", desc: "Sign up entirely online. Enter your school name, country, curriculum version, and administrator details. No paperwork, no waiting lists, no sales calls required." },
  { step: "02", title: "Start Your Free Trial", desc: "Every new school receives 3 full days of complete platform access at no cost. No payment details required. Explore every feature before making any commitment." },
  { step: "03", title: "Choose Your Classes", desc: "Select the class levels your school wants to subscribe to. You can start with a single class and add more at any time. There is no minimum and no maximum." },
  { step: "04", title: "Choose Your Billing Cycle", desc: "Select monthly for flexibility, termly to align with your school calendar, or annually for the best possible value. Pricing varies by curriculum version." },
  { step: "05", title: "Instant Access on Payment", desc: "The moment your payment is confirmed your school is live on Classitivity. Your School Admin receives confirmation and full login credentials immediately." },
  { step: "06", title: "Set Up Your Teachers", desc: "Your School Admin adds teachers by name and email, assigns them to classes, and teachers receive their welcome email with login details. The whole setup takes minutes." },
];

const lessonBundle = [
  { emoji: "📋", name: "Lesson Plan", desc: "Full methodology, timing, and classroom activities", mode: "View on platform" },
  { emoji: "📊", name: "PowerPoint Presentation", desc: "Professionally designed slides for live classroom delivery", mode: "View & present from platform" },
  { emoji: "🎯", name: "Lesson Objectives", desc: "Clear, measurable outcomes aligned to curriculum standards", mode: "View on platform" },
  { emoji: "📝", name: "Student Notes", desc: "Clean, curriculum-aligned notes ready to share", mode: "Download as PDF" },
  { emoji: "✏️", name: "Objective Questions", desc: "Multiple choice and short-answer questions", mode: "Download as PDF" },
  { emoji: "📖", name: "Theory Questions", desc: "Structured exam-style questions for assessment", mode: "Download as PDF" },
];

const adminCapabilities = [
  "View all active subscriptions and expiry dates at a glance",
  "Add, edit, and deactivate teacher accounts instantly",
  "Assign teachers to specific classes",
  "Monitor which teachers are accessing resources and attending training",
  "View teacher training attendance and on-demand viewing records",
  "Download invoices and review full payment history",
  "Upgrade or add class subscriptions at any time",
  "Access and download any template in the library",
  "Contact Classitivity support via live chat or email directly from the dashboard",
];

const trainingTopics = [
  "How to write lesson objectives that actually drive learning",
  "Classroom management strategies that work at every level",
  "Using questioning techniques to deepen student understanding",
  "Designing assessments that prepare students for exams",
  "How to differentiate instruction in a mixed-ability classroom",
  "Giving feedback that motivates rather than discourages",
  "Managing time effectively in a 40-minute lesson",
  "How to use the Classitivity platform to its full potential",
  "Building a positive classroom culture from day one",
  "Strategies for teaching students with different learning styles",
];

const templateCategories = [
  {
    title: "Student Records and Reporting",
    items: ["Student report sheets — end of term and end of year formats", "Student assessment and progress tracking sheets", "Attendance registers — daily, weekly, and termly formats", "Student achievement certificates"],
  },
  {
    title: "Classroom and Teaching Tools",
    items: ["Lesson observation and feedback forms", "Classroom seating plan templates", "Student grouping and tracking sheets", "Reading record templates"],
  },
  {
    title: "School Administration",
    items: ["School calendar templates", "Class and school timetable templates", "Staff meeting agenda and minutes templates", "School newsletter templates"],
  },
  {
    title: "Parent and Community Communication",
    items: ["Parent communication letter templates", "Permission slip templates", "Parent-teacher meeting schedule templates", "End-of-term communication templates"],
  },
];

const devices = [
  { icon: "💻", label: "Desktop computers and laptops" },
  { icon: "📱", label: "Tablets and iPads" },
  { icon: "📲", label: "Smartphones" },
  { icon: "🖥️", label: "Interactive whiteboards and classroom screens" },
];

export default function HowItWorksPage() {
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
              Everything Your School Needs.{" "}
              <span className="gradient-text">Simpler Than You Think.</span>
            </h1>
            <p className="mt-5 text-lg text-surface-500 dark:text-surface-400 max-w-2xl mx-auto animate-fade-in-up stagger-1">
              Classitivity is designed to be intuitive, fast, and genuinely useful from the very first login. Here is exactly how it works — for your school, your teachers, and your admin team.
            </p>
          </div>
        </section>

        {/* Section 1 — Getting Started */}
        <Section className="bg-white dark:bg-surface-900">
          <SectionHeader badge="Getting Started" title="From Registration to Ready in Minutes" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {gettingStartedSteps.map((s, i) => (
              <Card key={s.step} hover className="group animate-fade-in-up" style={{ animationDelay: `${i * 0.08}s` } as React.CSSProperties}>
                <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-500/15 flex items-center justify-center mb-4 group-hover:bg-brand-500 transition-colors duration-300">
                  <span className="font-display text-lg font-bold text-brand-500 group-hover:text-white transition-colors duration-300">{s.step}</span>
                </div>
                <h3 className="font-semibold text-surface-900 dark:text-white mb-2">{s.title}</h3>
                <p className="text-sm text-surface-500 dark:text-surface-400 leading-relaxed">{s.desc}</p>
              </Card>
            ))}
          </div>
        </Section>

        {/* Section 2 — For the Teacher */}
        <Section className="bg-surface-50 dark:bg-surface-950">
          <SectionHeader badge="For Teachers" title="A Teacher's Experience on Classitivity" description="From the moment a teacher logs in, everything is organised, structured, and ready." />

          <div className="max-w-4xl mx-auto space-y-12">
            <Card padding="lg">
              <h3 className="font-display text-xl font-bold text-surface-900 dark:text-white mb-3">The Lesson Bundle</h3>
              <p className="text-sm text-surface-500 dark:text-surface-400 mb-6">Every lesson on Classitivity comes with a complete six-component resource bundle:</p>
              <div className="grid sm:grid-cols-2 gap-4">
                {lessonBundle.map((item) => (
                  <div key={item.name} className="flex gap-3 p-3 rounded-xl bg-surface-50 dark:bg-surface-800 border border-surface-100 dark:border-surface-700">
                    <span className="text-2xl">{item.emoji}</span>
                    <div>
                      <p className="text-sm font-semibold text-surface-800 dark:text-white">{item.name}</p>
                      <p className="text-xs text-surface-500 dark:text-surface-400">{item.desc}</p>
                      <Badge variant="brand" size="sm" className="mt-1">{item.mode}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card padding="lg">
              <h3 className="font-display text-xl font-bold text-surface-900 dark:text-white mb-3">Weekly Teacher Training Sessions</h3>
              <p className="text-sm text-surface-500 dark:text-surface-400 leading-relaxed">
                Every teacher at a subscribed school has access to the weekly live online training session. Sessions appear in the platform dashboard with joining instructions and are also recorded for on-demand viewing. Topics rotate weekly across the full spectrum of teaching practice.
              </p>
            </Card>

            <Card padding="lg">
              <h3 className="font-display text-xl font-bold text-surface-900 dark:text-white mb-3">The Template Library</h3>
              <p className="text-sm text-surface-500 dark:text-surface-400 leading-relaxed">
                Teachers and school admins can browse and download professionally designed school templates at any time. Report sheets, registers, parent letters, observation forms, certificates, calendars, timetables — all editable and ready to use.
              </p>
            </Card>
          </div>
        </Section>

        {/* Section 3 — For School Admin */}
        <Section className="bg-white dark:bg-surface-900">
          <SectionHeader badge="For School Admins" title="Your School. Your Control." />
          <div className="max-w-3xl mx-auto">
            <Card padding="lg">
              <h3 className="font-semibold text-surface-900 dark:text-white mb-4">What School Admins Can Do:</h3>
              <div className="space-y-3">
                {adminCapabilities.map((cap) => (
                  <div key={cap} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-brand-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    <span className="text-sm text-surface-600 dark:text-surface-400">{cap}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </Section>

        {/* Section 4 — Weekly Training Detail */}
        <Section className="bg-surface-50 dark:bg-surface-950">
          <SectionHeader badge="Teacher Training" title="Professional Teacher Development. Every Week. Included." />
          <div className="max-w-3xl mx-auto space-y-6">
            <p className="text-base text-surface-600 dark:text-surface-400 leading-relaxed">
              Every week during term time, Classitivity hosts a live online teacher training session open to every teacher at every subscribed school worldwide. Each session runs for approximately 45 to 60 minutes and is led by an experienced educator from the Eduvation team.
            </p>
            <Card padding="lg">
              <h4 className="font-semibold text-surface-900 dark:text-white mb-4">Sample Training Topics:</h4>
              <div className="grid sm:grid-cols-2 gap-2">
                {trainingTopics.map((topic) => (
                  <div key={topic} className="flex items-start gap-2 text-sm text-surface-600 dark:text-surface-400">
                    <svg className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    {topic}
                  </div>
                ))}
              </div>
            </Card>
            <div className="bg-brand-50 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-500/30 rounded-2xl p-6">
              <p className="text-sm text-brand-800 dark:text-brand-200 font-medium leading-relaxed">
                <strong>Why This Matters:</strong> Great resources in the hands of underdeveloped teachers will only go so far. Great resources combined with continuously improving teachers is where real educational transformation happens. That is why Classitivity does not separate teaching resources from teacher development.
              </p>
            </div>
          </div>
        </Section>

        {/* Section 5 — Template Library Detail */}
        <Section className="bg-white dark:bg-surface-900">
          <SectionHeader badge="Template Library" title="Professional Templates for Every Aspect of School Life" />
          <div className="max-w-4xl mx-auto">
            <div className="grid sm:grid-cols-2 gap-6">
              {templateCategories.map((cat) => (
                <Card key={cat.title} padding="lg">
                  <h4 className="font-semibold text-surface-900 dark:text-white mb-3">{cat.title}</h4>
                  <ul className="space-y-2">
                    {cat.items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-surface-600 dark:text-surface-400">
                        <svg className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </div>
        </Section>

        {/* Section 6 — Devices */}
        <Section className="bg-surface-50 dark:bg-surface-950">
          <SectionHeader title="Works on Every Device Your School Uses" description="Classitivity is fully browser-based. Nothing to install. Nothing to set up. Works on any device with an internet connection." />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {devices.map((d) => (
              <Card key={d.label} hover className="text-center">
                <span className="text-3xl block mb-3">{d.icon}</span>
                <p className="text-sm font-medium text-surface-700 dark:text-surface-300">{d.label}</p>
              </Card>
            ))}
          </div>
          <p className="text-center text-sm text-surface-400 dark:text-surface-500 mt-6">Compatible with Chrome, Firefox, Safari, and Edge. Works on Windows, Mac, iOS, and Android.</p>
        </Section>

        {/* Closing CTA */}
        <Section className="relative overflow-hidden">
          <div className="absolute inset-0 hero-gradient rounded-3xl mx-4 sm:mx-6 lg:mx-8" />
          <div className="absolute inset-0 dot-pattern opacity-20 mx-4 sm:mx-6 lg:mx-8 rounded-3xl" />
          <div className="relative z-10 text-center py-10">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight mb-5">Ready to See It for Yourself?</h2>
            <p className="text-lg text-brand-200 max-w-xl mx-auto mb-8">Start your school&apos;s free 3-day trial today. Full access from the very first minute. No payment required.</p>
            <Link href="/register">
              <Button variant="secondary" size="xl" className="bg-white text-brand-600 hover:bg-brand-50">
                Start Your Free Trial
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Button>
            </Link>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}

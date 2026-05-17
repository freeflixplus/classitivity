"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Section, SectionHeader, Card, Button, Badge } from "@/components/ui";

type CurrencyCode = "NGN" | "GBP" | "USD" | "AUD";

interface VersionPricing {
  code: string;
  flag: string;
  label: string;
  headline: string;
  subheadline: string;
  currency: string;
  symbol: string;
  monthly: string;
  termly: string;
  annually: string;
  effectiveMonthly: string;
  termlyEffective: string;
  savingsAnnual: string;
  note: string;
  ctaLabel: string;
}

const versionPricing: Record<CurrencyCode, VersionPricing> = {
  NGN: {
    code: "NG", flag: "🇳🇬", label: "Nigerian Naira", headline: "Nigerian Curriculum Pricing",
    subheadline: "All prices in Nigerian Naira (NGN). Per class level. All subjects, weekly training, and templates included.",
    currency: "NGN", symbol: "₦", monthly: "20,000", termly: "60,000", annually: "150,000",
    effectiveMonthly: "₦20,000", termlyEffective: "₦20,000", savingsAnnual: "₦90,000 per class",
    note: "A school subscribing to 10 classes on the annual plan saves ₦900,000 compared to paying monthly. USD payments accepted.",
    ctaLabel: "Start Free Trial — NG Version",
  },
  GBP: {
    code: "UK", flag: "🇬🇧", label: "British Pound Sterling", headline: "UK Curriculum Pricing",
    subheadline: "All prices in British Pounds Sterling (GBP). Per class level. All subjects, weekly training, and templates included.",
    currency: "GBP", symbol: "£", monthly: "20", termly: "60", annually: "160",
    effectiveMonthly: "£20", termlyEffective: "£20", savingsAnnual: "£80 per class",
    note: "A school subscribing to all 15 class levels on the annual plan pays just £2,400 for the entire year. EUR and USD payments also accepted.",
    ctaLabel: "Start Free Trial — UK Version",
  },
  USD: {
    code: "US", flag: "🇺🇸", label: "US Dollar", headline: "US Curriculum Pricing",
    subheadline: "All prices in US Dollars (USD). Per class level. All subjects, weekly training, and templates included.",
    currency: "USD", symbol: "$", monthly: "30", termly: "90", annually: "240",
    effectiveMonthly: "$30", termlyEffective: "$45", savingsAnnual: "$120 per class",
    note: "A school subscribing to all 13 grade levels on the annual plan pays $3,120 for the entire year. CAD payments also accepted.",
    ctaLabel: "Start Free Trial — US Version",
  },
  AUD: {
    code: "AU", flag: "🇦🇺", label: "Australian Dollar", headline: "Australian Curriculum Pricing",
    subheadline: "All prices in Australian Dollars (AUD). Per class level. All subjects, weekly training, and templates included.",
    currency: "AUD", symbol: "A$", monthly: "40", termly: "120", annually: "320",
    effectiveMonthly: "A$40", termlyEffective: "A$30", savingsAnnual: "A$160 per class",
    note: "A school subscribing to all 13 year levels on the annual plan pays A$4,160 for the entire year. NZD payments also accepted.",
    ctaLabel: "Start Free Trial — AU Version",
  },
};

const currencies: { code: CurrencyCode; flag: string; label: string }[] = [
  { code: "NGN", flag: "🇳🇬", label: "NGN — Nigerian Naira" },
  { code: "GBP", flag: "🇬🇧", label: "GBP — British Pound Sterling" },
  { code: "USD", flag: "🇺🇸", label: "USD — US Dollar" },
  { code: "AUD", flag: "🇦🇺", label: "AUD — Australian Dollar" },
];

const included = [
  "All subjects for the subscribed class",
  "Full lesson resource bundle for every lesson",
  "Weekly live and recorded teacher training",
  "Full professional school template library",
  "Unlimited teacher accounts for subscribed classes",
  "School Admin dashboard",
  "Live chat and email support",
];

const faqs = [
  { q: "What exactly is included in a class subscription?", a: "Every class subscription includes the complete lesson resource bundle for every subject in that class level, access to the weekly live and recorded teacher training sessions for all your teachers, and full access to the professional school template library. Everything. One price." },
  { q: "Is the weekly teacher training really included at no extra cost?", a: "Yes. Completely. Weekly teacher training is not an add-on or a premium feature. It is included in every Classitivity subscription at every level and in every curriculum version." },
  { q: "Is the template library included for all subscribers?", a: "Yes. Every subscribed school has full access to the complete and growing template library regardless of how many classes they subscribe to." },
  { q: "Can I subscribe to just one class?", a: "Absolutely. There is no minimum number of classes. Subscribe to one class and pay only for that class." },
  { q: "Can I add more classes after subscribing?", a: "Yes. Add additional class subscriptions at any time. New classes are billed from the date they are added." },
  { q: "What happens when my subscription expires?", a: "You will receive reminder emails at 30 days, 7 days, and 1 day before expiry. If not renewed, access is suspended. Your school account and settings are retained so you can resubscribe without losing your setup." },
  { q: "Can I switch billing cycles?", a: "Yes. You can change your billing cycle at the time of your next renewal." },
  { q: "Is there a discount for large schools?", a: "The annual billing cycle already offers the strongest per-class value. For very large subscriptions, please contact our team to discuss the best arrangement." },
  { q: "Are my payments secure?", a: "All payments are processed through our fully encrypted, secure payment gateway. We do not store any card details on our platform." },
  { q: "What currency will I be billed in?", a: "Your billing currency is determined by your curriculum version. Use the currency selector at the top of this page to view prices in your local currency." },
];

export default function PricingPage() {
  const [activeCurrency, setActiveCurrency] = useState<CurrencyCode>("NGN");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const p = versionPricing[activeCurrency];

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 hero-gradient-light" />
        <div className="absolute inset-0 dot-pattern" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="inline-flex items-center gap-2 bg-brand-50 dark:bg-brand-500/15 border border-brand-200 dark:border-brand-500/30 rounded-full px-4 py-1.5 text-sm font-medium text-brand-700 dark:text-brand-300 mb-6 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-brand-500" />
            Simple Pricing
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-surface-900 dark:text-white tracking-tight animate-fade-in-up">
            Simple, Transparent Pricing.{" "}
            <span className="gradient-text">Everything Included.</span>
          </h1>
          <p className="mt-5 text-lg text-surface-500 dark:text-surface-400 max-w-2xl mx-auto animate-fade-in-up stagger-1">
            One class subscription gives your school complete lesson resources for every subject, access to weekly teacher training for all your teachers, and the full professional template library. No hidden fees. No add-ons. No surprises.
          </p>
        </div>
      </section>

      {/* Currency Selector */}
      <Section className="!pt-0 !pb-8">
        <div className="flex flex-wrap justify-center gap-3 mb-4">
          <p className="w-full text-center text-sm font-medium text-surface-500 dark:text-surface-400 mb-2">View Pricing In Your Currency</p>
          {currencies.map((c) => (
            <button
              key={c.code}
              onClick={() => setActiveCurrency(c.code)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeCurrency === c.code
                  ? "bg-brand-500 text-white shadow-glow"
                  : "bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400 hover:bg-brand-50 dark:hover:bg-brand-500/15"
              }`}
            >
              <span className="mr-2">{c.flag}</span>{c.label}
            </button>
          ))}
        </div>
      </Section>

      {/* Pricing Table */}
      <Section className="!pt-0">
        <div className="max-w-5xl mx-auto" key={activeCurrency}>
          <div className="text-center mb-10">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-surface-900 dark:text-white mb-2">{p.flag} {p.headline}</h2>
            <p className="text-surface-500 dark:text-surface-400">{p.subheadline}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {[
              { cycle: "Monthly", price: `${p.symbol}${p.monthly}`, period: "/month per class", desc: "Every month", effective: p.effectiveMonthly, saves: "—", popular: false },
              { cycle: "Termly", price: `${p.symbol}${p.termly}`, period: "/term per class", desc: "Every term", effective: p.termlyEffective, saves: "—", popular: false },
              { cycle: "Annually", price: `${p.symbol}${p.annually}`, period: "/year per class", desc: "Once per year", effective: p.effectiveMonthly, saves: p.savingsAnnual, popular: true },
            ].map((plan, i) => (
              <Card key={plan.cycle} padding="lg" className={`relative animate-scale-in text-center ${plan.popular ? "border-brand-500 shadow-glow ring-1 ring-brand-500/20 scale-[1.03]" : ""}`} style={{ animationDelay: `${i * 0.08}s` } as React.CSSProperties}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2"><Badge variant="brand" size="md">⭐ Best Value</Badge></div>
                )}
                <h3 className="font-display text-xl font-bold text-surface-900 dark:text-white mb-2">{plan.cycle}</h3>
                <div className="flex items-baseline justify-center gap-1 mb-1">
                  <span className="font-display text-4xl font-bold gradient-text">{plan.price}</span>
                </div>
                <p className="text-sm text-surface-400 mb-4">{plan.period}</p>
                {plan.popular && plan.saves !== "—" && (
                  <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-4">Save {plan.saves}</p>
                )}
                <ul className="space-y-2.5 mb-8 text-left">
                  {included.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-surface-600 dark:text-surface-400">
                      <svg className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/register">
                  <Button variant={plan.popular ? "primary" : "outline"} size="lg" className="w-full">
                    {p.ctaLabel}
                  </Button>
                </Link>
              </Card>
            ))}
          </div>

          <p className="text-center text-sm text-surface-400 dark:text-surface-500 max-w-2xl mx-auto">{p.note}</p>
        </div>
      </Section>

      {/* Value Section */}
      <Section className="bg-surface-50 dark:bg-surface-950">
        <SectionHeader title="Think About What This Replaces" />
        <div className="max-w-3xl mx-auto space-y-4 text-base text-surface-600 dark:text-surface-400 leading-relaxed">
          <p>Consider what schools currently spend — in money and in time — to get what Classitivity provides in a single subscription:</p>
          <ul className="space-y-3">
            {[
              "Lesson planning resources purchased from multiple providers",
              "PowerPoint templates bought or built from scratch by individual teachers",
              "Teacher training programmes booked and paid for separately — often costing hundreds per teacher per session",
              "School document templates designed by admin staff or purchased individually",
              "Hours of teacher time every week spent on preparation that could be spent on delivery",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-2 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <p className="font-semibold text-surface-800 dark:text-surface-200">
            Classitivity brings all of it together in one place, for one transparent price per class.
          </p>
        </div>
      </Section>

      {/* Free Trial */}
      <Section className="bg-white dark:bg-surface-900">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl font-bold text-surface-900 dark:text-white mb-5">Start With 3 Days Completely Free</h2>
          <p className="text-surface-500 dark:text-surface-400 mb-8">Every school that registers receives 3 full days of complete platform access at no cost. No payment details required.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
            {[
              "Full platform access — no features locked",
              "All lesson resources viewable",
              "Access to weekly training sessions",
              "Full template library accessible",
              "School Admin dashboard operational",
              "No credit card required",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-400">
                <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                {item}
              </div>
            ))}
          </div>
          <Link href="/register">
            <Button variant="primary" size="xl">Start Your Free Trial Now — No Payment Required</Button>
          </Link>
        </div>
      </Section>

      {/* FAQ */}
      <Section id="faq" className="bg-surface-50 dark:bg-surface-950">
        <SectionHeader badge="FAQ" title="Pricing Questions Answered" />
        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200/60 dark:border-surface-800 overflow-hidden transition-all">
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between px-6 py-5 text-left">
                <span className="text-sm font-semibold text-surface-800 dark:text-white">{faq.q}</span>
                <svg className={`w-5 h-5 text-surface-400 transition-transform duration-200 ${openFaq === i ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              <div className={`transition-all duration-300 ${openFaq === i ? "max-h-40 opacity-100" : "max-h-0 opacity-0"} overflow-hidden`}>
                <p className="px-6 pb-5 text-sm text-surface-500 dark:text-surface-400 leading-relaxed">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Closing CTA */}
      <Section className="relative overflow-hidden">
        <div className="absolute inset-0 hero-gradient rounded-3xl mx-4 sm:mx-6 lg:mx-8" />
        <div className="absolute inset-0 dot-pattern opacity-20 mx-4 sm:mx-6 lg:mx-8 rounded-3xl" />
        <div className="relative z-10 text-center py-10">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight mb-5">Your School Deserves a Complete Solution</h2>
          <p className="text-lg text-brand-200 max-w-xl mx-auto mb-8">Lesson resources, weekly teacher training, and professional school templates — all in one subscription.</p>
          <Link href="/register">
            <Button variant="secondary" size="xl" className="bg-white text-brand-600 hover:bg-brand-50">
              Get Started Free — No Payment Required
            </Button>
          </Link>
        </div>
      </Section>
    </>
  );
}

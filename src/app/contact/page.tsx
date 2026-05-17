"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Section, Card, Button, Input } from "@/components/ui";

const hearAboutOptions = [
  "Search Engine", "Social Media", "Word of Mouth", "Conference / Event", "Blog / Article", "Other",
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "", role: "", schoolName: "", country: "", curriculum: "", email: "", phone: "", message: "", hearAbout: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

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
              We Would Love to <span className="gradient-text">Hear from You</span>
            </h1>
            <p className="mt-5 text-lg text-surface-500 dark:text-surface-400 max-w-2xl mx-auto animate-fade-in-up stagger-1">
              Whether you have a question about the platform, need help choosing the right subscription, want to know more about the weekly training sessions, or just want to see a demo — our team is here and ready.
            </p>
          </div>
        </section>

        {/* Contact Options */}
        <Section className="!py-12 bg-white dark:bg-surface-900">
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card hover className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-brand-50 dark:bg-brand-500/15 flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
              </div>
              <h3 className="font-semibold text-surface-900 dark:text-white mb-2">Live Chat</h3>
              <p className="text-sm text-surface-500 dark:text-surface-400 mb-2">The fastest way to reach us. Click the chat icon at the bottom right of any page.</p>
              <p className="text-xs text-surface-400 dark:text-surface-500">🕐 Monday to Friday, 8am to 6pm (WAT / GMT)</p>
            </Card>

            <Card hover className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-500/15 flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <h3 className="font-semibold text-surface-900 dark:text-white mb-2">Email</h3>
              <p className="text-sm text-surface-500 dark:text-surface-400 mb-2">Send your question and we will respond within one business day.</p>
              <a href="mailto:hello@classitivity.com" className="text-sm font-semibold text-brand-500 hover:text-brand-600 transition-colors">hello@classitivity.com</a>
            </Card>

            <Card hover className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-purple-50 dark:bg-purple-500/15 flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </div>
              <h3 className="font-semibold text-surface-900 dark:text-white mb-2">Already Subscribed?</h3>
              <p className="text-sm text-surface-500 dark:text-surface-400">Log into your School Admin dashboard for the fastest response to account queries.</p>
            </Card>
          </div>
        </Section>

        {/* Contact Form */}
        <Section className="bg-surface-50 dark:bg-surface-950">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-display text-2xl font-bold text-surface-900 dark:text-white mb-8 text-center">Send Us a Message</h2>

            {submitted ? (
              <Card padding="lg" className="text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h3 className="font-display text-xl font-bold text-surface-900 dark:text-white mb-2">Message Sent!</h3>
                <p className="text-surface-500 dark:text-surface-400">Thank you for reaching out. Our team will get back to you within one business day.</p>
              </Card>
            ) : (
              <Card padding="lg">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <Input label="Your Name" name="name" value={formData.name} onChange={handleChange} required placeholder="Full name" />
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300">Your Role</label>
                      <select name="role" value={formData.role} onChange={handleChange} className="w-full rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 px-4 py-2.5 text-sm text-surface-800 dark:text-surface-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all">
                        <option value="">Select role</option>
                        <option>School Owner</option>
                        <option>Headteacher</option>
                        <option>Teacher</option>
                        <option>School Administrator</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <Input label="School Name" name="schoolName" value={formData.schoolName} onChange={handleChange} placeholder="Your school" />
                    <Input label="Country" name="country" value={formData.country} onChange={handleChange} placeholder="Your country" />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300">Curriculum Version</label>
                      <select name="curriculum" value={formData.curriculum} onChange={handleChange} className="w-full rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 px-4 py-2.5 text-sm text-surface-800 dark:text-surface-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all">
                        <option value="">Select version</option>
                        <option>NG — Nigerian</option>
                        <option>UK — British</option>
                        <option>US — American</option>
                        <option>AU — Australian</option>
                        <option>Not Sure</option>
                      </select>
                    </div>
                    <Input label="Your Email" name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="email@school.com" />
                  </div>

                  <Input label="Phone Number (optional)" name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="+234..." />

                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300">Your Message</label>
                    <textarea name="message" value={formData.message} onChange={handleChange} required rows={5} placeholder="How can we help you?" className="w-full rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 px-4 py-2.5 text-sm text-surface-800 dark:text-surface-200 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all resize-none" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300">How did you hear about Classitivity? (optional)</label>
                    <select name="hearAbout" value={formData.hearAbout} onChange={handleChange} className="w-full rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 px-4 py-2.5 text-sm text-surface-800 dark:text-surface-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all">
                      <option value="">Select an option</option>
                      {hearAboutOptions.map((opt) => (<option key={opt}>{opt}</option>))}
                    </select>
                  </div>

                  <Button type="submit" variant="primary" size="lg" className="w-full">
                    Send Message
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                  </Button>
                </form>
              </Card>
            )}
          </div>
        </Section>

        {/* FAQ Signpost */}
        <Section className="bg-white dark:bg-surface-900 !py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-display text-2xl font-bold text-surface-900 dark:text-white mb-6">Looking for a Quick Answer?</h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/pricing#faq" className="text-sm font-semibold text-brand-500 hover:text-brand-600 transition-colors">Read our Pricing FAQ →</Link>
              <Link href="/how-it-works" className="text-sm font-semibold text-brand-500 hover:text-brand-600 transition-colors">See How It Works →</Link>
              <Link href="/register" className="text-sm font-semibold text-brand-500 hover:text-brand-600 transition-colors">Start Your Free Trial →</Link>
            </div>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}

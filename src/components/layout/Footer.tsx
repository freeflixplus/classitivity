import React from "react";
import Image from "next/image";
import Link from "next/link";

const footerLinks = {
  Platform: [
    { label: "How It Works", href: "/how-it-works" },
    { label: "Curriculum", href: "/curriculum" },
    { label: "Pricing", href: "/pricing" },
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],
  Curricula: [
    { label: "Nigerian Curriculum", href: "/curriculum#ng" },
    { label: "UK Curriculum", href: "/curriculum#uk" },
    { label: "US Curriculum", href: "/curriculum#us" },
    { label: "Australian Curriculum", href: "/curriculum#au" },
  ],
  Support: [
    { label: "Contact Us", href: "/contact" },
    { label: "Pricing FAQ", href: "/pricing#faq" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-surface-900 dark:bg-surface-950 text-surface-400 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500/40 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-40 bg-brand-500/5 blur-3xl rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-5">
              <Image src="/logo-white.png" alt="Classitivity" width={180} height={40} className="h-9 w-auto" />
            </Link>
            <p className="text-surface-400 text-sm leading-relaxed max-w-sm">
              Everything your school needs to teach, train, and thrive. Complete lesson resources, weekly teacher training, and professional school templates — all in one platform.
            </p>
            <div className="flex gap-3 mt-6">
              {["twitter", "linkedin", "facebook", "instagram"].map((s) => (
                <a key={s} href="#" className="w-9 h-9 rounded-lg bg-surface-800 flex items-center justify-center hover:bg-brand-500 transition-colors duration-200" aria-label={s}>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4" /></svg>
                </a>
              ))}
            </div>
          </div>
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="font-semibold text-white text-sm mb-4 uppercase tracking-wider">{heading}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm hover:text-brand-300 transition-colors duration-200">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-surface-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-surface-500">© {new Date().getFullYear()} Classitivity. All rights reserved. A product of Eduvation.</p>
          <div className="flex gap-6 text-xs text-surface-500">
            <Link href="/privacy" className="hover:text-brand-300 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-brand-300 transition-colors">Terms</Link>
            <Link href="/cookies" className="hover:text-brand-300 transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

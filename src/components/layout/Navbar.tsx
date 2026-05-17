"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";

const navLinks = [
  { label: "How It Works", href: "/how-it-works" },
  { label: "Curriculum", href: "/curriculum" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "glass shadow-card py-3"
          : "bg-transparent py-5"
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <Image
            src="/icon.png"
            alt="Classitivity"
            width={40}
            height={40}
            className="transition-transform duration-300 group-hover:scale-110"
            priority
          />
          <span className="font-display text-xl font-bold tracking-tight text-brand-900 dark:text-white transition-colors duration-300">
            Classitivity
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-medium transition-colors duration-200 hover:text-brand-500 text-surface-600 dark:text-surface-300 dark:hover:text-brand-400"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA Buttons + Theme Switcher */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeSwitcher />
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Log In
            </Button>
          </Link>
          <Link href="/register">
            <Button variant="primary" size="sm">
              Start Free Trial
            </Button>
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          id="mobile-menu-toggle"
          className="md:hidden p-2 rounded-lg hover:bg-brand-50 dark:hover:bg-surface-800 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6 text-surface-700 dark:text-surface-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        className={cn(
          "md:hidden overflow-hidden transition-all duration-300",
          mobileOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="glass mx-4 mt-3 rounded-2xl p-4 space-y-1 border border-surface-200/40 dark:border-surface-700/40">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="block px-4 py-3 rounded-xl text-sm font-medium text-surface-700 dark:text-surface-300 hover:bg-brand-50 dark:hover:bg-surface-800 hover:text-brand-600 transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <hr className="border-surface-200 dark:border-surface-700 my-2" />
          <div className="px-4 py-2 flex items-center justify-between">
            <span className="text-sm text-surface-500">Theme</span>
            <ThemeSwitcher />
          </div>
          <hr className="border-surface-200 dark:border-surface-700 my-2" />
          <Link
            href="/login"
            className="block px-4 py-3 rounded-xl text-sm font-medium text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
            onClick={() => setMobileOpen(false)}
          >
            Log In
          </Link>
          <Link href="/register" onClick={() => setMobileOpen(false)}>
            <Button variant="primary" size="md" className="w-full mt-1">
              Start Free Trial
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

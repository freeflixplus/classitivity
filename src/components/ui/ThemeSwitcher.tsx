"use client";

import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "@/components/providers/ThemeProvider";

const themes = [
  {
    key: "light" as const,
    label: "Light",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  },
  {
    key: "dark" as const,
    label: "Dark",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
    ),
  },
  {
    key: "system" as const,
    label: "System",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
];

export function ThemeSwitcher({ variant = "default" }: { variant?: "default" | "compact" | "admin" }) {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const current = themes.find((t) => t.key === theme) || themes[2];

  const btnBase =
    variant === "admin"
      ? "p-2 rounded-xl bg-surface-800 hover:bg-surface-700 text-surface-400 hover:text-white border border-surface-700 transition-all duration-200"
      : "p-2 rounded-xl bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 text-surface-600 dark:text-surface-400 hover:text-brand-500 dark:hover:text-brand-300 border border-surface-200 dark:border-surface-700 transition-all duration-200";

  const dropBase =
    variant === "admin"
      ? "absolute right-0 top-full mt-2 w-40 bg-surface-800 border border-surface-700 rounded-2xl shadow-xl overflow-hidden z-50 animate-scale-in"
      : "absolute right-0 top-full mt-2 w-40 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-2xl shadow-xl overflow-hidden z-50 animate-scale-in";

  return (
    <div ref={ref} className="relative">
      <button
        id="theme-switcher-toggle"
        onClick={() => setOpen(!open)}
        className={btnBase}
        aria-label="Toggle theme"
      >
        {current.icon}
      </button>

      {open && (
        <div className={dropBase}>
          <div className="p-1.5">
            {themes.map((t) => (
              <button
                key={t.key}
                onClick={() => {
                  setTheme(t.key);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                  theme === t.key
                    ? variant === "admin"
                      ? "bg-brand-500/20 text-brand-300"
                      : "bg-brand-50 dark:bg-brand-500/20 text-brand-600 dark:text-brand-300"
                    : variant === "admin"
                    ? "text-surface-400 hover:bg-surface-700 hover:text-white"
                    : "text-surface-600 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-700"
                }`}
              >
                {t.icon}
                {t.label}
                {theme === t.key && (
                  <svg className="w-4 h-4 ml-auto text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

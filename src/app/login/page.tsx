"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button, Input } from "@/components/ui";
import { useAuth } from "@/components/providers/AuthProvider";

// ─── Error code → human-readable message ────────────────────────────────────

function parseAuthError(error: unknown): string {
  const msg = error instanceof Error ? error.message : String(error);

  if (msg.includes("USERNAME_NOT_FOUND")) return "No account found with that email address.";
  if (msg.includes("WRONG_PASSWORD")) return "Password is incorrect. Please try again.";
  if (msg.includes("Invalid credentials") || msg.includes("401") || msg.includes("Unauthorized")) {
    return "Invalid email or password. Please check and try again.";
  }

  return msg || "Login failed. Please try again.";
}

// ─── Shared form component ────────────────────────────────────────────────────

function LoginForm() {
  const { login, loading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password, "admin"); // Always 'admin' backend portal for Teachers & Admins
    } catch (err: unknown) {
      setError(parseAuthError(err));
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <p className="text-sm text-red-700 dark:text-red-400 font-medium">{error}</p>
          </div>
        </div>
      )}

      <Input
        id="email"
        label="Email address"
        type="email"
        placeholder="you@school.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Input
        id="password"
        label="Password"
        type="password"
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" className="rounded border-surface-300 focus:ring-2 text-brand-600" />
          <span className="text-surface-600 dark:text-surface-400">Remember me</span>
        </label>
        <Link
          href="/forgot-password"
          className="font-medium hover:underline text-brand-600 dark:text-brand-400"
        >
          Forgot password?
        </Link>
      </div>

      <button
        type="submit"
        disabled={loading || authLoading}
        className="w-full py-3 px-6 rounded-xl font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 disabled:cursor-not-allowed hover:opacity-90 active:scale-[0.98]"
      >
        {loading || authLoading ? (
          <>
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Signing in…
          </>
        ) : (
          <>
            Sign In
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </>
        )}
      </button>
    </form>
  );
}

// ─── Main Login Page ──────────────────────────────────────────────────────────

export default function LoginPage() {
  const current = {
    heroBg: "from-brand-600 to-brand-800",
    heroText: "Platform & School Administration",
    heroDesc: "Manage schools, upload teaching materials, track revenue, and grow your education business — all from one powerful dashboard.",
    features: [
      "Upload & price lesson materials",
      "Manage class subscriptions",
      "Track school earnings",
      "Multi-curriculum support (NG, UK, US, AU)",
    ],
  };

  return (
    <div className="min-h-screen flex bg-surface-50 dark:bg-surface-950">
      {/* Left — Branding panel */}
      <div
        className={`hidden lg:flex lg:w-1/2 relative bg-gradient-to-br ${current.heroBg} items-center justify-center p-12 transition-all duration-500`}
      >
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        <div className="absolute top-12 right-12 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-12 left-8 w-48 h-48 bg-white/10 rounded-full blur-2xl" />

        <div className="relative z-10 max-w-md text-center">
          <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-8 border border-white/30">
            <Image src="/icon.png" alt="Classitivity" width={48} height={48} />
          </div>
          <h2 className="font-display text-3xl font-bold text-white mb-4">{current.heroText}</h2>
          <p className="text-white/80 leading-relaxed mb-10">{current.heroDesc}</p>

          <ul className="space-y-3 text-left">
            {current.features.map((f) => (
              <li key={f} className="flex items-center gap-3 text-white/90">
                <div className="w-5 h-5 rounded-full bg-white/25 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm">{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right — Form panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Logo (mobile only) */}
          <Link href="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <Image src="/icon.png" alt="" width={32} height={32} />
            <span className="font-display text-xl font-bold text-brand-900 dark:text-white">Classitivity</span>
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="font-display text-2xl font-bold text-surface-900 dark:text-white">Welcome back</h1>
            <p className="text-surface-500 dark:text-surface-400 mt-2">Sign in to your account</p>
          </div>

          <LoginForm />

          {/* Footer */}
          <p className="mt-8 text-center text-sm text-surface-500 dark:text-surface-400">
            School not registered yet?{" "}
            <Link href="/register" className="font-semibold hover:underline text-brand-600 dark:text-brand-400">
              Start your free trial
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

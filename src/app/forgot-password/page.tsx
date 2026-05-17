"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button, Input } from "@/components/ui";
import { auth } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      await auth.forgotPassword(email);
      setSent(true);
    } catch (err: any) {
      setError(err.message || "Failed to send reset link.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <Image src="/icon.png" alt="" width={40} height={40} />
            <span className="font-display text-xl font-bold text-brand-900">Classitivity</span>
          </Link>
          <h1 className="font-display text-3xl font-bold text-surface-900 mb-2">Reset your password</h1>
          <p className="text-surface-500 text-sm">{sent ? "Check your inbox for a reset link." : "Enter your email and we'll send a reset link."}</p>
        </div>
        {sent ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center animate-scale-in">
            <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            </div>
            <p className="text-sm text-emerald-700 font-medium mb-1">Email sent!</p>
            <p className="text-xs text-emerald-600">The link expires in 1 hour.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input 
              id="reset-email" 
              label="Email address" 
              type="email" 
              placeholder="you@school.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>
        )}
        <p className="mt-8 text-center text-sm text-surface-500">
          <Link href="/login" className="text-brand-500 hover:text-brand-600 font-medium">← Back to sign in</Link>
        </p>
      </div>
    </div>
  );
}

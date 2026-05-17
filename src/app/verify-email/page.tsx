import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui";

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50 p-4">
      <div className="w-full max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-8">
          <Image src="/icon.png" alt="" width={40} height={40} />
          <span className="font-display text-xl font-bold text-brand-900">Classitivity</span>
        </Link>
        <div className="bg-white rounded-3xl border border-surface-200/60 shadow-card p-10 animate-scale-in">
          <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
          </div>
          <h1 className="font-display text-2xl font-bold text-surface-900 mb-2">Verify your email</h1>
          <p className="text-surface-500 text-sm mb-6">We&apos;ve sent a verification link to your email address. Click the link to activate your account.</p>
          <Button variant="secondary" size="md" className="w-full">Resend Verification Email</Button>
        </div>
        <p className="mt-6 text-sm text-surface-400">Link expires in 24 hours</p>
      </div>
    </div>
  );
}

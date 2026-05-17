"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Input } from "@/components/ui";
import { allCurriculums } from "@/config/curriculum";
import { auth } from "@/lib/api";
import { useAuth } from "@/components/providers/AuthProvider";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    schoolName: "",
    curriculumVersion: "",
    country: "",
    phone: "",
    adminName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    
    setLoading(true);
    setError("");
    try {
      const { confirmPassword, ...apiPayload } = formData;
      const res = await auth.register(apiPayload);
      // The API returns { user, accessToken, refreshToken }
      // Update global auth state to log the user in immediately
      localStorage.setItem('classitivity_access_token', res.accessToken);
      localStorage.setItem('classitivity_refresh_token', res.refreshToken);
      localStorage.setItem('classitivity_user', JSON.stringify(res.user));
      
      // We know they are a SCHOOL_ADMIN since they just registered
      router.push('/school-admin/dashboard');
    } catch (err: any) {
      setError(err.message || "Failed to register.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative hero-gradient items-center justify-center p-12">
        <div className="absolute inset-0 dot-pattern opacity-20" />
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-brand-400/15 rounded-full blur-3xl" />
        <div className="relative z-10 max-w-md text-center">
          <Image src="/icon.png" alt="" width={72} height={72} className="mx-auto mb-8 animate-float" />
          <h2 className="font-display text-3xl font-bold text-white mb-4">Start your 3-day free trial</h2>
          <p className="text-brand-200 leading-relaxed">No credit card required. Full access to all lesson resources for your selected curriculum.</p>
          <div className="mt-8 grid grid-cols-2 gap-3">
            {allCurriculums.map((c) => (
              <div key={c.code} className="bg-white/10 rounded-xl px-4 py-3 text-left">
                <p className="text-white text-sm font-semibold">{c.flag} {c.shortLabel}</p>
                <p className="text-brand-200 text-xs">{c.gradeGroups.reduce((a, g) => a + g.grades.length, 0)} grades</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link href="/" className="flex items-center gap-2 mb-10 lg:hidden">
            <Image src="/icon.png" alt="" width={32} height={32} />
            <span className="font-display text-xl font-bold text-brand-900">Classitivity</span>
          </Link>
          {/* Progress */}
          <div className="flex items-center gap-2 mb-8">
            {[1, 2].map((s) => (
              <React.Fragment key={s}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${step >= s ? "bg-brand-500 text-white" : "bg-surface-100 text-surface-400"}`}>{s}</div>
                {s < 2 && <div className={`flex-1 h-0.5 rounded ${step > s ? "bg-brand-500" : "bg-surface-200"}`} />}
              </React.Fragment>
            ))}
          </div>
          <h1 className="font-display text-3xl font-bold text-surface-900 mb-2">{step === 1 ? "School Details" : "Admin Account"}</h1>
          <p className="text-surface-500 mb-8">{step === 1 ? "Tell us about your school." : "Set up your administrator account."}</p>

          {step === 1 ? (
            <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="space-y-5">
              <Input id="reg-school" label="School Name" placeholder="Lagos Model School" value={formData.schoolName} onChange={(e) => setFormData({...formData, schoolName: e.target.value})} required />
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1.5">Curriculum Version</label>
                <select id="reg-curriculum" value={formData.curriculumVersion} onChange={(e) => setFormData({...formData, curriculumVersion: e.target.value})} className="w-full rounded-xl border border-surface-200 bg-white px-4 py-2.5 text-sm text-surface-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all" required>
                  <option value="">Select curriculum…</option>
                  {allCurriculums.map((c) => <option key={c.code} value={c.code}>{c.flag} {c.label}</option>)}
                </select>
              </div>
              <Input id="reg-country" label="Country" placeholder="Nigeria" value={formData.country} onChange={(e) => setFormData({...formData, country: e.target.value})} required />
              <Input id="reg-phone" label="Phone Number" type="tel" placeholder="+234 800 000 0000" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
              <Button type="submit" variant="primary" size="lg" className="w-full">Continue</Button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-5">
              <Input id="reg-name" label="Full Name" placeholder="Jane Doe" value={formData.adminName} onChange={(e) => setFormData({...formData, adminName: e.target.value})} required />
              <Input id="reg-email" label="Email Address" type="email" placeholder="admin@school.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
              <Input id="reg-password" label="Password" type="password" placeholder="Min 8 characters" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required />
              <Input id="reg-confirm" label="Confirm Password" type="password" placeholder="Repeat password" value={formData.confirmPassword} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} required />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button type="submit" variant="primary" size="lg" className="w-full" disabled={loading}>
                {loading ? "Creating Account..." : "Create Account & Start Trial"}
              </Button>
              <button type="button" onClick={() => setStep(1)} className="w-full text-sm text-surface-500 hover:text-brand-500 transition-colors">← Back to school details</button>
            </form>
          )}

          <p className="mt-8 text-center text-sm text-surface-500">
            Already have an account?{" "}
            <Link href="/login" className="text-brand-500 hover:text-brand-600 font-semibold">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

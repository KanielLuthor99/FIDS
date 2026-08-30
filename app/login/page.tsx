'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/Providers';
import { apiLogin } from '@/lib/api';
import { LogIn, ArrowRight, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleQuickLogin = async () => {
    setIsLoading(true);
    try {
      await apiLogin('Admin');
      login('Admin');
      router.push('/dashboard');
    } catch (err) {
      login('Admin');
      router.push('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#0b1329] p-4 overflow-hidden selection:bg-cyan-500 selection:text-white">
      {/* InJourney Cyan Radial Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(2,132,199,0.32),transparent_70%)] pointer-events-none" />

      {/* Floating InJourney Cyan & Sky Light Orbs */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-cyan-500/15 rounded-full blur-[100px] animate-float-slow pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-sky-400/15 rounded-full blur-[120px] animate-float-reverse pointer-events-none" />

      {/* Subtle Grid Overlay */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:4rem_4rem]" />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-md animate-fade-in-up">
        {/* Header Branding with InJourney Airports Logo */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center px-7 py-3.5 rounded-2xl bg-white/95 backdrop-blur-md shadow-2xl border border-white/20 mb-4 transition-transform duration-300 hover:scale-105">
            <Image
              src="/injourney-logo.png"
              alt="InJourney Airports Logo"
              width={190}
              height={55}
              className="h-10 w-auto object-contain"
              priority
            />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">FIDS Asset Management</h1>
          <p className="text-sm text-cyan-200/70 mt-1 font-medium">
            PT Injourney Airports Indonesia
          </p>
        </div>

        {/* Glass Login Panel in InJourney Navy */}
        <div className="bg-slate-900/75 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-cyan-500/20 relative overflow-hidden">
          {/* One-Click Login Button in InJourney Cyan Gradient */}
          <button
            onClick={handleQuickLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-between py-4 px-5 rounded-2xl bg-gradient-to-r from-sky-600 via-cyan-600 to-teal-600 hover:from-sky-500 hover:to-cyan-500 text-white font-medium shadow-lg shadow-sky-950/40 hover:shadow-cyan-900/60 transition-all duration-300 border border-sky-400/30 active:scale-[0.99] group disabled:opacity-75"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 rounded-xl bg-white/15 text-cyan-200 group-hover:scale-105 transition-transform">
                <LogIn className="w-5 h-5 text-cyan-100" />
              </div>
              <span className="text-base font-semibold text-white">Klik Untuk Login</span>
            </div>
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-cyan-200" />
            ) : (
              <ArrowRight className="w-5 h-5 text-cyan-200 group-hover:translate-x-1 transition-transform" />
            )}
          </button>

          {/* Minimal Footer */}
          <div className="mt-8 pt-4 border-t border-white/5 text-center text-[11px] text-slate-400 font-medium">
            InJourney Airports • PT Angkasa Pura Indonesia © 2026
          </div>
        </div>
      </div>
    </div>
  );
}

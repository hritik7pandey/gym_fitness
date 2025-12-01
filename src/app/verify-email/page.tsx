'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resending, setResending] = useState(false);

  const handleChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join('');

    if (otpCode.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otpCode }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/login?verified=true');
      } else {
        setError(data.message || 'Verification failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, resend: true }),
      });

      if (response.ok) {
        alert('New verification code sent!');
      }
    } catch (err) {
      alert('Failed to resend code');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden bg-gradient-to-br from-[#F6F9FF] via-[#EEF2FF] to-[#E6E9FF]">
      {/* Animated Liquid Neon Blobs */}
      <div className="absolute top-20 left-10 w-[600px] h-[600px] rounded-full animate-float" style={{ background: 'radial-gradient(circle, rgba(138,92,246,0.15) 0%, rgba(45,110,248,0.08) 50%, transparent 70%)', filter: 'blur(80px)' }}></div>
      <div className="absolute bottom-10 right-20 w-[500px] h-[500px] rounded-full animate-float" style={{ background: 'radial-gradient(circle, rgba(45,110,248,0.12) 0%, rgba(138,92,246,0.06) 50%, transparent 70%)', filter: 'blur(90px)', animationDelay: '2s' }}></div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-3 mb-3 group">
            <div className="w-12 h-12 glass-chip-active flex items-center justify-center shadow-neon-blue transition-all group-hover:scale-110 group-hover:shadow-neon-strong animate-glow-pulse">
              <span className="text-white font-bold text-xl drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">F</span>
            </div>
            <span className="gradient-title text-3xl font-bold drop-shadow-[0_2px_10px_rgba(45,110,248,0.3)]">Fitsense</span>
          </Link>
        </div>

        {/* Glass Card */}
        <div className="glass-panel p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 glass-chip-active flex items-center justify-center text-4xl mx-auto mb-4 shadow-neon-blue animate-breathe">
              📧
            </div>
            <h2 className="gradient-title text-2xl mb-2">Verify Your Email</h2>
            <p className="text-[#1C1C1E]/70 text-sm">
              We sent a 6-digit code to<br />
              <span className="font-semibold text-[#1C1C1E]">{email}</span>
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 glass-chip border-red-400/50 text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-14 text-center text-2xl font-bold glass-chip border-2 border-white/30 focus:border-[#2D6EF8] focus:outline-none focus:ring-2 focus:ring-[#2D6EF8]/50 transition-all text-[#1C1C1E]"
                  aria-label={`Digit ${index + 1}`}
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 glass-chip-active text-white font-semibold hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-neon-blue hover:shadow-neon-strong"
            >
              {loading ? 'Verifying...' : 'Verify Email'}
            </button>

            <div className="text-center text-[#1C1C1E]/70 text-sm">
              Didn't receive the code?{' '}
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="gradient-title font-semibold hover:drop-shadow-[0_0_8px_rgba(45,110,248,0.4)] disabled:opacity-50"
              >
                {resending ? 'Sending...' : 'Resend Code'}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-6 text-center">
          <Link href="/auth/signin" className="text-[#1C1C1E]/60 hover:text-[#1C1C1E] transition-colors text-sm font-medium">
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-hero-gradient flex items-center justify-center"><div className="text-white">Loading...</div></div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}

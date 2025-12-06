'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

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
      setError('Please enter the 6-digit code');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otpCode, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/login?reset=true');
      } else {
        setError(data.message || 'Password reset failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #2d3748 0%, #1a202c 30%, #2d3748 60%, #1a202c 100%)' }}>
      {/* Animated Liquid Neon Blobs */}
      <div className="absolute top-10 right-20 w-[600px] h-[600px] rounded-full animate-float" style={{ background: 'radial-gradient(circle, rgba(45,110,248,0.15) 0%, rgba(138,92,246,0.08) 50%, transparent 70%)', filter: 'blur(80px)' }}></div>
      <div className="absolute bottom-20 left-10 w-[500px] h-[500px] rounded-full animate-float" style={{ background: 'radial-gradient(circle, rgba(138,92,246,0.12) 0%, rgba(45,110,248,0.06) 50%, transparent 70%)', filter: 'blur(90px)', animationDelay: '2s' }}></div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-3 group">
            <div className="w-12 h-12 glass-chip-active flex items-center justify-center shadow-neon-blue transition-all group-hover:scale-110 group-hover:shadow-neon-strong animate-glow-pulse mx-auto">
              <span className="text-white font-bold text-xl drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">F</span>
            </div>
          </Link>
          <div className="gradient-title text-3xl font-bold drop-shadow-[0_2px_10px_rgba(45,110,248,0.3)] mb-2">
            Fitsense
          </div>
          <p className="text-gray-300 mt-2">Create a new password</p>
        </div>

        <div className="glass-panel p-8">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4 animate-breathe">🔐</div>
            <h2 className="gradient-title text-2xl mb-2">Reset Password</h2>
            <p className="text-gray-300 text-sm">
              Enter the code sent to <br />
              <span className="font-semibold">{email}</span>
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 glass-chip border-red-400/50 text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Verification Code
              </label>
              <div className="flex justify-center space-x-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-10 h-12 text-center text-xl font-bold glass-chip border-2 border-white/30 focus:border-[#2D6EF8] focus:outline-none focus:ring-2 focus:ring-[#2D6EF8]/50 transition-all text-white"
                    aria-label={`Digit ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            <Input
              type="password"
              label="New Password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              icon={<span className="text-xl">🔒</span>}
            />

            <Input
              type="password"
              label="Confirm Password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              icon={<span className="text-xl">🔒</span>}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 glass-chip-active text-white font-semibold hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-neon-blue hover:shadow-neon-strong"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        </div>

        <div className="mt-6 text-center">
          <Link href="/auth/signin" className="text-gray-400 hover:text-gray-200 transition-colors font-medium">
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-hero-gradient flex items-center justify-center"><div className="text-white">Loading...</div></div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}

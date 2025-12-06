'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push(`/reset-password?email=${email}`);
      } else {
        setError(data.message || 'Failed to send reset code');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #2d3748 0%, #1a202c 30%, #2d3748 60%, #1a202c 100%)' }}>
      {/* Animated Liquid Neon Blobs */}
      <div className="absolute top-20 right-10 w-[600px] h-[600px] rounded-full animate-float" style={{ background: 'radial-gradient(circle, rgba(45,110,248,0.15) 0%, rgba(138,92,246,0.08) 50%, transparent 70%)', filter: 'blur(80px)' }}></div>
      <div className="absolute bottom-10 left-20 w-[500px] h-[500px] rounded-full animate-float" style={{ background: 'radial-gradient(circle, rgba(255,106,61,0.12) 0%, rgba(255,184,0,0.06) 50%, transparent 70%)', filter: 'blur(90px)', animationDelay: '2s' }}></div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-3 group">
            <div className="w-12 h-12 glass-chip-active flex items-center justify-center shadow-neon-blue transition-all group-hover:scale-110 group-hover:shadow-neon-strong animate-glow-pulse mx-auto">
              <span className="text-white font-bold text-xl drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">F</span>
            </div>
          </Link>
          <div className="gradient-title text-3xl font-bold drop-shadow-[0_2px_10px_rgba(45,110,248,0.3)]">Fitsense</div>
        </div>

        <div className="glass-panel p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 glass-chip-active flex items-center justify-center text-4xl mx-auto mb-4 shadow-neon-blue animate-breathe">
              🔑
            </div>
            <h2 className="gradient-title text-2xl mb-2">Forgot Password?</h2>
            <p className="text-gray-300 text-sm">
              Enter your email and we'll send you a code to reset your password
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Email</label>
              <input
                type="email"
                placeholder="rohan.sharma@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="glass-input w-full px-4 py-3.5 text-white"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 glass-chip-active text-white font-semibold hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-neon-blue hover:shadow-neon-strong"
            >
              {loading ? 'Sending...' : 'Send Reset Code'}
            </button>

            <div className="text-center text-white/70 text-sm">
              Remember your password?{' '}
              <Link href="/auth/signin" className="text-blue-400 hover:text-blue-300 font-semibold">
                Login
              </Link>
            </div>
          </form>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-gray-400 hover:text-gray-200 transition-colors text-sm font-medium">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

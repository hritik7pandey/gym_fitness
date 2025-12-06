'use client';

import { useState } from 'react';
import Link from 'next/link';
import IOSInput from '@/components/ui/iOSInput';
import MotionButton from '@/components/ui/MotionButton';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push(`/verify-email?email=${formData.email}`);
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #2d3748 0%, #1a202c 30%, #2d3748 60%, #1a202c 100%)' }}>
      {/* iOS26 Liquid Neon Blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full opacity-40 animate-float"
          style={{
            background: 'radial-gradient(circle, rgba(45, 110, 248, 0.4) 0%, rgba(138, 92, 246, 0.3) 50%, transparent 70%)',
            filter: 'blur(80px)',
          }} />
        <div className="absolute bottom-[-15%] left-[-5%] w-[700px] h-[700px] rounded-full opacity-40 animate-float-delayed"
          style={{
            background: 'radial-gradient(circle, rgba(255, 106, 61, 0.35) 0%, rgba(255, 184, 0, 0.25) 50%, transparent 70%)',
            filter: 'blur(90px)',
          }} />
      </div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-indigo-400/15 to-pink-400/15 rounded-full blur-3xl" />

      {/* Signup Card */}
      <div className="w-full max-w-md relative z-10">
        <div className="glass-panel overflow-hidden">
          <div className="p-8 md:p-10">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <Link href="/" className="inline-block transform hover:scale-110 transition-transform duration-300">
                <div className="relative w-20 h-20">
                  <div className="absolute inset-0 glass-background-logo blur-xl opacity-70 animate-glow-pulse" />
                  <div className="relative glass-chip-active w-full h-full flex items-center justify-center shadow-neon-blue">
                    <span className="text-white font-bold text-4xl">F</span>
                  </div>
                </div>
              </Link>
            </div>

            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="gradient-title text-3xl md:text-4xl mb-2">
                Create Account
              </h1>
              <p className="text-gray-300 font-medium">
                Start your fitness journey today
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-5 glass-chip border-red-300/50">
                <p className="text-red-600 text-sm text-center font-semibold">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <IOSInput
                label="Full Name"
                type="text"
                placeholder="Rohan Sharma"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                }
              />

              <IOSInput
                label="Email"
                type="email"
                placeholder="rohan.sharma@gmail.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                }
              />

              <IOSInput
                label="Phone Number"
                type="tel"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                pattern="^[\+]?[0-9]{10,15}$"
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                }
                helperText="Format: +91 followed by 10 digits"
              />

              <IOSInput
                label="Password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                minLength={6}
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                }
                helperText="Minimum 6 characters"
              />

              <IOSInput
                label="Confirm Password"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />

              {/* Submit Button */}
              <MotionButton
                type="submit"
                disabled={loading}
                className="w-full mt-6"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creating Account...
                  </span>
                ) : (
                  'Sign Up'
                )}
              </MotionButton>
            </form>

            {/* Login Link */}
            <p className="text-center text-gray-300 mt-8">
              Already have an account?{' '}
              <Link
                href="/auth/signin"
                className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
              >
                Login
              </Link>
            </p>

            {/* Back to Home */}
            <div className="text-center mt-6">
              <Link
                href="/"
                className="text-sm text-gray-400 hover:text-gray-200 transition-colors inline-flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

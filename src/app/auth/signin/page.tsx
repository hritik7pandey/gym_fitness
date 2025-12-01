'use client';

import { useState } from 'react';
import Link from 'next/link';
import IOSInput from '@/components/ui/iOSInput';
import MotionButton from '@/components/ui/MotionButton';
import { useRouter } from 'next/navigation';

export default function SignInPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('userId', data.user.id);
        localStorage.setItem('userRole', data.user.role);
        
        if (data.user.role === 'admin') {
          router.push('/admin/dashboard');
        } else {
          router.push('/dashboard');
        }
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-mist-gradient relative overflow-hidden flex items-center justify-center p-4">
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

      {/* Login Card */}
      <div className="w-full max-w-md relative z-10">
        <div className="glass-panel overflow-hidden">
          <div className="p-8 md:p-12">
            {/* Logo */}
            <div className="flex justify-center mb-10">
              <Link href="/" className="inline-block transform hover:scale-110 transition-transform duration-300">
                <div className="relative w-20 h-20">
                  <div className="absolute inset-0 glass-background blur-xl opacity-70 animate-glow-pulse" />
                  <div className="relative glass-chip-active w-full h-full flex items-center justify-center shadow-neon-blue">
                    <span className="text-white font-bold text-4xl">F</span>
                  </div>
                </div>
              </Link>
            </div>

            {/* Header */}
            <div className="text-center mb-10">
              <h1 className="gradient-title text-4xl md:text-5xl mb-3">
                Welcome Back
              </h1>
              <p className="text-gray-600 font-medium text-lg">
                Sign in to continue your fitness journey
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
                label="Password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                }
              />

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center text-gray-700 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    className="mr-2 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-0 focus:ring-2"
                  />
                  <span className="group-hover:text-blue-600 transition-colors">Remember me</span>
                </label>
                <Link 
                  href="/forgot-password" 
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Submit Button */}
              <MotionButton
                type="submit"
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </MotionButton>
            </form>

            {/* Sign Up Link */}
            <p className="text-center text-gray-600 mt-8">
              Don't have an account?{' '}
              <Link
                href="/auth/signup"
                className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
              >
                Sign up
              </Link>
            </p>

            {/* Back to Home */}
            <div className="text-center mt-6">
              <Link
                href="/"
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors inline-flex items-center gap-1"
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

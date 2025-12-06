'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ReactNode } from 'react';
import { useHubAccess } from '@/hooks/useHubAccess';
import FluentButton from './FluentButton';

interface HubAccessGuardProps {
  children: ReactNode;
  feature?: string;
  fallback?: ReactNode;
}

/**
 * HubAccessGuard component
 * Wraps content that requires Premium Hub Access
 * Shows upgrade prompt if user doesn't have access
 */
export function HubAccessGuard({ children, feature, fallback }: HubAccessGuardProps) {
  const { hasAccess, isLoading, isExpired, expiryDate } = useHubAccess();

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-white/60">Loading...</div>
      </div>
    );
  }

  // User has access - show content
  if (hasAccess) {
    return <>{children}</>;
  }

  // User doesn't have access - show custom fallback or default upgrade prompt
  if (fallback) {
    return <>{fallback}</>;
  }

  // Default upgrade prompt
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="w-full max-w-md">
        <div className="ios-glass p-8 rounded-3xl shadow-ios-soft text-center">
          <div className="mb-6">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-iosPurple to-iosBlue flex items-center justify-center">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {isExpired ? 'Hub Access Expired' : 'Premium Hub Access Required'}
            </h2>
            <p className="text-white/70 mb-6">
              {isExpired
                ? `Your Premium Hub Access expired on ${expiryDate?.toLocaleDateString()}. Renew to continue using ${feature || 'this feature'}.`
                : `Unlock ${feature || 'this feature'} with Premium Hub Access. Get full access to workout tracking, diet plans, and attendance management for just ₹199/month.`}
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-left">
              <h3 className="font-semibold text-white mb-3">Premium Hub Includes:</h3>
              <ul className="space-y-2 text-sm text-white/80">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-400 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Personalized workout plans & tracking</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-400 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Custom diet plans & meal logging</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-400 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Attendance tracking & streaks</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-green-400 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Progress analytics & insights</span>
                </li>
              </ul>
            </div>

            <Link href="/settings?tab=membership">
              <FluentButton className="w-full bg-gradient-to-r from-iosPurple to-iosBlue text-white">
                {isExpired ? 'Renew Hub Access - ₹199/month' : 'Upgrade to Premium Hub - ₹199/month'}
              </FluentButton>
            </Link>

            <Link href="/dashboard">
              <button className="w-full py-3 text-white/70 hover:text-white transition-colors">
                Back to Dashboard
              </button>
            </Link>
          </div>
        </div>
        </div>
      </motion.div>
    </div>
  );
}

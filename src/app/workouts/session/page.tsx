'use client';

import { Suspense } from 'react';
import WorkoutSessionPage from '@/components/workout/WorkoutSessionPage';
import { useSearchParams } from 'next/navigation';

export const dynamic = 'force-dynamic';

function SessionContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('sessionId') || '';

  return <WorkoutSessionPage sessionId={sessionId} />;
}

export default function SessionPage() {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #B9D7FF 0%, #D8C7FF 35%, #A6F1FF 70%, #E5E1FF 100%)'
      }}>
        <div style={{
          fontFamily: 'SF Pro Display, -apple-system, sans-serif',
          fontSize: '20px',
          fontWeight: 600,
          color: '#1C1C1E'
        }}>Loading workout session...</div>
      </div>
    }>
      <SessionContent />
    </Suspense>
  );
}

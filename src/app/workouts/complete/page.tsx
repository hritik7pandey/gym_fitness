'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from '@/lib/motion';

export const dynamic = 'force-dynamic';

function CompleteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    // In a real app, fetch session details from the sessionId
    // For now, we'll use dummy data
    setSession({
      workoutName: 'Full Body Workout',
      duration: 45,
      caloriesBurned: 320,
      totalVolume: 5000,
      totalSets: 15,
      totalReps: 150,
      exercises: [
        { name: 'Bench Press', completedSets: 3, totalSets: 3 },
        { name: 'Squats', completedSets: 3, totalSets: 3 },
        { name: 'Deadlifts', completedSets: 3, totalSets: 3 },
      ],
    });
  }, []);

  if (!session) {
    return <div>Loading...</div>;
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #B9D7FF 0%, #D8C7FF 35%, #A6F1FF 70%, #E5E1FF 100%)',
      }}
    >
      {/* Confetti Effect */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{
              y: -20,
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 400),
              opacity: 1,
            }}
            animate={{
              y: (typeof window !== 'undefined' ? window.innerHeight : 800) + 20,
              opacity: 0,
            }}
            transition={{ duration: 3 + Math.random() * 2, ease: 'linear', repeat: Infinity }}
            style={{
              position: 'absolute',
              width: '12px',
              height: '12px',
              background: ['#7AA7FF', '#9EF5C2', '#FFE9A3', '#FFC59A', '#FFB7DF'][i % 5],
              borderRadius: '50%',
            }}
          />
        ))}
      </div>

      {/* Completion Card */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        style={{
          background: 'rgba(255,255,255,0.45)',
          backdropFilter: 'blur(50px) saturate(180%)',
          borderRadius: '36px',
          border: '1px solid rgba(255,255,255,0.5)',
          boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.7), 0 24px 64px rgba(0,0,0,0.08)',
          padding: '48px 32px',
          textAlign: 'center',
          maxWidth: '500px',
          width: '100%',
          position: 'relative',
          zIndex: 10,
        }}
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
          style={{
            width: '100px',
            height: '100px',
            margin: '0 auto 24px',
            borderRadius: '50%',
            background: '#9EF5C2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '48px',
            boxShadow: '0 12px 32px rgba(158,245,194,0.45)',
          }}
        >
          ✓
        </motion.div>

        <h1
          style={{
            fontFamily: 'SF Pro Display, -apple-system, sans-serif',
            fontWeight: 800,
            fontSize: '40px',
            color: '#1C1C1E',
            marginBottom: '8px',
          }}
        >
          Workout Complete!
        </h1>
        <p
          style={{
            fontFamily: 'SF Pro, -apple-system, sans-serif',
            fontWeight: 600,
            fontSize: '17px',
            color: '#1C1C1E',
            opacity: 0.7,
            marginBottom: '32px',
          }}
        >
          Amazing job! You crushed it 💪
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <CompletionStat label="Duration" value={`${session.duration}min`} />
          <CompletionStat label="Calories" value={session.caloriesBurned} />
          <CompletionStat label="Total Sets" value={session.totalSets} />
          <CompletionStat label="Total Reps" value={session.totalReps} />
        </div>

        {/* Exercises Summary */}
        <div
          style={{
            background: 'rgba(255,255,255,0.4)',
            backdropFilter: 'blur(40px) saturate(180%)',
            borderRadius: '20px',
            border: '1px solid rgba(255,255,255,0.5)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.7), 0 8px 32px rgba(0,0,0,0.06)',
            padding: '20px',
            marginBottom: '32px',
          }}
        >
          <h3
            style={{
              fontFamily: 'SF Pro, -apple-system, sans-serif',
              fontWeight: 700,
              fontSize: '17px',
              color: '#1C1C1E',
              marginBottom: '12px',
            }}
          >
            Exercises Completed
          </h3>
          <div className="space-y-2">
            {session.exercises.map((ex: any, idx: number) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '15px',
                }}
              >
                <span style={{ fontWeight: 600, color: '#1C1C1E' }}>{ex.name}</span>
                <span style={{ fontWeight: 700, color: '#7AA7FF' }}>
                  {ex.completedSets}/{ex.totalSets} sets
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Motivational Quote */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{
            background: 'rgba(122,167,255,0.35)',
            backdropFilter: 'blur(40px) saturate(180%)',
            borderRadius: '20px',
            border: '1px solid rgba(122,167,255,0.5)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.7), 0 8px 32px rgba(0,0,0,0.06)',
            padding: '20px',
            marginBottom: '32px',
          }}
        >
          <p
            style={{
              fontFamily: 'SF Pro, -apple-system, sans-serif',
              fontWeight: 600,
              fontSize: '15px',
              color: '#1C1C1E',
              fontStyle: 'italic',
            }}
          >
            "The only bad workout is the one that didn't happen."
          </p>
        </motion.div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => router.push('/workouts/stats')}
            style={{
              flex: 1,
              height: '56px',
              borderRadius: '28px',
              background: 'rgba(255,255,255,0.45)',
              border: '1px solid rgba(255,255,255,0.55)',
              color: '#1C1C1E',
              fontFamily: 'SF Pro, -apple-system, sans-serif',
              fontWeight: 600,
              fontSize: '17px',
              boxShadow: '0 12px 32px rgba(0,0,0,0.18)',
            }}
          >
            View Stats
          </button>
          <button
            onClick={() => router.push('/dashboard')}
            style={{
              flex: 1,
              height: '56px',
              borderRadius: '28px',
              background: '#7AA7FF',
              border: '1px solid rgba(255,255,255,0.35)',
              color: '#FFFFFF',
              fontFamily: 'SF Pro, -apple-system, sans-serif',
              fontWeight: 600,
              fontSize: '17px',
              boxShadow: '0 0 32px rgba(122,167,255,0.45), 0 12px 32px rgba(0,0,0,0.18)',
            }}
          >
            Done
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function WorkoutCompletePage() {
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
        }}>Loading results...</div>
      </div>
    }>
      <CompleteContent />
    </Suspense>
  );
}

function CompletionStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.4)',
        backdropFilter: 'blur(40px) saturate(180%)',
        borderRadius: '20px',
        border: '1px solid rgba(255,255,255,0.5)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.7), 0 8px 32px rgba(0,0,0,0.06)',
        padding: '20px 16px',
      }}
    >
      <div
        style={{
          fontFamily: 'SF Pro Display, -apple-system, sans-serif',
          fontWeight: 800,
          fontSize: '32px',
          color: '#1C1C1E',
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontFamily: 'SF Pro, -apple-system, sans-serif',
          fontWeight: 600,
          fontSize: '13px',
          color: '#1C1C1E',
          opacity: 0.7,
          marginTop: '6px',
        }}
      >
        {label}
      </div>
    </div>
  );
}

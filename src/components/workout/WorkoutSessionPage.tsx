'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { motion } from '@/lib/motion';
import { useWorkoutSession } from '@/hooks/useWorkoutSession';
import { useRouter } from 'next/navigation';

interface WorkoutSessionPageProps {
  sessionId: string;
}

export default function WorkoutSessionPage({ sessionId }: WorkoutSessionPageProps) {
  const { session, pauseWorkout, resumeWorkout, nextExercise, previousExercise, updateSet, completeWorkout } = useWorkoutSession();
  const router = useRouter();
  const [displayTime, setDisplayTime] = useState('00:00');
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [perceivedExertion, setPerceivedExertion] = useState(5);
  const [notes, setNotes] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);

  // Calculate display time from elapsedTime
  useEffect(() => {
    if (!session) return;

    const updateDisplayTime = () => {
      const elapsed = session.elapsedTime;
      const minutes = Math.floor(elapsed / 1000 / 60);
      const seconds = Math.floor((elapsed / 1000) % 60);
      setDisplayTime(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    };

    updateDisplayTime();
    const interval = setInterval(updateDisplayTime, 1000);

    return () => clearInterval(interval);
  }, [session]);

  if (!session) {
    return <div>Loading...</div>;
  }

  const currentExercise = session.currentExercise;
  const progress = ((session.currentExerciseIndex + 1) / session.totalExercises) * 100;

  const handleSetComplete = (setIndex: number, currentReps: number, currentWeight: number) => {
    updateSet(session.currentExerciseIndex, setIndex, currentReps, currentWeight, true);
  };

  const handleNextExercise = async () => {
    const result = await nextExercise();
    if (result && result.canComplete) {
      setShowCompleteModal(true);
    }
  };

  const handleCompleteWorkout = async () => {
    try {
      const result = await completeWorkout(perceivedExertion, notes);
      if (result) {
        setShowConfetti(true);
        setTimeout(() => {
          router.push('/workouts/complete?sessionId=' + result.sessionId);
        }, 800);
      }
    } catch (err) {
      console.error('Error completing workout:', err);
    }
  };

  return (
    <div 
      className="min-h-screen relative overflow-hidden pb-44 sm:pb-24"
      style={{
        background: 'linear-gradient(135deg, #B9D7FF 0%, #D8C7FF 35%, #A6F1FF 70%, #E5E1FF 100%)',
      }}
    >
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {Array.from({ length: 50 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: -20, x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 400), opacity: 1 }}
              animate={{ y: (typeof window !== 'undefined' ? window.innerHeight : 800) + 20, opacity: 0 }}
              transition={{ duration: 2 + Math.random() * 2, ease: 'linear' }}
              style={{
                position: 'absolute',
                width: '10px',
                height: '10px',
                background: ['#7AA7FF', '#9EF5C2', '#FFE9A3', '#FFC59A', '#FFB7DF'][i % 5],
                borderRadius: '50%',
              }}
            />
          ))}
        </div>
      )}

      {/* Header */}
      <div 
        className="sticky top-0 z-40 px-4 sm:px-6 py-3 sm:py-4"
        style={{
          background: 'rgba(255,255,255,0.35)',
          backdropFilter: 'blur(40px) saturate(150%)',
          WebkitBackdropFilter: 'blur(40px) saturate(150%)',
          borderBottom: '1px solid rgba(255,255,255,0.45)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
        }}
      >
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            style={{
              padding: '6px 12px',
              borderRadius: '20px',
              background: 'rgba(255,255,255,0.45)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(255,255,255,0.5)',
              color: '#1C1C1E',
              fontFamily: 'SF Pro, -apple-system, sans-serif',
              fontWeight: 600,
              fontSize: '14px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
            }}
          >
            ← Back
          </button>
          <div className="text-center flex-1 px-2">
            <h1 
              className="truncate"
              style={{
                fontFamily: 'SF Pro Display, -apple-system, sans-serif',
                fontWeight: 800,
                fontSize: '18px',
                color: '#1C1C1E',
              }}
            >
              {session.workoutName}
            </h1>
            <p 
              style={{
                fontFamily: 'SF Pro, -apple-system, sans-serif',
                fontWeight: 600,
                fontSize: '13px',
                color: '#1C1C1E',
                opacity: 0.7,
                marginTop: '2px',
              }}
            >
              Exercise {session.currentExerciseIndex + 1} of {session.totalExercises}
            </p>
          </div>
          <div style={{ width: '65px' }} />
        </div>

        {/* Progress Bar */}
        <div 
          className="mt-3"
          style={{
            height: '5px',
            borderRadius: '10px',
            background: 'rgba(255,255,255,0.35)',
            overflow: 'hidden',
          }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
            style={{
              height: '100%',
              background: '#7AA7FF',
              borderRadius: '10px',
              boxShadow: '0 0 12px rgba(122,167,255,0.6)',
            }}
          />
        </div>
      </div>

      {/* Timer Display */}
      <div className="flex flex-col items-center justify-center py-4 sm:py-6 px-4">
        <motion.div
          animate={{ scale: session.isPaused ? 1 : [1, 1.02, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="w-36 h-36 sm:w-48 sm:h-48"
          style={{
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.35)',
            backdropFilter: 'blur(40px) saturate(150%)',
            WebkitBackdropFilter: 'blur(40px) saturate(150%)',
            border: '2px solid rgba(255,255,255,0.5)',
            boxShadow: '0 24px 64px rgba(0,0,0,0.12), inset 0 2px 0 rgba(255,255,255,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          <svg style={{ position: 'absolute', width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
            <circle
              cx="72"
              cy="72"
              r="64"
              className="sm:hidden"
              fill="none"
              stroke="rgba(122,167,255,0.3)"
              strokeWidth="6"
            />
            <circle
              cx="72"
              cy="72"
              r="64"
              className="sm:hidden"
              fill="none"
              stroke="#7AA7FF"
              strokeWidth="6"
              strokeDasharray={`${progress * 4.02} 402`}
              strokeLinecap="round"
              style={{
                filter: 'drop-shadow(0 0 8px rgba(122,167,255,0.6))',
              }}
            />
            <circle
              cx="96"
              cy="96"
              r="86"
              className="hidden sm:block"
              fill="none"
              stroke="rgba(122,167,255,0.3)"
              strokeWidth="8"
            />
            <circle
              cx="96"
              cy="96"
              r="86"
              className="hidden sm:block"
              fill="none"
              stroke="#7AA7FF"
              strokeWidth="8"
              strokeDasharray={`${progress * 5.4} 540`}
              strokeLinecap="round"
              style={{
                filter: 'drop-shadow(0 0 8px rgba(122,167,255,0.6))',
              }}
            />
          </svg>
          <div className="text-center z-10">
            <div 
              className="text-3xl sm:text-5xl"
              style={{
                fontFamily: 'SF Pro Display, -apple-system, sans-serif',
                fontWeight: 800,
                color: '#1C1C1E',
                lineHeight: 1,
              }}
            >
              {displayTime}
            </div>
            <div 
              className="text-xs sm:text-sm"
              style={{
                fontFamily: 'SF Pro, -apple-system, sans-serif',
                fontWeight: 600,
                color: '#1C1C1E',
                opacity: 0.6,
                marginTop: '4px',
              }}
            >
              {session.isPaused ? 'PAUSED' : 'IN PROGRESS'}
            </div>
          </div>
        </motion.div>

        {/* Stats Row */}
        <div className="flex gap-2 sm:gap-4 mt-4 sm:mt-6 w-full max-w-md">
          <StatCard label="Calories" value={session.caloriesBurned.toString()} />
          <StatCard label="Sets" value={session.totalSets.toString()} />
          <StatCard label="Volume" value={`${Math.round(session.totalVolume / 1000)}kg`} />
        </div>
      </div>

      {/* Current Exercise Card */}
      {currentExercise && (
        <motion.div
          key={session.currentExerciseIndex}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          className="mx-4 sm:mx-6 mb-8 sm:mb-6"
          style={{
            background: 'rgba(255,255,255,0.35)',
            backdropFilter: 'blur(40px) saturate(150%)',
            WebkitBackdropFilter: 'blur(40px) saturate(150%)',
            borderRadius: '28px',
            border: '1px solid rgba(255,255,255,0.5)',
            boxShadow: '0 12px 40px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.7)',
            padding: '20px',
          }}
        >
          <h2 
            className="text-2xl sm:text-3xl"
            style={{
              fontFamily: 'SF Pro Display, -apple-system, sans-serif',
              fontWeight: 800,
              color: '#1C1C1E',
              marginBottom: '6px',
            }}
          >
            {currentExercise.name}
          </h2>
          <p 
            className="text-sm sm:text-base"
            style={{
              fontFamily: 'SF Pro, -apple-system, sans-serif',
              fontWeight: 600,
              color: '#1C1C1E',
              opacity: 0.7,
              marginBottom: '16px',
            }}
          >
            {currentExercise.targetSets} sets × {currentExercise.targetReps} reps
          </p>

          {/* Sets */}
          <div className="space-y-2 sm:space-y-3">
            {currentExercise.sets.map((set: any, idx: number) => (
              <SetRow
                key={idx}
                setNumber={set.setNumber}
                reps={set.reps}
                weight={set.weight}
                completed={set.completed}
                onComplete={() => handleSetComplete(idx, set.reps || currentExercise.targetReps, set.weight || 0)}
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* Control Buttons */}
      <div className="fixed bottom-24 sm:bottom-6 left-0 right-0 px-3 sm:px-6 z-30">
        <div className="flex gap-2 sm:gap-3 max-w-2xl mx-auto">
          <button
            onClick={session.isPaused ? resumeWorkout : pauseWorkout}
            className="flex-1 h-11 sm:h-14 text-sm sm:text-base"
            style={{
              borderRadius: '20px',
              background: session.isPaused ? '#7AA7FF' : 'rgba(255,255,255,0.35)',
              backdropFilter: 'blur(24px) saturate(180%)',
              border: '1px solid rgba(255,255,255,0.45)',
              color: session.isPaused ? '#FFFFFF' : '#1C1C1E',
              fontFamily: 'SF Pro, -apple-system, sans-serif',
              fontWeight: 600,
              boxShadow: session.isPaused 
                ? '0 0 32px rgba(122,167,255,0.45), 0 8px 24px rgba(0,0,0,0.18)' 
                : '0 8px 24px rgba(0,0,0,0.18)',
            }}
          >
            {session.isPaused ? '▶️ Resume' : '⏸ Pause'}
          </button>
          <button
            onClick={handleNextExercise}
            className="flex-1 h-11 sm:h-14 text-sm sm:text-base"
            style={{
              borderRadius: '20px',
              background: '#7AA7FF',
              backdropFilter: 'blur(24px) saturate(180%)',
              border: '1px solid rgba(255,255,255,0.35)',
              color: '#FFFFFF',
              fontFamily: 'SF Pro, -apple-system, sans-serif',
              fontWeight: 600,
              boxShadow: '0 0 32px rgba(122,167,255,0.45), 0 8px 24px rgba(0,0,0,0.18)',
            }}
          >
            <span className="hidden sm:inline">Next Exercise →</span>
            <span className="sm:hidden">Next →</span>
          </button>
        </div>
      </div>

      {/* Complete Modal */}
      <AnimatePresence>
        {showCompleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ 
              position: 'fixed',
              inset: 0,
              zIndex: 50,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
              background: 'rgba(0,0,0,0.5)' 
            }}
            onClick={() => setShowCompleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onMouseDown={(e: React.MouseEvent) => e.stopPropagation()}
              style={{
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(32px) saturate(180%)',
                borderRadius: '32px',
                border: '1px solid rgba(255,255,255,0.45)',
                boxShadow: '0 24px 64px rgba(0,0,0,0.32)',
                padding: '32px',
                maxWidth: '400px',
                width: '100%',
              }}
            >
              <h3 
                style={{
                  fontFamily: 'SF Pro Display, -apple-system, sans-serif',
                  fontWeight: 800,
                  fontSize: '28px',
                  color: '#1C1C1E',
                  marginBottom: '12px',
                  textAlign: 'center',
                }}
              >
                Complete Workout?
              </h3>
              <p 
                style={{
                  fontFamily: 'SF Pro, -apple-system, sans-serif',
                  fontWeight: 400,
                  fontSize: '15px',
                  color: '#1C1C1E',
                  opacity: 0.7,
                  textAlign: 'center',
                  marginBottom: '24px',
                }}
              >
                Rate your workout intensity (1-10)
              </p>

              <input
                type="range"
                min="1"
                max="10"
                value={perceivedExertion}
                onChange={(e) => setPerceivedExertion(parseInt(e.target.value))}
                style={{
                  width: '100%',
                  marginBottom: '8px',
                }}
              />
              <div style={{ textAlign: 'center', marginBottom: '16px', fontSize: '24px', fontWeight: 800 }}>
                {perceivedExertion}/10
              </div>

              <textarea
                placeholder="Add notes (optional)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '16px',
                  background: 'rgba(255,255,255,0.5)',
                  border: '1px solid rgba(255,255,255,0.35)',
                  fontFamily: 'SF Pro, -apple-system, sans-serif',
                  fontSize: '15px',
                  marginBottom: '20px',
                  resize: 'none',
                }}
              />

              <div className="flex gap-3">
                <button
                  onClick={() => setShowCompleteModal(false)}
                  style={{
                    flex: 1,
                    height: '52px',
                    borderRadius: '26px',
                    background: 'rgba(255,255,255,0.5)',
                    border: '1px solid rgba(255,255,255,0.45)',
                    fontFamily: 'SF Pro, -apple-system, sans-serif',
                    fontWeight: 600,
                    fontSize: '17px',
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCompleteWorkout}
                  style={{
                    flex: 1,
                    height: '52px',
                    borderRadius: '26px',
                    background: '#7AA7FF',
                    border: '1px solid rgba(255,255,255,0.35)',
                    color: '#FFFFFF',
                    fontFamily: 'SF Pro, -apple-system, sans-serif',
                    fontWeight: 600,
                    fontSize: '17px',
                    boxShadow: '0 0 32px rgba(122,167,255,0.45)',
                  }}
                >
                  Complete 🎉
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="flex-1"
      style={{
        background: 'rgba(255,255,255,0.35)',
        backdropFilter: 'blur(40px) saturate(150%)',
        WebkitBackdropFilter: 'blur(40px) saturate(150%)',
        borderRadius: '20px',
        border: '1px solid rgba(255,255,255,0.5)',
        padding: '12px 16px',
        textAlign: 'center',
        boxShadow: '0 8px 32px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.7)',
      }}
    >
      <div 
        className="text-xl sm:text-2xl"
        style={{
          fontFamily: 'SF Pro Display, -apple-system, sans-serif',
          fontWeight: 800,
          color: '#1C1C1E',
        }}
      >
        {value}
      </div>
      <div 
        className="text-xs sm:text-sm"
        style={{
          fontFamily: 'SF Pro, -apple-system, sans-serif',
          fontWeight: 600,
          color: '#1C1C1E',
          opacity: 0.7,
          marginTop: '2px',
        }}
      >
        {label}
      </div>
    </div>
  );
}

function SetRow({ setNumber, reps, weight, completed, onComplete }: any) {
  return (
    <div
      className="grid grid-cols-[auto_1fr_1fr_auto] items-center gap-1.5 sm:gap-2.5 p-2.5 sm:p-3"
      style={{
        borderRadius: '16px',
        background: completed ? 'rgba(158,245,194,0.3)' : 'rgba(255,255,255,0.35)',
        backdropFilter: 'blur(24px) saturate(150%)',
        WebkitBackdropFilter: 'blur(24px) saturate(150%)',
        border: `1px solid ${completed ? 'rgba(158,245,194,0.5)' : 'rgba(255,255,255,0.5)'}`,
      }}
    >
      <div className="text-xs sm:text-base font-bold text-gray-900">
        {setNumber}
      </div>
      <input
        type="number"
        value={reps || ''}
        placeholder="Reps"
        disabled={completed}
        className="text-xs sm:text-base w-full"
        style={{
          padding: '7px 4px',
          borderRadius: '12px',
          background: 'rgba(255,255,255,0.5)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.5)',
          textAlign: 'center',
          fontWeight: 600,
        }}
      />
      <input
        type="number"
        value={weight || ''}
        placeholder="kg"
        disabled={completed}
        className="text-xs sm:text-base w-full"
        style={{
          padding: '7px 4px',
          borderRadius: '12px',
          background: 'rgba(255,255,255,0.5)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.5)',
          textAlign: 'center',
          fontWeight: 600,
        }}
      />
      <button
        onClick={onComplete}
        disabled={completed}
        className="text-xs sm:text-sm"
        style={{
          padding: '7px 8px',
          borderRadius: '10px',
          background: completed ? '#9EF5C2' : '#7AA7FF',
          border: 'none',
          color: completed ? '#1C1C1E' : '#FFFFFF',
          fontWeight: 600,
          whiteSpace: 'nowrap',
        }}
      >
        {completed ? '✓' : 'Done'}
      </button>
    </div>
  );
}

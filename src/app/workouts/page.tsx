"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from '@/lib/motion';
import AnimatedGlassCard from '@/components/ui/AnimatedGlassCard';
import MotionButton from '@/components/ui/MotionButton';
import ProgressCircle from '../../components/ui/ProgressCircle';
import { useWorkoutSession } from '@/hooks/useWorkoutSession';
import { HubAccessGuard } from '@/components/ui/HubAccessGuard';

interface Workout {
  id: string;
  name: string;
  type: string;
  duration: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  completed: boolean;
  progress: number;
  exercises?: any[];
}

function WorkoutsContent() {
  const router = useRouter();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'All' | 'Active' | 'Completed'>('All');
  const { session, startWorkout: startSession, isLoading: sessionLoading } = useWorkoutSession();

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      if (!token) {
        router.push('/auth/signin');
        return;
      }

      const response = await fetch('/api/workout/my-plan', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.workouts && data.workouts.length > 0) {
          const mappedWorkouts = data.workouts.map((w: any, index: number) => ({
            id: w._id || index.toString(),
            name: w.name || 'Workout',
            type: w.type || 'General',
            duration: w.duration || 30,
            difficulty: w.difficulty || 'Intermediate',
            completed: w.completed || false,
            progress: w.progress || 0,
          }));
          setWorkouts(mappedWorkouts);
        } else {
          // Set default workouts if none assigned
          setWorkouts([
            { id: '1', name: 'Full Body HIIT', type: 'Cardio', duration: 30, difficulty: 'Intermediate', completed: false, progress: 0 },
            { id: '2', name: 'Upper Body Strength', type: 'Strength', duration: 45, difficulty: 'Advanced', completed: true, progress: 100 },
            { id: '3', name: 'Yoga Flow', type: 'Flexibility', duration: 60, difficulty: 'Beginner', completed: false, progress: 0 },
            { id: '4', name: 'Core Blast', type: 'Core', duration: 20, difficulty: 'Intermediate', completed: false, progress: 50 },
          ]);
        }
      }
    } catch (error) {
      console.error('Error fetching workouts:', error);
      // Set default workouts on error
      setWorkouts([
        { id: '1', name: 'Full Body HIIT', type: 'Cardio', duration: 30, difficulty: 'Intermediate', completed: false, progress: 0 },
        { id: '2', name: 'Upper Body Strength', type: 'Strength', duration: 45, difficulty: 'Advanced', completed: true, progress: 100 },
        { id: '3', name: 'Yoga Flow', type: 'Flexibility', duration: 60, difficulty: 'Beginner', completed: false, progress: 0 },
        { id: '4', name: 'Core Blast', type: 'Core', duration: 20, difficulty: 'Intermediate', completed: false, progress: 50 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const startWorkout = async (workout: Workout) => {
    // Check if there's already an active session
    if (session) {
      const resume = confirm('You have an active workout session. Do you want to resume it?');
      if (resume) {
        router.push('/workouts/session?sessionId=' + session.sessionId);
        return;
      }
    }

    // Fetch workout details including exercises
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      if (!token) {
        router.push('/auth/signin');
        return;
      }

      // For demo purposes, use default exercises if not available
      const exercises = workout.exercises || [
        { name: 'Push Ups', sets: 3, reps: 12, type: 'Bodyweight', restSeconds: 60 },
        { name: 'Squats', sets: 3, reps: 15, type: 'Bodyweight', restSeconds: 60 },
        { name: 'Plank', sets: 3, reps: 30, type: 'Core', restSeconds: 45 },
        { name: 'Lunges', sets: 3, reps: 10, type: 'Bodyweight', restSeconds: 60 },
      ];

      const result = await startSession(workout.id, workout.name, exercises);

      if (result.success) {
        router.push('/workouts/session?sessionId=' + result.session.sessionId);
      }
    } catch (error) {
      console.error('Error starting workout:', error);
      alert('Failed to start workout. Please try again.');
    }
  };

  const filteredWorkouts = workouts.filter((w) => {
    if (filter === 'Active') return !w.completed;
    if (filter === 'Completed') return w.completed;
    return true;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-700';
      case 'Intermediate': return 'bg-iosBlue/20 text-iosBlue';
      case 'Advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100';
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #2d3748 0%, #1a202c 30%, #2d3748 60%, #1a202c 100%)' }}>
      {/* iOS 26 Ambient Glow Blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-8%] right-[-4%] w-[500px] h-[500px] rounded-full opacity-30 animate-float" style={{ background: 'radial-gradient(circle, rgba(185, 215, 255, 0.6) 0%, rgba(216, 199, 255, 0.3) 60%, transparent 100%)', filter: 'blur(48px)' }} />
        <div className="absolute bottom-[-10%] left-[-4%] w-[600px] h-[600px] rounded-full opacity-25 animate-float" style={{ background: 'radial-gradient(circle, rgba(166, 241, 255, 0.5) 0%, rgba(229, 225, 255, 0.25) 60%, transparent 100%)', filter: 'blur(48px)', animationDelay: '2s' }} />
        <div className="absolute top-1/3 left-1/3 w-[450px] h-[450px] rounded-full opacity-20 animate-float" style={{ background: 'radial-gradient(circle, rgba(216, 199, 255, 0.4) 0%, rgba(185, 215, 255, 0.2) 60%, transparent 100%)', filter: 'blur(48px)', animationDelay: '4s' }} />
      </div>

      <section aria-label="Workouts" className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 lg:pb-8 space-y-5">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-[32px] lg:text-[40px] font-[800] text-gray-100" style={{ fontFamily: 'SF Pro Display, -apple-system, sans-serif' }}>
              My Workouts 💪
            </h2>
            <p className="text-[15px] lg:text-[17px] font-[600] text-gray-300 mt-2" style={{ fontFamily: 'SF Pro, -apple-system, sans-serif' }}>{filteredWorkouts.length} workouts available</p>
          </div>
          <div className="flex gap-3">
            {session && (
              <MotionButton
                variant="secondary"
                onClick={() => router.push('/workouts/session?sessionId=' + session.sessionId)}
              >
                ⏱ Resume Active Workout
              </MotionButton>
            )}
            <MotionButton
              variant="primary"
              onClick={() => {
                if (workouts.length > 0) {
                  const nextWorkout = workouts.find(w => !w.completed);
                  if (nextWorkout) {
                    startWorkout(nextWorkout);
                  } else {
                    alert('🎉 All workouts completed! Great job!\n\nCheck back tomorrow for new workouts.');
                  }
                } else {
                  alert('⚠️ No workouts assigned yet.\n\nContact your trainer to get started!');
                }
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 3l14 9-14 9V3z" fill="currentColor" />
              </svg>
              {session ? 'Start New Workout' : 'Start Workout'}
            </MotionButton>
            <MotionButton
              variant="ghost"
              onClick={() => router.push('/workouts/stats')}
            >
              📊 Stats
            </MotionButton>
          </div>
        </motion.header>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex gap-3 overflow-x-auto scrollbar-hide">
          {(['All', 'Active', 'Completed'] as const).map((status, index) => (
            <motion.button
              key={status}
              onClick={() => setFilter(status)}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
              style={{
                background: filter === status ? 'linear-gradient(135deg, rgba(147,51,234,0.9), rgba(59,130,246,0.9))' : 'rgba(255,255,255,0.4)',
                backdropFilter: 'blur(40px) saturate(180%)',
                border: filter === status ? 'none' : '1px solid rgba(255,255,255,0.5)'
              }}
              className={`px-6 py-3 rounded-2xl text-sm lg:text-base font-medium transition-all whitespace-nowrap shadow-lg ${filter === status ? 'text-white' : 'text-gray-300'
                }`}
            >
              {status}
            </motion.button>
          ))}
        </motion.div>

        {/* Workout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkouts.map((workout, index) => (
            <AnimatedGlassCard key={workout.id} delay={0.3 + index * 0.1} depth="medium">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                className="space-y-3">

                {/* Header with icon */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-white truncate">{workout.name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{workout.type}</p>
                  </div>
                  <span className="text-lg flex-shrink-0">{workout.completed ? '✅' : '🏋️'}</span>
                </div>

                {/* Tags row */}
                <div className="flex items-center justify-between gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium ${getDifficultyColor(workout.difficulty)}`}>
                    {workout.difficulty}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                      <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    <span className="text-xs text-white/60">{workout.duration} min</span>
                  </div>
                </div>

                {/* Progress indicator */}
                {workout.progress > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2">
                    <ProgressCircle value={workout.progress} size={36} stroke={3} />
                    <span className="text-xs text-white/60">In progress</span>
                  </motion.div>
                )}

                {/* Action button */}
                <MotionButton
                  variant={workout.completed ? "ghost" : "primary"}
                  size="sm"
                  className="w-full"
                  onClick={() => !workout.completed && startWorkout(workout)}
                >
                  {workout.completed ? '✓ Done' : workout.progress > 0 ? 'Continue' : 'Start'}
                </MotionButton>
              </motion.div>
            </AnimatedGlassCard>
          ))}
        </div>

        {/* Weekly Summary - Desktop Only */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-6 mt-8">
          <AnimatedGlassCard delay={0.8}>
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <span>📊</span>
              This Week
            </h3>
            <div className="space-y-5">
              {[
                { label: 'Workouts Completed', value: '8', icon: '💪' },
                { label: 'Total Minutes', value: '240', icon: '⏱️' },
                { label: 'Calories Burned', value: '1,850', icon: '🔥' }
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.9 + i * 0.1 }}
                  className="flex justify-between items-center">
                  <span className="text-white/70 flex items-center gap-2">
                    <span>{stat.icon}</span>
                    {stat.label}
                  </span>
                  <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    {stat.value}
                  </span>
                </motion.div>
              ))}
            </div>
          </AnimatedGlassCard>

          <AnimatedGlassCard delay={0.9}>
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <span>⭐</span>
              Recommended
            </h3>
            <div className="space-y-3">
              {['Morning Cardio', 'Evening Strength', 'Rest Day Yoga'].map((recommendation, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 1.0 + i * 0.1 }}
                  whileHover={{ x: 5, scale: 1.02 }}
                  style={{
                    background: 'rgba(255,255,255,0.4)',
                    backdropFilter: 'blur(40px) saturate(180%)',
                    border: '1px solid rgba(255,255,255,0.5)'
                  }}
                  className="flex items-center justify-between p-4 rounded-2xl shadow-lg cursor-pointer">
                  <span className="text-sm font-medium text-white/80">{recommendation}</span>
                  <MotionButton variant="primary" size="sm">
                    Add
                  </MotionButton>
                </motion.div>
              ))}
            </div>
          </AnimatedGlassCard>
        </div>
      </section>
    </div>
  );
}

export default function WorkoutsPage() {
  return (
    <HubAccessGuard feature="workout tracking">
      <WorkoutsContent />
    </HubAccessGuard>
  );
}


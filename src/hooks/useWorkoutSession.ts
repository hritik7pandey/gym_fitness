'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface WorkoutSession {
  sessionId: string;
  workoutName: string;
  startTime: string;
  elapsedTime: number;
  durationMinutes: number;
  isPaused: boolean;
  isCompleted: boolean;
  currentExerciseIndex: number;
  totalExercises: number;
  exercises: any[];
  currentExercise: any;
  totalSets: number;
  totalReps: number;
  totalVolume: number;
  caloriesBurned: number;
  totalPausedTime: number;
}

export function useWorkoutSession() {
  const [session, setSession] = useState<WorkoutSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const getToken = () => {
    return localStorage.getItem('token');
  };

  const fetchCurrentSession = useCallback(async () => {
    try {
      const token = getToken();
      if (!token) {
        setIsLoading(false);
        return;
      }

      const response = await fetch('/api/workout-session/current', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success && data.hasActiveSession) {
        setSession(data.session);
      } else {
        setSession(null);
      }
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching workout session:', err);
      setError('Failed to fetch session');
      setIsLoading(false);
    }
  }, []);

  const startWorkout = async (workoutId: string, workoutName: string, exercises: any[]) => {
    try {
      const token = getToken();
      if (!token) throw new Error('No token');

      const response = await fetch('/api/workout-session/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ workoutId, workoutName, exercises }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to start workout');
      }

      await fetchCurrentSession();
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to start workout';
      setError(message);
      throw err;
    }
  };

  const pauseWorkout = async () => {
    if (!session) return;

    try {
      const token = getToken();
      const response = await fetch('/api/workout-session/pause', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ sessionId: session.sessionId }),
      });

      const data = await response.json();

      if (data.success) {
        await fetchCurrentSession();
      }
    } catch (err) {
      console.error('Error pausing workout:', err);
      setError('Failed to pause workout');
    }
  };

  const resumeWorkout = async () => {
    if (!session) return;

    try {
      const token = getToken();
      const response = await fetch('/api/workout-session/resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ sessionId: session.sessionId }),
      });

      const data = await response.json();

      if (data.success) {
        await fetchCurrentSession();
      }
    } catch (err) {
      console.error('Error resuming workout:', err);
      setError('Failed to resume workout');
    }
  };

  const nextExercise = async () => {
    if (!session) return;

    try {
      const token = getToken();
      const response = await fetch('/api/workout-session/next-exercise', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ sessionId: session.sessionId }),
      });

      const data = await response.json();

      if (data.success) {
        await fetchCurrentSession();
      }
      
      return data;
    } catch (err) {
      console.error('Error moving to next exercise:', err);
      setError('Failed to move to next exercise');
    }
  };

  const previousExercise = async () => {
    if (!session) return;

    try {
      const token = getToken();
      const response = await fetch('/api/workout-session/prev-exercise', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ sessionId: session.sessionId }),
      });

      const data = await response.json();

      if (data.success) {
        await fetchCurrentSession();
      }
    } catch (err) {
      console.error('Error moving to previous exercise:', err);
      setError('Failed to move to previous exercise');
    }
  };

  const updateSet = async (exerciseIndex: number, setIndex: number, reps: number, weight: number, completed: boolean) => {
    if (!session) return;

    try {
      const token = getToken();
      const response = await fetch('/api/workout-session/update-set', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          sessionId: session.sessionId,
          exerciseIndex,
          setIndex,
          reps,
          weight,
          completed,
        }),
      });

      const data = await response.json();

      if (data.success) {
        await fetchCurrentSession();
      }
    } catch (err) {
      console.error('Error updating set:', err);
      setError('Failed to update set');
    }
  };

  const completeWorkout = async (perceivedExertion?: number, notes?: string) => {
    if (!session) return;

    try {
      const token = getToken();
      const response = await fetch('/api/workout-session/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          sessionId: session.sessionId,
          perceivedExertion,
          notes,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSession(null);
        return data.session;
      }
    } catch (err) {
      console.error('Error completing workout:', err);
      setError('Failed to complete workout');
      throw err;
    }
  };

  // Auto-refresh session every 5 seconds when active
  useEffect(() => {
    if (session && !session.isCompleted) {
      intervalRef.current = setInterval(() => {
        fetchCurrentSession();
      }, 5000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [session, fetchCurrentSession]);

  // Initial load
  useEffect(() => {
    fetchCurrentSession();
  }, [fetchCurrentSession]);

  return {
    session,
    isLoading,
    error,
    startWorkout,
    pauseWorkout,
    resumeWorkout,
    nextExercise,
    previousExercise,
    updateSet,
    completeWorkout,
    refreshSession: fetchCurrentSession,
  };
}

export function useWorkoutHistory() {
  const [history, setHistory] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const getToken = () => localStorage.getItem('token');

  const fetchHistory = async (period: 'all' | 'week' | 'month' | 'year' = 'all', limit = 20, skip = 0) => {
    try {
      const token = getToken();
      if (!token) return;

      const response = await fetch(
        `/api/workout-session/history?period=${period}&limit=${limit}&skip=${skip}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setHistory(data.sessions);
        setSummary(data.summary);
      }
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching workout history:', err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return {
    history,
    summary,
    isLoading,
    fetchHistory,
  };
}

export function useWorkoutStats() {
  const [weeklyStats, setWeeklyStats] = useState<any>(null);
  const [monthlyStats, setMonthlyStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const getToken = () => localStorage.getItem('token');

  const fetchStats = async () => {
    try {
      const token = getToken();
      if (!token) return;

      const [weeklyRes, monthlyRes] = await Promise.all([
        fetch('/api/workout-session/stats-weekly', {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
        fetch('/api/workout-session/stats-monthly', {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
      ]);

      const [weeklyData, monthlyData] = await Promise.all([
        weeklyRes.json(),
        monthlyRes.json(),
      ]);

      if (weeklyData.success) setWeeklyStats(weeklyData.weekly);
      if (monthlyData.success) setMonthlyStats(monthlyData.monthly);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching workout stats:', err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    weeklyStats,
    monthlyStats,
    isLoading,
    refreshStats: fetchStats,
  };
}

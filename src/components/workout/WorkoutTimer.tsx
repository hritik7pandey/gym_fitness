'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from '@/lib/motion';

interface WorkoutTimerProps {
  isOpen: boolean;
  onClose: () => void;
  workoutName: string;
  duration: number; // in minutes
}

export default function WorkoutTimer({ isOpen, onClose, workoutName, duration }: WorkoutTimerProps) {
  const [mode, setMode] = useState<'timer' | 'stopwatch'>('timer');
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration * 60); // Timer mode (seconds)
  const [elapsed, setElapsed] = useState(0); // Stopwatch mode (seconds)
  const [soundEnabled, setSoundEnabled] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio context for beeps
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleRQAHIPT8LmNJgAAAHzS+cWhOgYAAGXL/9OWTAGAAEDB/+GeUgMAADW4/+mpYgQAAC2x/++vcAUAACer//O0fQYAACOm//i5iAYAAB2h//y9kgcAABid//zBlwgAABSZ//3EmQkAABGV//7HnAoAAA+R///JngsAAA6O///LnwwAAA2L///NoQ0AAQqI///OpQ4AAQiF///QqA8AAgaC///RqxAAAgOA///SrhEAAQJ+///TsRIAAQB8///UtRMAAf97///VuBQAAv56///WuhUAAv14///XvBYAAvx2///YvhcAAft0///ZwBgAAft0///ZwBgAAftz///awRkAAfty///bwhoAAvty///bwxsAAvty///cxBwAAvtx///dxR0AAvtx///exh4AAvtx///fx0AAAftx///gyUIAAftx///hy0QAAftx///izUYAAfty///jz0cAAvpy///k0EgAAftw///l0kkAAftw///m00oAAvtw///n1EsAAvtw///o1kwAAvpv///p2E4AAvpv///q2lAAAA');
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    setTimeLeft(duration * 60);
    setElapsed(0);
    setIsRunning(false);
  }, [duration, isOpen]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        if (mode === 'timer') {
          setTimeLeft((prev) => {
            if (prev <= 1) {
              setIsRunning(false);
              playSound();
              return 0;
            }
            // Play tick sound every minute
            if (prev % 60 === 0 && soundEnabled) {
              playTick();
            }
            return prev - 1;
          });
        } else {
          setElapsed((prev) => {
            // Play tick sound every minute
            if ((prev + 1) % 60 === 0 && soundEnabled) {
              playTick();
            }
            return prev + 1;
          });
        }
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, mode, soundEnabled]);

  const playSound = () => {
    if (!soundEnabled) return;
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      gainNode.gain.value = 0.3;
      
      oscillator.start();
      setTimeout(() => oscillator.stop(), 500);
    } catch (e) {
      console.log('Audio not supported');
    }
  };

  const playTick = () => {
    if (!soundEnabled) return;
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 440;
      oscillator.type = 'sine';
      gainNode.gain.value = 0.1;
      
      oscillator.start();
      setTimeout(() => oscillator.stop(), 100);
    } catch (e) {
      console.log('Audio not supported');
    }
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const reset = () => {
    setIsRunning(false);
    if (mode === 'timer') {
      setTimeLeft(duration * 60);
    } else {
      setElapsed(0);
    }
  };

  const progress = mode === 'timer' 
    ? ((duration * 60 - timeLeft) / (duration * 60)) * 100
    : Math.min((elapsed / (duration * 60)) * 100, 100);

  if (!isOpen) return null;

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          key="workout-timer-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            className="w-full max-w-sm bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden"
          >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-5 text-white">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold">{workoutName}</h2>
              <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            
            {/* Mode Toggle */}
            <div className="flex bg-white/20 rounded-xl p-1">
              <button
                onClick={() => { setMode('timer'); reset(); }}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition ${
                  mode === 'timer' ? 'bg-white text-blue-600' : 'text-white/80'
                }`}
              >
                ⏱️ Timer
              </button>
              <button
                onClick={() => { setMode('stopwatch'); reset(); }}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition ${
                  mode === 'stopwatch' ? 'bg-white text-blue-600' : 'text-white/80'
                }`}
              >
                ⏱ Stopwatch
              </button>
            </div>
          </div>

          {/* Timer Display */}
          <div className="p-8">
            <div className="relative w-48 h-48 mx-auto mb-6">
              {/* Progress Ring */}
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                />
                <motion.circle
                  cx="96"
                  cy="96"
                  r="88"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={553}
                  animate={{ strokeDashoffset: 553 - (553 * progress) / 100 }}
                  transition={{ duration: 0.5 }}
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#6366f1" />
                  </linearGradient>
                </defs>
              </svg>
              
              {/* Time Display */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-gray-900">
                  {mode === 'timer' ? formatTime(timeLeft) : formatTime(elapsed)}
                </span>
                <span className="text-sm text-gray-500 mt-1">
                  {mode === 'timer' ? 'remaining' : 'elapsed'}
                </span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <button
                onClick={reset}
                className="w-14 h-14 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3 3v5h5" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              
              <button
                onClick={() => setIsRunning(!isRunning)}
                className={`w-20 h-20 rounded-full flex items-center justify-center transition shadow-lg ${
                  isRunning 
                    ? 'bg-red-500 hover:bg-red-600' 
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                }`}
              >
                {isRunning ? (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
                    <rect x="6" y="4" width="4" height="16" rx="1"/>
                    <rect x="14" y="4" width="4" height="16" rx="1"/>
                  </svg>
                ) : (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                )}
              </button>

              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition ${
                  soundEnabled ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
                }`}
              >
                {soundEnabled ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M11 5L6 9H2v6h4l5 4V5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M11 5L6 9H2v6h4l5 4V5zM23 9l-6 6M17 9l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
            </div>

            {/* Workout complete message */}
            {mode === 'timer' && timeLeft === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center p-4 bg-green-100 rounded-2xl"
              >
                <span className="text-4xl mb-2 block">🎉</span>
                <p className="text-green-800 font-semibold">Workout Complete!</p>
                <p className="text-green-600 text-sm">Great job!</p>
              </motion.div>
            )}
          </div>
        </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

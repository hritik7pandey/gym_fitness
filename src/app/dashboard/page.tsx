'use client';

import { useState, useEffect } from 'react';
import AnimatedGlassCard from '@/components/ui/AnimatedGlassCard';
import MotionButton from '@/components/ui/MotionButton';
import WorkoutTimer from '@/components/workout/WorkoutTimer';
import AnnouncementCard from '@/components/announcements/AnnouncementCard';
import AnnouncementCenter from '@/components/announcements/AnnouncementCenter';

interface Workout {
  name: string;
  time: string;
  duration: number; // in minutes
  completed: boolean;
}

interface Announcement {
  _id: string;
  title: string;
  message: string;
  image?: string;
  priority: 'normal' | 'important' | 'critical';
  category: string;
  sticky: boolean;
  isRead?: boolean;
  isDismissed?: boolean;
  createdAt: string;
}

export default function UserDashboard() {
  const [mounted, setMounted] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [waterIntake, setWaterIntake] = useState(0);
  const [waterGoal] = useState(2000);
  const [showTimer, setShowTimer] = useState(false);
  const [activeWorkout, setActiveWorkout] = useState<Workout | null>(null);
  const [workouts, setWorkouts] = useState<Workout[]>([
    { name: 'Morning Cardio', time: '7:00 AM', duration: 30, completed: false },
    { name: 'Strength Training', time: '5:00 PM', duration: 45, completed: false },
  ]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [showAnnouncementCenter, setShowAnnouncementCenter] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const startWorkout = (workout: Workout) => {
    setActiveWorkout(workout);
    setShowTimer(true);
  };

  const completeWorkout = () => {
    if (activeWorkout) {
      setWorkouts(workouts.map(w => 
        w.name === activeWorkout.name ? { ...w, completed: true } : w
      ));
    }
    setShowTimer(false);
    setActiveWorkout(null);
  };

  useEffect(() => {
    setMounted(true);
    const user = localStorage.getItem('user');
    if (user) setUserData(JSON.parse(user));
    fetchWaterIntake();
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      if (!token) return;
      
      const response = await fetch('/api/announcements', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        // Show only important/critical unread announcements
        const importantAnnouncements = data.announcements
          .filter((a: Announcement) => 
            !a.isDismissed && 
            (a.priority === 'important' || a.priority === 'critical')
          )
          .slice(0, 3);
        setAnnouncements(importantAnnouncements);
        
        // Count unread announcements
        const unread = data.announcements.filter((a: Announcement) => !a.isRead && !a.isDismissed).length;
        setUnreadCount(unread);
      }
    } catch (error) {
      console.error('Failed to fetch announcements:', error);
    }
  };

  const fetchWaterIntake = async () => {
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      if (!token) return;
      const response = await fetch('/api/user/water-intake', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) setWaterIntake(data.dailyWaterIntake || 0);
    } catch (error) {
      console.error('Failed to fetch water intake:', error);
    }
  };

  const addWater = async (amount: number) => {
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      if (!token) {
        setWaterIntake(prev => Math.min(prev + amount, waterGoal));
        return;
      }
      const response = await fetch('/api/user/water-intake', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }),
      });
      const data = await response.json();
      if (data.success) setWaterIntake(data.dailyWaterIntake);
    } catch (error) {
      console.error('Failed to add water:', error);
      setWaterIntake(prev => Math.min(prev + amount, waterGoal));
    }
  };

  const handleReadAnnouncement = async (id: string) => {
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      await fetch('/api/announcements/read', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ announcementId: id }),
      });
      setAnnouncements(prev => prev.map(a => 
        a._id === id ? { ...a, isRead: true } : a
      ));
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const handleDismissAnnouncement = async (id: string) => {
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      await fetch('/api/announcements/dismiss', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ announcementId: id }),
      });
      setAnnouncements(prev => prev.filter(a => a._id !== id));
    } catch (error) {
      console.error('Failed to dismiss announcement:', error);
    }
  };

  if (!mounted) return null;

  const stats = [
    { label: 'Workouts', value: '8', icon: '💪', gradient: 'from-blue-500 to-indigo-500' },
    { label: 'Calories', value: '1,850', icon: '🔥', gradient: 'from-red-500 to-orange-500' },
    { label: 'Active Days', value: '5', icon: '⚡', gradient: 'from-green-500 to-emerald-500' },
    { label: 'Streak', value: '12', icon: '🏆', gradient: 'from-yellow-500 to-amber-500' },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(240, 244, 255, 0.4) 0%, rgba(232, 236, 255, 0.3) 50%, rgba(221, 226, 255, 0.4) 100%)' }}>
      {/* iOS 26 Soft Aurora Blobs - Static for performance */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(185, 215, 255, 0.5) 0%, rgba(216, 199, 255, 0.3) 50%, transparent 70%)',
            filter: 'blur(80px)',
          }} />
        <div className="absolute bottom-[-15%] left-[-5%] w-[700px] h-[700px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(166, 241, 255, 0.4) 0%, rgba(229, 225, 255, 0.25) 50%, transparent 70%)',
            filter: 'blur(90px)',
          }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 lg:pb-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-[32px] lg:text-[40px] font-[800] text-[#1C1C1E] mb-2" style={{ fontFamily: 'SF Pro Display, -apple-system, sans-serif' }}>
                Welcome, <span className="text-[#7AA7FF]">{userData?.name || 'User'}</span>! 💪
              </h1>
              <p className="text-[15px] lg:text-[17px] font-[600] text-[#1C1C1E]/70" style={{ fontFamily: 'SF Pro, -apple-system, sans-serif' }}>Let's crush your goals today</p>
              <p className="text-[13px] lg:text-[14px] font-[500] text-[#7AA7FF] mt-2 italic" style={{ fontFamily: 'SF Pro, -apple-system, sans-serif' }}>"Small progress is still progress" ✨</p>
            </div>
            <button
              onClick={() => setShowAnnouncementCenter(true)}
              className="relative flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all"
              style={{
                background: 'rgba(255,255,255,0.35)',
                backdropFilter: 'blur(24px) saturate(180%)',
                border: '1px solid rgba(255,255,255,0.45)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              }}
            >
              <span className="text-xl">🔔</span>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow-lg">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
          </div>
        </header>

        {/* Important Announcements */}
        {announcements.length > 0 && (
          <div className="mb-8 space-y-4">
            <h2 className="text-[17px] font-[600] text-[#1C1C1E] mb-4" style={{ fontFamily: 'SF Pro, -apple-system, sans-serif' }}>📣 Important Updates</h2>
            {announcements.map((announcement) => (
              <AnnouncementCard
                key={announcement._id}
                announcement={announcement}
                onRead={handleReadAnnouncement}
                onDismiss={handleDismissAnnouncement}
                compact
              />
            ))}
          </div>
        )}

        {/* Liquid Glass Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <AnimatedGlassCard key={stat.label} delay={index * 0.05} depth="shallow">
              <div className="text-center">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-2xl lg:text-3xl font-bold text-[#1C1C1E] mb-1">
                  {stat.value}
                </div>
                <div className="text-xs text-[#1C1C1E]/60 font-semibold">{stat.label}</div>
              </div>
            </AnimatedGlassCard>
          ))}
        </div>

        {/* Water Intake & Today's Workout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
          {/* Liquid Glass Water Intake */}
          <AnimatedGlassCard delay={0.2}>
            <div className="text-center mb-5">
              <div className="text-5xl mb-3">💧</div>
              <div className="text-3xl lg:text-4xl font-bold text-[#1C1C1E] mb-2">
                {waterIntake} ml
              </div>
              <div className="text-sm text-[#1C1C1E]/60 font-semibold">Goal: {waterGoal} ml</div>
            </div>

            <div className="relative h-3 bg-white/40 rounded-full overflow-hidden mb-4">
              <div 
                className="h-full bg-[#7AA7FF] rounded-full transition-all duration-300"
                style={{ width: `${Math.min((waterIntake / waterGoal) * 100, 100)}%` }}
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <MotionButton variant="secondary" size="sm" onClick={() => addWater(250)}>+250ml</MotionButton>
              <MotionButton variant="primary" size="sm" onClick={() => addWater(500)}>+500ml</MotionButton>
              <MotionButton variant="ghost" size="sm" onClick={async () => {
                try {
                  const token = localStorage.getItem('authToken') || localStorage.getItem('token');
                  if (token) {
                    const response = await fetch('/api/user/water-intake', {
                      method: 'POST',
                      headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({ amount: -waterIntake }),
                    });
                    const data = await response.json();
                    if (data.success) {
                      setWaterIntake(data.dailyWaterIntake || 0);
                    } else {
                      setWaterIntake(0);
                    }
                  } else {
                    setWaterIntake(0);
                  }
                } catch (error) {
                  console.error('Failed to reset water:', error);
                  setWaterIntake(0);
                }
              }}>Reset</MotionButton>
            </div>
          </AnimatedGlassCard>

          {/* Today's Workout */}
          <AnimatedGlassCard delay={0.25}>
            <h3 className="text-sm font-semibold text-[#1C1C1E] mb-3 flex items-center gap-2">
              <span className="text-lg">🏋️</span>
              Today's Workout
            </h3>
            <div className="space-y-2">
              {workouts.map((workout, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/60">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${workout.completed ? 'bg-[#9EF5C2]/40' : 'bg-[#7AA7FF]/20'}`}>
                      <span className="text-lg">{workout.completed ? '✅' : '💪'}</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-[#1C1C1E]">{workout.name}</h4>
                      <p className="text-[11px] text-[#1C1C1E]/50">{workout.time} • {workout.duration} mins</p>
                    </div>
                  </div>
                  {!workout.completed && (
                    <MotionButton variant="primary" size="sm" onClick={() => startWorkout(workout)}>Start</MotionButton>
                  )}
                </div>
              ))}
            </div>
          </AnimatedGlassCard>
        </div>

        {/* Weekly Progress */}
        <AnimatedGlassCard delay={0.3}>
          <h3 className="text-sm font-semibold text-[#1C1C1E] mb-3">Weekly Progress</h3>
          <div className="grid grid-cols-7 gap-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
              const todayIndex = new Date().getDay();
              const adjustedToday = todayIndex === 0 ? 6 : todayIndex - 1;
              const isToday = index === adjustedToday;
              const isPast = index < adjustedToday;
              return (
                <div
                  key={day}
                  className={`py-2 px-1 rounded-xl text-center ${
                    isToday 
                      ? 'bg-[#7AA7FF] text-white' 
                      : isPast 
                        ? 'bg-[#9EF5C2]/30 text-[#1C1C1E]/70' 
                        : 'bg-white/40 text-[#1C1C1E]/40'
                  }`}>
                  <div className="text-[9px] font-medium mb-0.5 opacity-80">{day}</div>
                  <div className="text-sm font-medium">{isPast || isToday ? '✓' : '○'}</div>
                </div>
              );
            })}
          </div>
        </AnimatedGlassCard>
      </div>

      {/* Workout Timer Modal */}
      <WorkoutTimer
        isOpen={showTimer}
        onClose={completeWorkout}
        workoutName={activeWorkout?.name || 'Workout'}
        duration={activeWorkout?.duration || 30}
      />

      {/* Announcement Center Modal */}
      <AnnouncementCenter 
        isOpen={showAnnouncementCenter} 
        onClose={() => {
          setShowAnnouncementCenter(false);
          fetchAnnouncements();
        }} 
      />
    </div>
  );
}

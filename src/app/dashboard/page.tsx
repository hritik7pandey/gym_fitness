'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AnimatedGlassCard from '@/components/ui/AnimatedGlassCard';
import MotionButton from '@/components/ui/MotionButton';
import WorkoutTimer from '@/components/workout/WorkoutTimer';
import AnnouncementCard from '@/components/announcements/AnnouncementCard';
import AnnouncementCenter from '@/components/announcements/AnnouncementCenter';

interface Workout {
  name: string;
  time: string;
  duration: number;
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
  const router = useRouter();

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
  const [hasHubAccess, setHasHubAccess] = useState(false);

  const startWorkout = (workout: Workout) => {
    setActiveWorkout(workout);
    setShowTimer(true);
  };

  const completeWorkout = () => {
    if (activeWorkout) {
      setWorkouts(workouts.map(w =>
        w.name === activeWorkout.name ? { ...w, completed: true } : w
      ));
      setShowTimer(false);
      setActiveWorkout(null);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchUserData();
    fetchAnnouncements();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('/api/users/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success && data.user) {
        setUserData(data.user);
        setWaterIntake(data.user.waterIntakeToday || 0);
        
        // Check if user has hub access or is admin
        const hasAccess = data.user.role === 'admin' || (
          data.user.hasPremiumHubAccess && 
          (!data.user.premiumHubAccessEndDate || new Date(data.user.premiumHubAccessEndDate) > new Date())
        );
        setHasHubAccess(hasAccess);
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('/api/announcements', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success && data.announcements) {
        setAnnouncements(data.announcements);
        const unread = data.announcements.filter((a: Announcement) => !a.isRead).length;
        setUnreadCount(unread);
      }
    } catch (error) {
      console.error('Failed to fetch announcements:', error);
    }
  };

  const addWater = (amount: number) => {
    const newIntake = Math.min(waterIntake + amount, waterGoal);
    setWaterIntake(newIntake);
  };

  const stats = hasHubAccess 
    ? [
        { label: 'Workouts', value: workouts.filter(w => w.completed).length, icon: '💪', locked: false },
        { label: 'Calories', value: '420', icon: '🔥', locked: false },
        { label: 'Streak', value: userData?.attendanceStreak || '0', icon: '⚡', locked: false },
        { label: 'Minutes', value: '45', icon: '⏱️', locked: false },
      ]
    : [
        { label: 'Workouts', value: '🔒', icon: '💪', locked: true },
        { label: 'Calories', value: '🔒', icon: '🔥', locked: true },
        { label: 'Streak', value: '🔒', icon: '⚡', locked: true },
        { label: 'Minutes', value: '🔒', icon: '⏱️', locked: true },
      ];

  if (!mounted) return null;

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #2d3748 0%, #1a202c 30%, #2d3748 60%, #1a202c 100%)' }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-8%] left-[-4%] w-[500px] h-[500px] rounded-full opacity-30 animate-float" style={{ background: 'radial-gradient(circle, rgba(185, 215, 255, 0.6) 0%, rgba(216, 199, 255, 0.3) 60%, transparent 100%)', filter: 'blur(48px)' }} />
        <div className="absolute bottom-[-10%] right-[-4%] w-[600px] h-[600px] rounded-full opacity-25 animate-float" style={{ background: 'radial-gradient(circle, rgba(166, 241, 255, 0.5) 0%, rgba(229, 225, 255, 0.25) 60%, transparent 100%)', filter: 'blur(48px)', animationDelay: '2s' }} />
      </div>

      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 lg:pb-8 space-y-5">
        {/* Premium Hub Access Banner */}
        {!hasHubAccess && userData && userData.role !== 'admin' && (
          <AnimatedGlassCard delay={0.1}>
            <div className="p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-2 border-purple-400/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">🚀</div>
                  <div>
                    <h3 className="font-bold text-white">Unlock Full Access</h3>
                    <p className="text-sm text-gray-300">
                      Get Premium Hub Access for workout tracking, nutrition, and more
                    </p>
                  </div>
                </div>
                <MotionButton
                  variant="primary"
                  onClick={() => router.push('/settings?tab=membership')}
                  className="whitespace-nowrap"
                >
                  ₹199/month
                </MotionButton>
              </div>
            </div>
          </AnimatedGlassCard>
        )}

        <header className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-white">Dashboard</h2>
            <p className="text-gray-300 mt-1">Welcome back, {userData?.name || 'User'}!</p>
          </div>
          <button
            onClick={() => setShowAnnouncementCenter(true)}
            className="relative p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        </header>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <AnimatedGlassCard 
              key={stat.label} 
              delay={index * 0.05} 
              depth="shallow"
              className={stat.locked ? 'opacity-60 cursor-not-allowed' : ''}
            >
              <div className="text-center">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-2xl lg:text-3xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-xs text-gray-300 font-semibold">{stat.label}</div>
              </div>
            </AnimatedGlassCard>
          ))}
        </div>

        {userData && (
          <AnimatedGlassCard delay={0.2}>
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span>💳</span>
                Membership Status
              </h3>
              {userData.membershipType && userData.membershipType !== 'None' ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Current Plan:</span>
                    <span className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold">
                      {userData.membershipType}
                    </span>
                  </div>
                  {userData.membershipStartDate && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Start Date:</span>
                      <span className="text-white">{new Date(userData.membershipStartDate).toLocaleDateString()}</span>
                    </div>
                  )}
                  {userData.membershipEndDate && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">End Date:</span>
                      <span className="text-white">{new Date(userData.membershipEndDate).toLocaleDateString()}</span>
                    </div>
                  )}
                  <MotionButton
                    variant="primary"
                    onClick={() => router.push('/plans')}
                    className="w-full mt-4"
                  >
                    Upgrade Membership
                  </MotionButton>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-300 mb-4">No active membership</p>
                  <MotionButton
                    variant="primary"
                    onClick={() => router.push('/plans')}
                    className="w-full"
                  >
                    View Plans
                  </MotionButton>
                </div>
              )}
            </div>
          </AnimatedGlassCard>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Water Intake - Free for all users */}
          <AnimatedGlassCard delay={0.3}>
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span>💧</span>
                Water Intake
              </h3>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-300">{waterIntake}ml</span>
                  <span className="text-gray-300">{waterGoal}ml</span>
                </div>
                <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 transition-all duration-500"
                    style={{ width: `${(waterIntake / waterGoal) * 100}%` }}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => addWater(250)}
                  className="flex-1 px-4 py-2 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition-all"
                >
                  +250ml
                </button>
                <button
                  onClick={() => addWater(500)}
                  className="flex-1 px-4 py-2 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition-all"
                >
                  +500ml
                </button>
              </div>
            </div>
          </AnimatedGlassCard>

          <AnimatedGlassCard delay={0.4}>
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span>🏋️</span>
                Today's Workouts
              </h3>
              {hasHubAccess ? (
                <div className="space-y-3">
                  {workouts.map((workout, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all"
                    >
                      <div>
                        <p className="font-medium text-white">{workout.name}</p>
                        <p className="text-sm text-gray-300">{workout.time} • {workout.duration} min</p>
                      </div>
                      {workout.completed ? (
                        <span className="text-green-400">✓</span>
                      ) : (
                        <button
                          onClick={() => startWorkout(workout)}
                          className="px-3 py-1 rounded-lg bg-blue-500 text-white text-sm hover:bg-blue-600 transition-all"
                        >
                          Start
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-5xl mb-3">🔒</div>
                  <p className="text-gray-300 mb-4 text-sm">
                    Workout tracking requires<br />
                    <strong className="text-white">Premium Hub Access</strong>
                  </p>
                  <MotionButton
                    variant="primary"
                    onClick={() => router.push('/settings?tab=membership')}
                    className="w-full"
                  >
                    Upgrade - ₹199/month
                  </MotionButton>
                </div>
              )}
            </div>
          </AnimatedGlassCard>
        </div>

        {announcements.length > 0 && (
          <AnimatedGlassCard delay={0.5}>
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span>📢</span>
                Latest Announcements
              </h3>
              <div className="space-y-3">
                {announcements.slice(0, 3).map((announcement) => (
                  <AnnouncementCard
                    key={announcement._id}
                    announcement={announcement}
                    onRead={() => { }}
                    onDismiss={() => { }}
                  />
                ))}
              </div>
            </div>
          </AnimatedGlassCard>
        )}
      </section>

      {showTimer && activeWorkout && (
        <WorkoutTimer
          workout={activeWorkout}
          onComplete={completeWorkout}
          onClose={() => setShowTimer(false)}
        />
      )}

      {showAnnouncementCenter && (
        <AnnouncementCenter
          announcements={announcements}
          onClose={() => setShowAnnouncementCenter(false)}
          onRefresh={fetchAnnouncements}
        />
      )}
    </div>
  );
}

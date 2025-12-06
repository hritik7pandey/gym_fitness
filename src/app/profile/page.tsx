"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from '@/lib/motion';
import UserAvatar from '../../components/ui/UserAvatar';
import AnimatedGlassCard from '@/components/ui/AnimatedGlassCard';
import MotionButton from '@/components/ui/MotionButton';

export default function ProfilePage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    membershipType: 'Premium',
    joinDate: '2024-01-15',
    height: '180 cm',
    weight: '75 kg',
    age: '28',
    goal: 'Build Muscle'
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        router.push('/auth/signin');
        return;
      }

      const response = await fetch('/api/user/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.user) {
          setProfile({
            name: data.user.name || 'User',
            email: data.user.email || '',
            membershipType: data.user.membershipType || 'Basic',
            joinDate: data.user.createdAt ? new Date(data.user.createdAt).toLocaleDateString() : '2024-01-15',
            height: data.user.height ? `${data.user.height} cm` : '170 cm',
            weight: data.user.weight ? `${data.user.weight} kg` : '70 kg',
            age: data.user.age ? `${data.user.age}` : '25',
            goal: (data.user.goals && data.user.goals[0]) || 'General Fitness'
          });
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('Please login again');
        router.push('/login');
        return;
      }

      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: profile.name,
          height: parseFloat(profile.height.replace(/[^0-9.]/g, '')) || undefined,
          weight: parseFloat(profile.weight.replace(/[^0-9.]/g, '')) || undefined,
          age: parseInt(profile.age.replace(/[^0-9]/g, '')) || undefined,
          goals: [profile.goal],
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('✅ Profile updated successfully!');
        setIsEditing(false);
        fetchProfile();
      } else {
        alert(`❌ ${data.message || 'Failed to update profile'}`);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('An error occurred while updating profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #2d3748 0%, #1a202c 30%, #2d3748 60%, #1a202c 100%)' }}>
      {/* iOS 26 Ambient Glow Blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-8%] right-[-4%] w-[500px] h-[500px] rounded-full opacity-30 animate-float" style={{ background: 'radial-gradient(circle, rgba(185, 215, 255, 0.6) 0%, rgba(216, 199, 255, 0.3) 60%, transparent 100%)', filter: 'blur(48px)' }} />
        <div className="absolute bottom-[-10%] left-[-4%] w-[600px] h-[600px] rounded-full opacity-25 animate-float" style={{ background: 'radial-gradient(circle, rgba(166, 241, 255, 0.5) 0%, rgba(229, 225, 255, 0.25) 60%, transparent 100%)', filter: 'blur(48px)', animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] rounded-full opacity-20 animate-float" style={{ background: 'radial-gradient(circle, rgba(216, 199, 255, 0.4) 0%, rgba(185, 215, 255, 0.2) 60%, transparent 100%)', filter: 'blur(48px)', animationDelay: '4s' }} />
      </div>

      <section aria-label="User profile" className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 lg:pb-8 space-y-5">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <h2 className="text-[32px] lg:text-[40px] font-[800] text-gray-100" style={{ fontFamily: 'SF Pro Display, -apple-system, sans-serif' }}>
            Profile
          </h2>
          <MotionButton
            variant={isEditing ? "primary" : "secondary"}
            onClick={() => {
              if (isEditing) {
                handleSave();
              } else {
                setIsEditing(true);
              }
            }}
          >
            {loading ? 'Saving...' : isEditing ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Save Changes
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                Edit Profile
              </>
            )}
          </MotionButton>
        </motion.header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <AnimatedGlassCard delay={0.2} depth="deep">
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3, type: 'spring' }}
                  className="flex justify-center mb-5">
                  <div className="relative">
                    <UserAvatar name={profile.name} size={96} />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"
                    />
                  </div>
                </motion.div>
                <h3 className="text-2xl font-bold text-white mb-2">{profile.name}</h3>
                <p className="text-sm text-gray-400 mb-4">{profile.email}</p>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="inline-flex px-5 py-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium shadow-lg">
                  ⭐ {profile.membershipType} Member
                </motion.div>
                <div className="mt-6 pt-6 border-t border-gray-200/50 space-y-4">
                  {[
                    { label: 'Member Since', value: profile.joinDate, icon: '📅' },
                    { label: 'Goal', value: profile.goal, icon: '🎯' }
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
                      className="flex justify-between items-center text-sm">
                      <span className="text-white/70 flex items-center gap-2">
                        <span>{item.icon}</span>
                        {item.label}
                      </span>
                      <span className="font-semibold text-white/90">{item.value}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </AnimatedGlassCard>
          </div>

          {/* Details & Stats */}
          <div className="lg:col-span-2 space-y-5 lg:space-y-6">
            {/* Personal Info */}
            <AnimatedGlassCard delay={0.5}>
              <h3 className="text-2xl font-bold text-white mb-2">Personal Information</h3>
              <p className="text-sm text-gray-400 mb-4">Update your details</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Height</label>
                  <input
                    type="text"
                    value={profile.height}
                    onChange={(e) => setProfile({ ...profile, height: e.target.value })}
                    disabled={!isEditing}
                    style={{
                      background: 'rgba(255,255,255,0.4)',
                      backdropFilter: 'blur(40px) saturate(180%)',
                      border: '1px solid rgba(255,255,255,0.5)'
                    }}
                    className="w-full px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-iosBlue/50 text-sm disabled:opacity-60 shadow-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Weight</label>
                  <input
                    type="text"
                    value={profile.weight}
                    onChange={(e) => setProfile({ ...profile, weight: e.target.value })}
                    disabled={!isEditing}
                    style={{
                      background: 'rgba(255,255,255,0.4)',
                      backdropFilter: 'blur(40px) saturate(180%)',
                      border: '1px solid rgba(255,255,255,0.5)'
                    }}
                    className="w-full px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-iosBlue/50 text-sm disabled:opacity-60 shadow-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Age</label>
                  <input
                    type="text"
                    value={profile.age}
                    onChange={(e) => setProfile({ ...profile, age: e.target.value })}
                    disabled={!isEditing}
                    style={{
                      background: 'rgba(255,255,255,0.4)',
                      backdropFilter: 'blur(40px) saturate(180%)',
                      border: '1px solid rgba(255,255,255,0.5)'
                    }}
                    className="w-full px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-iosBlue/50 text-sm disabled:opacity-60 shadow-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Fitness Goal</label>
                  <select
                    value={profile.goal}
                    onChange={(e) => setProfile({ ...profile, goal: e.target.value })}
                    disabled={!isEditing}
                    style={{
                      background: 'rgba(255,255,255,0.4)',
                      backdropFilter: 'blur(40px) saturate(180%)',
                      border: '1px solid rgba(255,255,255,0.5)'
                    }}
                    className="w-full px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-iosBlue/50 text-sm disabled:opacity-60 shadow-lg"
                  >
                    <option>Build Muscle</option>
                    <option>Lose Weight</option>
                    <option>Maintain Fitness</option>
                    <option>Improve Endurance</option>
                  </select>
                </div>
              </div>
            </AnimatedGlassCard>

            {/* Stats */}
            <AnimatedGlassCard delay={0.6}>
              <h3 className="text-2xl font-bold text-white mb-2">Your Stats 📊</h3>
              <p className="text-sm text-gray-400 mb-4">Progress overview</p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                {[
                  { label: 'Total Workouts', value: '42', color: 'text-iosBlue' },
                  { label: 'Current Streak', value: '12 days', color: 'text-iosCyan' },
                  { label: 'Calories Burned', value: '8,450', color: 'text-iosPurple' },
                  { label: 'Minutes Active', value: '1,260', color: 'text-iosRed' }
                ].map((stat) => (
                  <div
                    key={stat.label}
                    style={{
                      background: 'rgba(255,255,255,0.35)',
                      backdropFilter: 'blur(40px) saturate(180%)',
                      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.7), 0 8px 32px rgba(0,0,0,0.06)'
                    }}
                    className="text-center p-4 rounded-2xl border border-white/50">
                    <div className={`text-2xl lg:text-3xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
                    <div className="text-xs text-white/60">{stat.label}</div>
                  </div>
                ))}
              </div>
            </AnimatedGlassCard>

            {/* Achievements */}
            <AnimatedGlassCard delay={0.7}>
              <h3 className="text-2xl font-bold text-white mb-2">Achievements 🏆</h3>
              <p className="text-sm text-gray-400 mb-4">Unlock more badges</p>
              <div className="grid grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4 mt-4">
                {['🏆', '🔥', '💪', '⚡', '🎯', '🌟'].map((emoji, i) => (
                  <div
                    key={i}
                    style={{
                      background: 'rgba(255,255,255,0.35)',
                      backdropFilter: 'blur(40px) saturate(180%)',
                      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.7), 0 8px 32px rgba(0,0,0,0.06)'
                    }}
                    className="aspect-square rounded-2xl border border-white/50 flex items-center justify-center text-3xl lg:text-4xl hover:scale-110 transition-transform cursor-pointer"
                  >
                    {emoji}
                  </div>
                ))}
              </div>
            </AnimatedGlassCard>
          </div>
        </div>

        {/* Settings - Quick Access */}
        <div className="mt-8">
          <AnimatedGlassCard delay={0.8}>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
              <div>
                <h3 className="text-2xl font-bold text-white">Account Settings ⚙️</h3>
                <p className="text-sm text-gray-400 mt-1">Manage your account and preferences</p>
              </div>
              <Link
                href="/settings"
                className="px-6 py-3 glass-chip-active text-white font-bold shadow-neon-blue hover:shadow-neon-strong transition-all text-center"
              >
                Open Settings
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Link
                href="/settings?tab=password"
                className="p-4 glass-chip text-left hover:scale-105 transition-all group">
                <div className="text-2xl mb-2">🔒</div>
                <div className="font-semibold text-gray-200 text-sm lg:text-base mb-1 group-hover:gradient-title transition-all">Password</div>
                <div className="text-xs text-gray-400">Change password</div>
              </Link>
              <Link
                href="/settings?tab=membership"
                className="p-4 glass-chip text-left hover:scale-105 transition-all group">
                <div className="text-2xl mb-2">💳</div>
                <div className="font-semibold text-gray-200 text-sm lg:text-base mb-1 group-hover:gradient-title transition-all">Membership</div>
                <div className="text-xs text-gray-400">View & upgrade</div>
              </Link>
              <Link
                href="/settings?tab=notifications"
                className="p-4 glass-chip text-left hover:scale-105 transition-all group">
                <div className="text-2xl mb-2">🔔</div>
                <div className="font-semibold text-gray-200 text-sm lg:text-base mb-1 group-hover:gradient-title transition-all">Notifications</div>
                <div className="text-xs text-gray-400">Email & alerts</div>
              </Link>
              <Link
                href="/settings?tab=account"
                className="p-4 glass-chip text-left hover:scale-105 transition-all group">
                <div className="text-2xl mb-2">👤</div>
                <div className="font-semibold text-gray-200 text-sm lg:text-base mb-1 group-hover:gradient-title transition-all">Account Info</div>
                <div className="text-xs text-gray-400">Update details</div>
              </Link>
            </div>
          </AnimatedGlassCard>
        </div>
      </section>
    </div>
  );
}

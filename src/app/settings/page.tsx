'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  membershipType: string;
  membershipExpiry: string;
  joinDate: string;
}

function SettingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<'account' | 'password' | 'membership' | 'notifications'>('account');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
  // Set active tab from URL query parameter
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['account', 'password', 'membership', 'notifications'].includes(tab)) {
      setActiveTab(tab as any);
    }
  }, [searchParams]);
  
  // Account Info
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    phone: '',
    membershipType: 'basic',
    membershipExpiry: '',
    joinDate: ''
  });

  // Password Change
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Notifications
  const [notifications, setNotifications] = useState({
    emailWorkouts: true,
    emailAnnouncements: true,
    emailDiet: true,
    pushWorkouts: true,
    pushAnnouncements: false,
    pushDiet: true
  });

  useEffect(() => {
    fetchProfile();
    fetchNotifications();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      const response = await fetch('/api/user/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const result = await response.json();
        const user = result.user || result;
        console.log('Fetched user data:', user);
        console.log('Phone from API:', user.phone);
        setProfile({
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || '',
          membershipType: user.membershipType?.toLowerCase() || 'basic',
          membershipExpiry: user.membershipEndDate || user.membershipExpiry || '',
          joinDate: user.createdAt || ''
        });
      } else {
        console.error('Failed to fetch profile:', response.status);
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/user/notifications');
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || notifications);
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: profile.name,
          phone: profile.phone
        })
      });

      if (response.ok) {
        setSuccess('Profile updated successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to update profile');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      setLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      if (response.ok) {
        setSuccess('Password changed successfully!');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to change password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpgradeMembership = async (newType: string) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/user/upgrade-membership', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ membershipType: newType })
      });

      if (response.ok) {
        setSuccess('Membership upgrade request submitted!');
        fetchProfile();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to upgrade membership');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotifications = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/user/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notifications })
      });

      if (response.ok) {
        setSuccess('Notification preferences saved!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to save preferences');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'account' as const, label: 'Account Info', icon: '👤' },
    { id: 'password' as const, label: 'Password', icon: '🔒' },
    { id: 'membership' as const, label: 'Membership', icon: '💳' },
    { id: 'notifications' as const, label: 'Notifications', icon: '🔔' }
  ];

  const membershipTypes = [
    { 
      id: 'basic', 
      name: 'Basic', 
      price: '₹999/month',
      features: ['Access to gym equipment', 'Basic workout plans', 'Diet tracking'],
      color: 'from-gray-500 to-gray-600'
    },
    { 
      id: 'premium', 
      name: 'Premium', 
      price: '₹1,999/month',
      features: ['Everything in Basic', 'Personal trainer sessions', 'Advanced analytics', 'Priority support'],
      color: 'from-blue-500 to-indigo-600'
    },
    { 
      id: 'vip', 
      name: 'VIP', 
      price: '₹3,999/month',
      features: ['Everything in Premium', 'Unlimited trainer access', 'Nutrition consultation', 'Exclusive classes'],
      color: 'from-purple-500 to-pink-600'
    }
  ];

  return (
    <div className="min-h-screen py-6 px-4 lg:py-12 lg:px-8 pb-40 lg:pb-12" style={{ background: 'linear-gradient(135deg, rgba(240, 244, 255, 0.4) 0%, rgba(232, 236, 255, 0.3) 50%, rgba(221, 226, 255, 0.4) 100%)' }}>
      <div className="max-w-6xl mx-auto">
        {/* Header with Glassmorphic Card */}
        <div className="mb-6 lg:mb-8">
          <Link 
            href="/profile"
            className="inline-flex items-center gap-2 px-4 py-2 mb-4 glass-chip text-gray-700 hover:text-gray-900 font-semibold transition-all hover:scale-105"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Profile
          </Link>
          
          <div className="glass-panel p-5 lg:p-8">
            <div className="flex items-center gap-3 lg:gap-4 mb-2">
              <div className="w-11 h-11 lg:w-12 lg:h-12 glass-chip-active rounded-2xl flex items-center justify-center text-xl lg:text-2xl shadow-neon-blue">
                ⚙️
              </div>
              <h1 className="gradient-title text-2xl lg:text-5xl">
                Account Settings
              </h1>
            </div>
            <p className="text-gray-600 text-sm lg:text-lg ml-14 lg:ml-16">Manage your account preferences and security</p>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 p-5 glass-chip border-2 border-green-400/50 bg-gradient-to-r from-green-50/80 to-emerald-50/80 backdrop-blur-xl animate-in slide-in-from-top">
            <p className="text-green-700 font-bold flex items-center gap-3 text-lg">
              <span className="text-2xl">✓</span> {success}
            </p>
          </div>
        )}
        {error && (
          <div className="mb-6 p-5 glass-chip border-2 border-red-400/50 bg-gradient-to-r from-red-50/80 to-rose-50/80 backdrop-blur-xl animate-in slide-in-from-top">
            <p className="text-red-700 font-bold flex items-center gap-3 text-lg">
              <span className="text-2xl">⚠</span> {error}
            </p>
          </div>
        )}

        {/* Mobile Tabs - Enhanced Dropdown */}
        <div className="lg:hidden mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-2xl">
              {tabs.find(t => t.id === activeTab)?.icon}
            </div>
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value as any)}
              className="w-full rounded-3xl py-5 pl-16 pr-14 font-bold text-lg appearance-none cursor-pointer focus:ring-2 focus:ring-blue-500/50 transition-all shadow-lg backdrop-blur-xl text-gray-800"
              style={{
                background: 'rgba(255, 255, 255, 0.25)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 8px 32px rgba(99, 102, 241, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236366f1'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 1.5rem center',
                backgroundSize: '1.5rem'
              }}
            >
              {tabs.map(tab => (
                <option key={tab.id} value={tab.id} style={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', padding: '12px', borderRadius: '12px' }}>
                  {tab.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Desktop Sidebar Tabs - Enhanced */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="glass-panel sticky top-24 p-4">
              <nav className="space-y-2">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left px-6 py-4 rounded-2xl font-bold text-base transition-all duration-300 transform ${
                      activeTab === tab.id
                        ? 'glass-chip-active text-white shadow-neon-blue scale-105'
                        : 'glass-chip text-gray-700 hover:bg-white/50 hover:scale-102'
                    }`}
                  >
                    <span className="text-2xl mr-3">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content Area - Enhanced */}
          <div className="lg:col-span-9">
            <div className="glass-panel p-6 lg:p-10 min-h-[500px]">
              
              {/* Account Info Tab */}
              {activeTab === 'account' && (
                <div className="animate-in fade-in slide-in-from-right duration-300">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-14 h-14 glass-chip-active rounded-2xl flex items-center justify-center text-3xl shadow-neon-blue">
                      👤
                    </div>
                    <h2 className="gradient-title text-3xl font-bold">Account Information</h2>
                  </div>
                  <form onSubmit={handleUpdateProfile} className="space-y-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                        <span className="text-lg">👨</span>
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        className="w-full glass-input py-4 px-5 text-lg font-semibold focus:ring-2 focus:ring-blue-500/50 transition-all"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                        <span className="text-lg">📧</span>
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={profile.email}
                        className="w-full glass-input py-4 px-5 text-lg font-semibold bg-gray-100/50 cursor-not-allowed opacity-75"
                        disabled
                      />
                      <p className="text-xs text-gray-500 ml-1 flex items-center gap-1">
                        <span>🔒</span> Email cannot be changed for security reasons
                      </p>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                        <span className="text-lg">📱</span>
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        className="w-full glass-input py-4 px-5 text-lg font-semibold focus:ring-2 focus:ring-blue-500/50 transition-all"
                        placeholder="+91 98765 43210"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Member Since
                        </label>
                        <div className="glass-chip py-4 px-5 text-base font-bold text-gray-700 flex items-center gap-2">
                          <span>📅</span>
                          {profile.joinDate ? new Date(profile.joinDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Current Plan
                        </label>
                        <div className="glass-chip-active py-4 px-5 text-base text-white capitalize font-bold flex items-center gap-2 shadow-neon-blue">
                          <span>💎</span>
                          {profile.membershipType}
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full lg:w-auto px-10 py-4 glass-chip-active text-white font-bold text-lg shadow-neon-blue hover:shadow-neon-strong transition-all disabled:opacity-50 hover:scale-105"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="glass-spinner w-5 h-5"></span>
                          Saving...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <span>💾</span>
                          Save Changes
                        </span>
                      )}
                    </button>
                  </form>
                </div>
              )}

              {/* Password Tab */}
              {activeTab === 'password' && (
                <div className="animate-in fade-in slide-in-from-right duration-300">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-14 h-14 glass-chip-active rounded-2xl flex items-center justify-center text-3xl shadow-neon-blue">
                      🔒
                    </div>
                    <h2 className="gradient-title text-3xl font-bold">Change Password</h2>
                  </div>
                  <form onSubmit={handleChangePassword} className="space-y-6 max-w-2xl">
                    <div className="p-6 glass-chip border-2 border-blue-300/30 bg-blue-50/30">
                      <p className="text-sm text-gray-700 font-semibold flex items-center gap-2">
                        <span className="text-xl">🛡️</span>
                        Keep your account secure with a strong password
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        className="w-full glass-input py-4 px-5 text-lg font-semibold focus:ring-2 focus:ring-blue-500/50 transition-all"
                        placeholder="Enter current password"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        className="w-full glass-input py-4 px-5 text-lg font-semibold focus:ring-2 focus:ring-blue-500/50 transition-all"
                        placeholder="Enter new password"
                        required
                        minLength={8}
                      />
                      <p className="text-xs text-gray-600 ml-1 flex items-center gap-1">
                        <span>ℹ️</span> Minimum 8 characters required
                      </p>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        className="w-full glass-input py-4 px-5 text-lg font-semibold focus:ring-2 focus:ring-blue-500/50 transition-all"
                        placeholder="Re-enter new password"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full lg:w-auto px-10 py-4 glass-chip-active text-white font-bold text-lg shadow-neon-blue hover:shadow-neon-strong transition-all disabled:opacity-50 hover:scale-105"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="glass-spinner w-5 h-5"></span>
                          Changing...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <span>🔑</span>
                          Change Password
                        </span>
                      )}
                    </button>
                  </form>
                </div>
              )}

              {/* Membership Tab */}
              {activeTab === 'membership' && (
                <div className="animate-in fade-in slide-in-from-right duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-14 h-14 glass-chip-active rounded-2xl flex items-center justify-center text-3xl shadow-neon-blue">
                      💳
                    </div>
                    <div>
                      <h2 className="gradient-title text-3xl font-bold">Membership Management</h2>
                      <p className="text-gray-600 text-sm font-semibold mt-1">
                        Current: <span className="capitalize text-blue-600">{profile.membershipType}</span>
                        {profile.membershipExpiry && (
                          <> · Expires: <span className="text-gray-700">{new Date(profile.membershipExpiry).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span></>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
                    {membershipTypes.map(type => (
                      <div
                        key={type.id}
                        className={`glass-panel p-5 lg:p-6 border-2 transition-all ${
                          profile.membershipType === type.id
                            ? 'border-blue-500/50 shadow-neon-blue'
                            : 'border-white/20 hover:border-white/40'
                        }`}
                      >
                        <div className={`inline-block px-4 py-2 rounded-full bg-gradient-to-r ${type.color} text-white font-bold mb-4`}>
                          {type.name}
                        </div>
                        <div className="text-3xl font-bold text-gray-900 mb-4">
                          {type.price}
                        </div>
                        <ul className="space-y-3 mb-6">
                          {type.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                              <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              {feature}
                            </li>
                          ))}
                        </ul>
                        {profile.membershipType === type.id ? (
                          <button
                            disabled
                            className="w-full py-3 glass-chip text-gray-900 font-semibold cursor-not-allowed"
                          >
                            Current Plan
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUpgradeMembership(type.id)}
                            disabled={loading}
                            className="w-full py-3 glass-chip-active text-white font-semibold shadow-neon-blue hover:shadow-neon-strong transition-all disabled:opacity-50"
                          >
                            {profile.membershipType === 'basic' || 
                             (profile.membershipType === 'premium' && type.id === 'vip')
                              ? 'Upgrade'
                              : 'Downgrade'}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 p-6 glass-chip border-yellow-300/50 bg-yellow-50/30">
                    <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                      <span>ℹ️</span> Membership Information
                    </h3>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Upgrades take effect immediately</li>
                      <li>• Downgrades take effect at the end of current billing cycle</li>
                      <li>• Contact support for cancellations or refunds</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">🔔 Notification Preferences</h2>
                  
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Email Notifications</h3>
                      <div className="space-y-4">
                        {[
                          { key: 'emailWorkouts', label: 'Workout Reminders', desc: 'Get reminded about your scheduled workouts' },
                          { key: 'emailAnnouncements', label: 'Announcements', desc: 'Receive gym announcements and updates' },
                          { key: 'emailDiet', label: 'Diet Plans', desc: 'Get updates about your meal plans' }
                        ].map(item => (
                          <label key={item.key} className="flex items-start gap-4 p-4 glass-chip cursor-pointer hover:bg-white/40 transition-all">
                            <input
                              type="checkbox"
                              checked={notifications[item.key as keyof typeof notifications]}
                              onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                              className="w-5 h-5 mt-0.5 rounded border-2 border-gray-300"
                            />
                            <div className="flex-1">
                              <div className="font-semibold text-gray-900">{item.label}</div>
                              <div className="text-sm text-gray-600">{item.desc}</div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Push Notifications</h3>
                      <div className="space-y-4">
                        {[
                          { key: 'pushWorkouts', label: 'Workout Reminders', desc: 'Push notifications for workouts' },
                          { key: 'pushAnnouncements', label: 'Announcements', desc: 'Get instant alerts for new announcements' },
                          { key: 'pushDiet', label: 'Diet Plans', desc: 'Meal time reminders and updates' }
                        ].map(item => (
                          <label key={item.key} className="flex items-start gap-4 p-4 glass-chip cursor-pointer hover:bg-white/40 transition-all">
                            <input
                              type="checkbox"
                              checked={notifications[item.key as keyof typeof notifications]}
                              onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                              className="w-5 h-5 mt-0.5 rounded border-2 border-gray-300"
                            />
                            <div className="flex-1">
                              <div className="font-semibold text-gray-900">{item.label}</div>
                              <div className="text-sm text-gray-600">{item.desc}</div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={handleSaveNotifications}
                      disabled={loading}
                      className="px-8 py-3 glass-chip-active text-white font-bold shadow-neon-blue hover:shadow-neon-strong transition-all disabled:opacity-50"
                    >
                      {loading ? 'Saving...' : 'Save Preferences'}
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950/50 to-slate-950">
        <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <SettingsContent />
    </Suspense>
  );
}

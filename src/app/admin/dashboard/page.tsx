'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { BottomNav } from '@/components/navigation/BottomNav';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 245,
    activeToday: 89,
    newThisWeek: 12,
    totalRevenue: '$45,890',
  });

  const recentUsers = [
    { name: 'Sarah Johnson', email: 'sarah@example.com', joined: '2 days ago', status: 'active' },
    { name: 'Mike Chen', email: 'mike@example.com', joined: '3 days ago', status: 'active' },
    { name: 'Emily Davis', email: 'emily@example.com', joined: '5 days ago', status: 'pending' },
  ];

  const systemStats = [
    { label: 'Total Users', value: '245', icon: '👥', change: '+12%', color: 'text-iosBlue' },
    { label: 'Active Today', value: '89', icon: '🟢', change: '+5%', color: 'text-green-500' },
    { label: 'Workouts Assigned', value: '423', icon: '💪', change: '+18%', color: 'text-iosPurple' },
    { label: 'Diet Plans', value: '189', icon: '🥗', change: '+8%', color: 'text-iosCyan' },
  ];

  const quickActions = [
    { label: 'Add New User', icon: '➕', href: '/admin/users/new', color: 'bg-iosBlue' },
    { label: 'Assign Workout', icon: '💪', href: '/admin/workouts/assign', color: 'bg-iosPurple' },
    { label: 'Create Diet Plan', icon: '🥗', href: '/admin/diet/create', color: 'bg-green-500' },
    { label: 'Export Data', icon: '📊', href: '/admin/reports', color: 'bg-iosCyan' },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #2d3748 0%, #1a202c 100%)' }}>
      {/* Dark Theme Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-8%] right-[-4%] w-[500px] h-[500px] rounded-full opacity-20 animate-float" style={{ background: 'radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, rgba(59, 130, 246, 0.2) 60%, transparent 100%)', filter: 'blur(60px)' }}></div>
        <div className="absolute bottom-[-10%] left-[-4%] w-[600px] h-[600px] rounded-full opacity-15 animate-float" style={{ background: 'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, rgba(124, 58, 237, 0.2) 60%, transparent 100%)', filter: 'blur(60px)', animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 relative z-10">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-[32px] lg:text-[40px] font-[800] text-gray-100" style={{ fontFamily: 'SF Pro Display, -apple-system, sans-serif' }}>
                Admin Dashboard
              </h1>
              <p className="text-[15px] lg:text-[17px] font-[600] text-gray-300 mt-1" style={{ fontFamily: 'SF Pro, -apple-system, sans-serif' }}>Manage your fitness hub</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => {
                  alert('🔔 Notifications (3 new)\n\n1. 🆕 New user registered: Priya Sharma\n2. ⚠️ Payment pending: Rahul Kumar\n3. 🎯 Milestone: 500 workouts completed today!\n\nNotification center coming soon!');
                }}
                className="p-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-all relative cursor-pointer"
                aria-label="Notifications"
              >
                <span className="text-2xl">🔔</span>
                <span className="absolute top-1 right-1 w-3 h-3 bg-iosRed rounded-full"></span>
              </button>
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {systemStats.map((stat, index) => (
            <div key={index} className="glass-card p-6 hover:shadow-depth transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-4xl">{stat.icon}</span>
                <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-green-100/80 text-green-700 border border-green-200/50">
                  {stat.change}
                </span>
              </div>
              <div className={`text-3xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
              <div className="text-sm text-gray-300 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="glass-card-strong p-6 mb-8">
          <h3 className="text-xl mb-4 text-gray-100 font-bold">Quick Actions</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => {
                  if (action.href === '/admin/users/new') {
                    alert('➕ Add New User\\n\\nFeatures:\\n- User registration form\\n- Assign membership plan\\n- Set fitness goals\\n- Assign trainer\\n\\nComing soon!');
                  } else if (action.href === '/admin/workouts/assign') {
                    alert('💪 Assign Workout\\n\\nFeatures:\\n- Select user\\n- Choose workout plan\\n- Set schedule\\n- Add exercises\\n\\nNavigating to workout management...');
                    window.location.href = '/admin/workouts';
                  } else if (action.href === '/admin/diet/create') {
                    alert('🥗 Create Diet Plan\\n\\nFeatures:\\n- Indian meal options\\n- Calorie calculator\\n- Macro tracking\\n- Meal timing\\n\\nNavigating to diet management...');
                    window.location.href = '/admin/diet';
                  } else if (action.href === '/admin/reports') {
                    alert('📊 Export Data\\n\\nAvailable Reports:\\n- User attendance\\n- Workout completion\\n- Revenue summary\\n- Member analytics\\n\\nExport format: CSV\\n\\nComing soon!');
                  }
                }}
                className={`w-full p-6 rounded-xl ${action.color} text-white hover:shadow-xl transition-all transform hover:scale-105 cursor-pointer`}
                aria-label={action.label}
              >
                <div className="text-4xl mb-3">{action.icon}</div>
                <div className="font-semibold">{action.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Recent Users */}
          <div className="glass-card-strong p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="gradient-title text-xl">Recent Users</h3>
              <Link href="/admin/users">
                <button className="glass-button px-4 py-2 rounded-full text-sm font-semibold">
                  View All
                </button>
              </Link>
            </div>
            <div className="space-y-3">
              {recentUsers.map((user, index) => (
                <div
                  key={index}
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    alert(`👤 User Profile: ${user.name}\n\n📧 ${user.email}\n📊 Status: ${user.status}\n📅 Joined: ${user.joined}\n\nActions:\n- View full profile\n- Edit details\n- Manage membership\n- Assign workout/diet\n\nNavigating to user management...`);
                    window.location.href = '/admin/users';
                  }}
                  className="flex items-center justify-between p-4 glass-chip hover:shadow-depth cursor-pointer transition-all"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 glass-chip-active rounded-full flex items-center justify-center text-white font-bold shadow-neon-blue">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-100">{user.name}</h4>
                      <p className="text-sm text-gray-400">{user.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${user.status === 'active' ? 'bg-green-100/80 text-green-700 border border-green-200/50' : 'bg-yellow-100/80 text-yellow-700 border border-yellow-200/50'}`}>
                      {user.status}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">{user.joined}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Activity */}
          <div className="glass-card-strong p-6">
            <h3 className="gradient-title text-xl mb-4">System Activity</h3>
            <div className="space-y-3">
              {[
                { action: 'New user registered', time: '5 minutes ago', icon: '👤' },
                { action: 'Workout plan assigned to Sarah J.', time: '15 minutes ago', icon: '💪' },
                { action: 'Diet plan updated for Mike C.', time: '1 hour ago', icon: '🥗' },
                { action: 'Attendance exported by Admin', time: '2 hours ago', icon: '📊' },
              ].map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-3 glass-chip hover:bg-white/10 transition-all"
                >
                  <div className="text-2xl">{activity.icon}</div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-100">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Analytics Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card-strong p-6">
            <h3 className="gradient-title text-xl mb-4">User Growth</h3>
            <div className="space-y-4">
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, index) => {
                const percentage = Math.floor(Math.random() * 40) + 60;
                return (
                  <div key={month}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-300">{month}</span>
                      <span className="text-sm text-iosBlue font-semibold">{percentage} users</span>
                    </div>
                    <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                      <div
                        className="h-full glass-chip-active transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="glass-card-strong p-6">
            <h3 className="gradient-title text-xl mb-4">Revenue Overview</h3>
            <div className="space-y-4">
              {[
                { plan: '3 Months', revenue: '$12,450', users: 42, color: 'bg-iosBlue' },
                { plan: '6 Months', revenue: '$18,650', users: 37, color: 'bg-iosPurple' },
                { plan: '12 Months', revenue: '$14,790', users: 16, color: 'bg-iosCyan' },
              ].map((item, index) => (
                <div key={index} className="p-4 glass-chip">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-100">{item.plan}</h4>
                      <p className="text-sm text-gray-400">{item.users} active subscriptions</p>
                    </div>
                    <div className="text-2xl font-bold text-iosBlue">{item.revenue}</div>
                  </div>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color}`} style={{ width: '75%' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
}

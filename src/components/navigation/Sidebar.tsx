'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import AnnouncementCenter from '@/components/announcements/AnnouncementCenter';

interface SidebarProps {
  role: 'user' | 'admin';
}

const userNavItems = [
  { name: 'Dashboard', href: '/dashboard', icon: '🏠' },
  { name: 'Workouts', href: '/workouts', icon: '💪' },
  { name: 'Nutrition', href: '/nutrition', icon: '🥗' },
  { name: 'Profile', href: '/profile', icon: '👤' },
];

const adminNavItems = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: '📊' },
  { name: 'Users', href: '/admin/users', icon: '👥' },
  { name: 'Workouts', href: '/admin/workouts', icon: '💪' },
  { name: 'Diet Plans', href: '/admin/diet', icon: '🥗' },
  { name: 'Attendance', href: '/admin/attendance', icon: '📅' },
  { name: 'Equipment', href: '/admin/equipment', icon: '🏋️' },
  { name: 'Announcements', href: '/admin/announcements', icon: '📢' },
];

export const Sidebar: React.FC<SidebarProps> = ({ role }) => {
  const pathname = usePathname();
  const router = useRouter();
  const navItems = role === 'admin' ? adminNavItems : userNavItems;
  const [showAnnouncementCenter, setShowAnnouncementCenter] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      if (!token) return;
      
      const response = await fetch('/api/announcements', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    router.push('/auth/signin');
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 z-40 rounded-r-[36px]" style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(32px) saturate(180%)', WebkitBackdropFilter: 'blur(32px) saturate(180%)', border: '1px solid rgba(255,255,255,0.25)', borderLeft: 'none', boxShadow: '0 12px 32px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.35)' }}>
      {/* Logo */}
      <div className="p-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.25)' }}>
        <Link href="/" className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-[20px] flex items-center justify-center text-white font-bold text-2xl" style={{ background: '#7AA7FF', boxShadow: '0 0 32px rgba(122,167,255,0.45), 0 12px 32px rgba(0,0,0,0.18)' }}>
            F
          </div>
          <span className="text-[24px] font-[800] text-[#1C1C1E]" style={{ fontFamily: 'SF Pro Display, -apple-system, sans-serif' }}>
            Fitsense
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-[16px] transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-[#2D6EF8] to-[#5B8EFF] text-white shadow-lg shadow-blue-500/30'
                  : 'text-gray-300 hover:bg-gray-50'
              }`}
              role="button"
              aria-label={item.name}
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="font-semibold">{item.name}</span>
            </Link>
          );
        })}
        
        {/* Announcements Bell */}
        <button
          onClick={() => setShowAnnouncementCenter(true)}
          className="flex items-center space-x-3 px-4 py-3 rounded-[16px] transition-all duration-200 text-gray-300 hover:bg-gray-50 w-full relative"
          aria-label="Announcements"
        >
          <span className="text-2xl">🔔</span>
          <span className="font-semibold">Announcements</span>
          {unreadCount > 0 && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </nav>

      {/* Announcement Center Modal */}
      <AnnouncementCenter 
        isOpen={showAnnouncementCenter} 
        onClose={() => {
          setShowAnnouncementCenter(false);
          fetchUnreadCount();
        }} 
      />

      {/* Logout */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-[16px] transition-all duration-200"
          aria-label="Logout"
        >
          <span className="text-2xl">🚪</span>
          <span className="font-semibold">Logout</span>
        </button>
      </div>
    </aside>
  );
};

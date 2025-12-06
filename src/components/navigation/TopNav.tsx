'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import AnnouncementCenter from '@/components/announcements/AnnouncementCenter';

interface TopNavProps {
  role: 'user' | 'admin';
}

const userNavItems = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Workouts', href: '/workouts' },
  { name: 'Nutrition', href: '/nutrition' },
  { name: 'Profile', href: '/profile' },
];

const adminNavItems = [
  { name: 'Dashboard', href: '/admin/dashboard' },
  { name: 'Users', href: '/admin/users' },
  { name: 'Workouts', href: '/admin/workouts' },
  { name: 'Diet', href: '/admin/diet' },
];

export const TopNav: React.FC<TopNavProps> = ({ role }) => {
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
    localStorage.removeItem('user');
    router.push('/auth/signin');
  };

  return (
    <div className="hidden md:flex lg:hidden sticky top-0 z-40 px-4 pt-4">
      <nav className="w-full rounded-[28px] px-6 py-4" style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(150px) saturate(180%)', WebkitBackdropFilter: 'blur(150px) saturate(180%)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 24px 64px rgba(0,0,0,0.3), inset 0 2px 0 rgba(255,255,255,0.05)' }}>
        <div className="flex items-center justify-between w-full">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold" style={{ background: '#7AA7FF', boxShadow: '0 0 32px rgba(122,167,255,0.45)' }}>
              F
            </div>
            <span className="text-[20px] font-[800] text-[#1C1C1E]" style={{ fontFamily: 'SF Pro Display, -apple-system, sans-serif' }}>
              Fitsense
            </span>
          </Link>

          {/* Nav Items */}
          <div className="flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${isActive
                      ? 'bg-iosBlue text-white'
                      : 'text-gray-300 hover:bg-gray-100'
                    }`}
                >
                  {item.name}
                </Link>
              );
            })}
            <button
              onClick={() => setShowAnnouncementCenter(true)}
              className="relative ml-2 w-10 h-10 rounded-full flex items-center justify-center text-gray-300 hover:bg-gray-100 transition-all"
            >
              <span className="text-xl">🔔</span>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            <button
              onClick={handleLogout}
              className="ml-2 px-4 py-2 text-sm font-medium text-iosRed hover:bg-red-50 rounded-full transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Announcement Center Modal */}
      <AnnouncementCenter
        isOpen={showAnnouncementCenter}
        onClose={() => {
          setShowAnnouncementCenter(false);
          fetchUnreadCount();
        }}
      />
    </div>
  );
};

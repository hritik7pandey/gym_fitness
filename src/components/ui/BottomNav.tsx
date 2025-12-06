"use client";
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import React, { useState, useEffect } from 'react';

const BottomNav: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [showMenu, setShowMenu] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    setUserRole(localStorage.getItem('userRole'));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    router.push('/auth/signin');
  };

  const menuItems = userRole === 'admin' ? [
    { href: '/admin/dashboard', label: 'Dashboard', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="7" height="8" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="14" y="3" width="7" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="14" y="12" width="7" height="9" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="3" y="13" width="7" height="8" rx="1" stroke="currentColor" strokeWidth="1.5"/></svg> },
    { href: '/admin/users', label: 'Users', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.5"/></svg> },
    { href: '/admin/workouts', label: 'Workouts', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.5 6.5h11M6.5 17.5h11M3 12h18M7 6.5v11M17 6.5v11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> },
    { href: '/admin/diet', label: 'Diet Plans', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C9 2 7 4 7 7c0 2 1 3 3 4v9a2 2 0 0 0 4 0v-9c2-1 3-2 3-4 0-3-2-5-5-5z" stroke="currentColor" strokeWidth="1.5"/></svg> },
    { href: '/admin/announcements', label: 'Announcements', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> },
    { href: '/admin/settings', label: 'Settings', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/><path d="M12 1v3m0 16v3M23 12h-3m-16 0H1M18.36 5.64l-2.12 2.12m-8.48 8.48l-2.12 2.12M18.36 18.36l-2.12-2.12m-8.48-8.48l-2.12-2.12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> },
  ] : [
    { href: '/dashboard', label: 'Dashboard', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="7" height="8" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="14" y="3" width="7" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="14" y="12" width="7" height="9" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="3" y="13" width="7" height="8" rx="1" stroke="currentColor" strokeWidth="1.5"/></svg> },
    { href: '/workouts', label: 'Workouts', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.5 6.5h11M6.5 17.5h11M3 12h18M7 6.5v11M17 6.5v11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> },
    { href: '/nutrition', label: 'Nutrition', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C9 2 7 4 7 7c0 2 1 3 3 4v9a2 2 0 0 0 4 0v-9c2-1 3-2 3-4 0-3-2-5-5-5z" stroke="currentColor" strokeWidth="1.5"/></svg> },
    { href: '/profile', label: 'Profile', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 21v-1a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.5"/></svg> },
    { href: '/settings', label: 'Settings', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/><path d="M12 1v3m0 16v3M23 12h-3m-16 0H1M18.36 5.64l-2.12 2.12m-8.48 8.48l-2.12 2.12M18.36 18.36l-2.12-2.12m-8.48-8.48l-2.12-2.12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> },
  ];

  return (
    <>
      {/* Hamburger Menu Overlay */}
      {showMenu && (
        <div 
          className="lg:hidden fixed inset-0 z-40 bg-black/20 backdrop-blur-sm animate-in fade-in duration-200" 
          onClick={() => setShowMenu(false)}
        >
          <div 
            className="absolute bottom-20 left-4 right-4 mx-auto max-w-md rounded-3xl p-3 animate-in slide-in-from-bottom duration-300"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'rgba(255, 255, 255, 0.25)',
              backdropFilter: 'blur(40px)',
              WebkitBackdropFilter: 'blur(40px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
            }}
          >
            <div className="space-y-1">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link key={item.href} href={item.href} onClick={() => setShowMenu(false)}>
                    <div
                      className={`flex items-center gap-4 px-5 py-4 rounded-2xl font-bold text-base transition-all backdrop-blur-xl ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                          : 'text-gray-300 hover:bg-white/40 active:scale-95'
                      }`}
                    >
                      <div className={isActive ? 'text-white' : 'text-gray-300'}>{item.icon}</div>
                      <span>{item.label}</span>
                    </div>
                  </Link>
                );
              })}

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-4 px-5 py-4 text-red-600 hover:bg-red-50/50 transition-all w-full rounded-2xl font-bold text-base backdrop-blur-xl active:scale-95"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hamburger Button - Fixed Bottom Right */}
      <nav aria-label="Navigation Menu" className="lg:hidden fixed bottom-3 right-3 pointer-events-auto z-50">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="rounded-2xl p-4 shadow-lg transition-all active:scale-95"
          aria-label="Menu"
          style={{
            background: 'rgba(255, 255, 255, 0.35)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
          }}
        >
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className={`transition-transform duration-300 ${showMenu ? 'rotate-90' : ''}`}
          >
            <path 
              d={showMenu ? "M18 6L6 18M6 6l12 12" : "M3 12h18M3 6h18M3 18h18"} 
              stroke="#111827" 
              strokeWidth="2" 
              strokeLinecap="round"
            />
          </svg>
        </button>
      </nav>
    </>
  );
};

export default BottomNav;

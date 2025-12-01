'use client';

import '../styles/globals.css';
import '../styles/ios-utilities.css';
import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BottomNav } from '../components/navigation/BottomNav';
import { Sidebar } from '../components/navigation/Sidebar';
import { TopNav } from '../components/navigation/TopNav';
import FloatingContactButton from '../components/ui/FloatingContactButton';

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Load user from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, [pathname]);

  // Pages that don't need navigation (landing, auth)
  const noNavPages = ['/', '/login', '/register', '/verify-email', '/forgot-password', '/reset-password', '/landing'];
  const isAuthPage = pathname?.startsWith('/auth/');
  const isNoNavPage = noNavPages.includes(pathname) || isAuthPage;

  // Determine if user is admin
  const isAdmin = user?.role === 'admin';

  // Show navigation only for logged-in users on app pages
  const showNavigation = !isNoNavPage && user;

  return (
    <html lang="en">
      <body className="bg-[#F7F9FC] text-slate-900 min-h-screen antialiased">
        {showNavigation && (
          <>
            {/* Desktop Sidebar - hidden on mobile/tablet */}
            <Sidebar role={isAdmin ? 'admin' : 'user'} />
            
            {/* Tablet Top Nav - hidden on mobile and desktop */}
            <TopNav role={isAdmin ? 'admin' : 'user'} />
            
            {/* Main content area with sidebar offset on desktop */}
            <div className="lg:ml-64">
              {children}
            </div>
            
            {/* Mobile Bottom Nav - hidden on tablet/desktop, only for users */}
            {!isAdmin && <BottomNav />}
            
            {/* Floating Contact Button */}
            <FloatingContactButton 
              userName={user?.name}
              userId={user?._id}
              membershipStatus={user?.membershipType}
            />
          </>
        )}

        {!showNavigation && (
          <div className="min-h-screen">
            {children}
            
            {/* Floating Contact Button for landing/auth pages */}
            <FloatingContactButton />
          </div>
        )}
      </body>
    </html>
  );
}

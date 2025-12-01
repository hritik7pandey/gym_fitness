'use client';

import { motion } from '@/lib/motion';
import Link from 'next/link';

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
}

interface iOSBottomTabBarProps {
  items: NavItem[];
  activeTab: string;
}

export default function iOSBottomTabBar({ items, activeTab }: iOSBottomTabBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      {/* Safe area background */}
      <div className="absolute inset-x-0 bottom-0 h-safe-area-inset-bottom bg-white/95" />
      
      {/* Main bar */}
      <div className="relative bg-white/95 backdrop-blur-2xl backdrop-saturate-[180%] border-t border-gray-200/50 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <nav className="flex items-center justify-around px-2 pt-2 pb-safe-area-inset-bottom">
          {items.map((item, index) => {
            const isActive = activeTab === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex-1 flex flex-col items-center gap-1 py-2 relative group"
              >
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-blue-600/5 rounded-2xl"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}

                {/* Icon */}
                <motion.div
                  initial={{ scale: 1 }}
                  animate={{ 
                    scale: isActive ? 1 : 0.9,
                    y: isActive ? -2 : 0 
                  }}
                  transition={{ duration: 0.2 }}
                  className={`relative z-10 text-2xl ${
                    isActive ? 'text-blue-600' : 'text-gray-500'
                  }`}
                >
                  {item.icon}
                </motion.div>

                {/* Label */}
                <motion.span
                  initial={{ opacity: 0.7, scale: 0.95 }}
                  animate={{ 
                    opacity: isActive ? 1 : 0.7,
                    scale: isActive ? 1 : 0.95,
                    fontWeight: isActive ? 600 : 500
                  }}
                  transition={{ duration: 0.2 }}
                  className={`relative z-10 text-xs ${
                    isActive ? 'text-blue-600' : 'text-gray-600'
                  }`}
                >
                  {item.label}
                </motion.span>

                {/* Tap feedback */}
                {!isActive && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    whileTap={{ scale: 1, opacity: 1 }}
                    className="absolute inset-0 bg-gray-200 rounded-2xl"
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

'use client';

import { motion, useScroll, useTransform } from '@/lib/motion';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface DynamicNavBarProps {
  transparent?: boolean;
}

export default function DynamicNavBar({ transparent = false }: DynamicNavBarProps) {
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 100], [transparent ? 0 : 1, 1]);
  const blur = useTransform(scrollY, [0, 100], [0, 20]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Features', href: '#features' },
    { label: 'Workouts', href: '#workouts' },
    { label: 'Nutrition', href: '#nutrition' },
    { label: 'Pricing', href: '#pricing' },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 px-4 pt-4 md:px-6">
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`mx-auto max-w-7xl transition-all duration-500 ${
          scrolled || !transparent
            ? 'shadow-depth'
            : 'shadow-ambient'
        }`}
        style={{
          background: scrolled ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.15)',
          backdropFilter: `blur(${scrolled ? 50 : 30}px) saturate(180%)`,
          WebkitBackdropFilter: `blur(${scrolled ? 50 : 30}px) saturate(180%)`,
          borderRadius: '28px',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: scrolled 
            ? 'inset 0 1px 0 rgba(255, 255, 255, 0.8), 0 12px 40px rgba(0, 0, 0, 0.08)'
            : 'inset 0 1px 0 rgba(255, 255, 255, 0.6), 0 8px 32px rgba(0, 0, 0, 0.04)',
        } as any}
      >
        <div className="px-6 sm:px-8">
          <div className="flex justify-between items-center h-16 md:h-[72px]">
          {/* Logo */}
          <Link href="/">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as any }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3 cursor-pointer"
            >
              <div className="relative">
                <div className="absolute inset-0 glass-background rounded-2xl blur-xl opacity-60 animate-glow-pulse" />
                <div className="relative glass-chip-active text-white w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-xl shadow-neon-blue">
                  F
                </div>
              </div>
              <span className="gradient-title text-2xl font-bold">
                Fitsense
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] as any }}
            className="hidden md:flex items-center gap-2"
          >
            {navItems.map((item, index) => (
              <motion.button
                key={item.label}
                onClick={() => scrollToSection(item.href)}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.5, 
                  delay: 0.3 + index * 0.1, 
                  ease: [0.16, 1, 0.3, 1] as any 
                }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-5 py-2.5 text-gray-300 hover:text-neon-blue font-semibold transition-all duration-300 rounded-full hover:bg-white/40 hover:backdrop-blur-xl hover:shadow-ambient relative cursor-pointer"
              >
                {item.label}
              </motion.button>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] as any }}
            className="flex items-center gap-3"
          >
            <Link href="/auth/signin">
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.5)' }}
                whileTap={{ scale: 0.95 }}
                className="hidden sm:block px-5 py-2.5 text-gray-300 font-bold rounded-full transition-all duration-300 hover:text-neon-blue hover:shadow-ambient"
                style={{
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                }}
              >
                Login
              </motion.button>
            </Link>
            <Link href="/auth/signup">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-7 py-3 glass-chip-active text-white font-bold shadow-neon-blue hover:shadow-neon-strong transition-all duration-300"
                style={{
                  backdropFilter: 'blur(18px)',
                  WebkitBackdropFilter: 'blur(18px)',
                }}
              >
                Sign Up
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>
      </motion.nav>
    </div>
  );
}

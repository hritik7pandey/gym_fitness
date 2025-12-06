'use client';

import { motion } from '@/lib/motion';
import { ReactNode } from 'react';

interface AnimatedGlassCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  depth?: 'shallow' | 'medium' | 'deep';
}

export default function AnimatedGlassCard({
  children,
  className = '',
  delay = 0,
  depth = 'medium'
}: AnimatedGlassCardProps) {

  const depthStyles = {
    shallow: '0 6px 20px rgba(0,0,0,0.04)',
    medium: '0 8px 32px rgba(0,0,0,0.06)',
    deep: '0 12px 40px rgba(0,0,0,0.08)'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{
        duration: 0.35,
        delay: delay,
        ease: [0.25, 0.1, 0.25, 1]
      }}
      className={`
        relative overflow-hidden
        ${className}
      `}
      style={{
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(150px) saturate(180%)',
        WebkitBackdropFilter: 'blur(150px) saturate(180%)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '28px',
        boxShadow: '0 24px 64px rgba(0,0,0,0.3), inset 0 2px 0 rgba(255,255,255,0.05)'
      }}
    >
      {/* Subtle gradient overlay for liquid glass depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          borderRadius: '28px',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)'
        }}
      />

      {/* iOS 26 Subtle top highlight */}
      <div className="absolute inset-x-0 top-0 h-[1px] opacity-60" style={{ background: 'linear-gradient(90deg, transparent 10%, rgba(255,255,255,0.9) 50%, transparent 90%)' }} />

      <div className="relative z-10" style={{ padding: 'clamp(16px, 4vw, 24px)' }}>
        {children}
      </div>
    </motion.div>
  );
}

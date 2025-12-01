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
        background: 'rgba(255,255,255,0.5)',
        backdropFilter: 'blur(40px) saturate(150%)',
        WebkitBackdropFilter: 'blur(40px) saturate(150%)',
        border: '1px solid rgba(255,255,255,0.65)',
        borderRadius: '24px',
        boxShadow: `${depthStyles[depth]}, inset 0 1px 0 rgba(255,255,255,0.8)`
      }}
    >
      {/* iOS 26 Subtle top highlight */}
      <div className="absolute inset-x-0 top-0 h-[1px] opacity-60" style={{ background: 'linear-gradient(90deg, transparent 10%, rgba(255,255,255,0.9) 50%, transparent 90%)' }} />

      <div className="relative z-10" style={{ padding: 'clamp(16px, 4vw, 24px)' }}>
        {children}
      </div>
    </motion.div>
  );
}

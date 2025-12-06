'use client';

import React from 'react';
import { motion } from '@/lib/motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'glass' | 'solid' | 'glass-light';
  hover?: boolean;
  onClick?: () => void;
  role?: string;
  tabIndex?: number;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'solid',
  hover = false,
  onClick,
  role,
  tabIndex,
}) => {
  const variantStyles = {
    glass: 'glass-panel text-white shadow-depth',
    'glass-light': 'glass-chip text-white shadow-ambient',
    solid: 'glass-panel text-white shadow-depth',
  };

  const hoverStyles = hover ? 'cursor-pointer transition-all duration-300' : '';
  const clickableStyles = onClick ? 'cursor-pointer' : '';

  const Component = onClick || hover ? motion.div : 'div';
  const motionProps = (onClick || hover) ? {
    whileHover: { scale: 1.02, y: -3, boxShadow: '0 25px 50px rgba(0, 0, 40, 0.3)' },
    whileTap: { scale: 0.96 },
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
  } : {};

  return (
    <Component
      className={`glass-chip p-6 lg:p-8 ${variantStyles[variant]} ${hoverStyles} ${clickableStyles} ${className}`}
      onClick={onClick}
      role={role}
      tabIndex={tabIndex}
      {...(motionProps as any)}
    >
      {children}
    </Component>
  );
};

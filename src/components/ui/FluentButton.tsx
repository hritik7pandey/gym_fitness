"use client";
import React from 'react';
import { motion } from '@/lib/motion';

interface FluentButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  ariaLabel?: string;
  className?: string;
}

const FluentButton: React.FC<FluentButtonProps> = ({ children, onClick, ariaLabel, className }) => {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-4 py-2 lg:px-6 lg:py-3 rounded-2xl bg-iosBlue text-white text-sm lg:text-base font-medium shadow-ios-soft hover:shadow-xl transition-all hover:scale-105 active:scale-95 ${className ?? ''}`}
    >
      {children}
    </button>
  );
};

export default FluentButton;

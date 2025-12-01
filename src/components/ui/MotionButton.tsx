'use client';

import { motion } from '@/lib/motion';
import { ReactNode } from 'react';

interface MotionButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
}

export default function MotionButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  disabled = false
}: MotionButtonProps) {

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    onClick?.();
  };

  const variants = {
    primary: 'text-white',
    secondary: 'text-[#1C1C1E]',
    ghost: 'text-[#1C1C1E]/70'
  };

  const sizes = {
    sm: 'text-[15px] font-[600]',
    md: 'text-[16px] font-[600]',
    lg: 'text-[17px] font-[600]'
  };

  const getButtonStyles = () => {
    if (variant === 'primary') {
      return {
        background: '#7AA7FF',
        boxShadow: '0 4px 16px rgba(122,167,255,0.3)',
        border: '1px solid rgba(255,255,255,0.4)',
        borderRadius: '50px',
        height: size === 'sm' ? '44px' : size === 'md' ? '48px' : '52px',
        padding: '0 24px'
      };
    } else {
      return {
        background: 'rgba(255,255,255,0.5)',
        backdropFilter: 'blur(20px) saturate(150%)',
        WebkitBackdropFilter: 'blur(20px) saturate(150%)',
        border: '1px solid rgba(255,255,255,0.6)',
        borderRadius: '50px',
        height: size === 'sm' ? '44px' : size === 'md' ? '48px' : '52px',
        padding: '0 24px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.6)'
      };
    }
  };

  return (
    <motion.button
      type={type as any}
      onClick={handleClick}
      disabled={disabled}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      style={{ ...getButtonStyles(), fontFamily: 'SF Pro, -apple-system, sans-serif' } as any}
      className={`
        relative overflow-hidden
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      ` as any}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </motion.button>
  );
}

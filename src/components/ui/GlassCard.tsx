"use client";
import Link from 'next/link';
import { motion } from '@/lib/motion';
import React from 'react';

interface GlassCardProps {
  title: string;
  subtitle?: string;
  href?: string;
  children?: React.ReactNode;
}

const GlassCard: React.FC<GlassCardProps> = ({ title, subtitle, href, children }) => {
  const content = (
    <motion.div
      role={href ? 'link' : 'article'}
      aria-label={title}
      className="glass-card p-5 lg:p-7 xl:p-9 shadow-depth transition-all duration-300"
      whileHover={{ scale: 1.02, y: -4, boxShadow: '0 25px 50px rgba(0, 0, 40, 0.3)' }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg lg:text-xl font-bold text-gray-900">{title}</h3>
          {subtitle && <p className="text-sm lg:text-base text-gray-600 mt-1 font-medium">{subtitle}</p>}
        </div>
      </div>
      <div className="mt-4 lg:mt-5 text-sm lg:text-base text-gray-700">
        {children}
      </div>
    </motion.div>
  );

  if (href) {
    return (
      <Link href={href} aria-label={`Open ${title}`} className="block">
        {content}
      </Link>
    );
  }

  return content;
};

export default GlassCard;

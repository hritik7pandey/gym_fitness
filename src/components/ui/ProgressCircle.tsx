"use client";
import React from 'react';
import { motion } from '@/lib/motion';

interface ProgressCircleProps {
  size?: number;
  stroke?: number;
  value: number; // 0..100
  label?: string;
}

const ProgressCircle: React.FC<ProgressCircleProps> = ({ size = 64, stroke = 6, value, label }) => {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="inline-flex items-center gap-3 lg:gap-4">
      <svg width={size} height={size} role="img" aria-label={label ?? `Progress ${value}%`}>
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="#E5E7EB" strokeWidth={stroke} fill="none" />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#0A84FF"
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8 }}
        />
      </svg>
      {label && <div className="text-sm"><div className="font-medium">{value}%</div><div className="text-slate-500 text-xs">{label}</div></div>}
    </div>
  );
};

export default ProgressCircle;

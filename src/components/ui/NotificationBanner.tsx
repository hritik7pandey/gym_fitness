"use client";
import React from 'react';
import { motion } from '@/lib/motion';

interface NotificationBannerProps {
  message: string;
}

const NotificationBanner: React.FC<NotificationBannerProps> = ({ message }) => {
  return (
    <div
      role="status"
      aria-live="polite"
      className="ios-glass p-3 rounded-3xl animate-fade-in"
    >
      <p className="text-sm">{message}</p>
    </div>
  );
};

export default NotificationBanner;

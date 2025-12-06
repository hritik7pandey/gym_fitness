'use client';

import React from 'react';
import { motion } from '@/lib/motion';

interface AnnouncementCardProps {
  announcement: {
    _id: string;
    title: string;
    message: string;
    image?: string;
    priority: 'normal' | 'important' | 'critical';
    category: string;
    sticky: boolean;
    isRead?: boolean;
    createdAt: string;
  };
  onRead?: (id: string) => void;
  onDismiss?: (id: string) => void;
  compact?: boolean;
}

export default function AnnouncementCard({ 
  announcement, 
  onRead, 
  onDismiss,
  compact = false 
}: AnnouncementCardProps) {
  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case 'critical':
        return {
          badge: 'bg-gradient-to-r from-red-500 to-red-600',
          glow: 'shadow-[0_0_25px_rgba(239,68,68,0.4)]',
          border: 'border-red-400/30',
          icon: '🚨',
        };
      case 'important':
        return {
          badge: 'bg-gradient-to-r from-orange-500 to-yellow-500',
          glow: 'shadow-[0_0_25px_rgba(251,146,60,0.4)]',
          border: 'border-orange-400/30',
          icon: '⚡',
        };
      default:
        return {
          badge: 'glass-chip-active',
          glow: 'shadow-neon-blue',
          border: 'border-[#2D6EF8]/20',
          icon: '📢',
        };
    }
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      gym: '🏋️',
      workout: '💪',
      nutrition: '🥗',
      membership: '⭐',
      system: '⚙️',
      offer: '🎉',
    };
    return icons[category] || '📣';
  };

  const styles = getPriorityStyles(announcement.priority);

  const handleClick = () => {
    if (!announcement.isRead && onRead) {
      onRead(announcement._id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: -100, scale: 0.9 }}
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ 
        type: 'spring',
        stiffness: 300,
        damping: 20
      }}
      onClick={handleClick}
      className={`relative overflow-hidden cursor-pointer group ${
        compact ? 'glass-chip' : 'glass-panel'
      }`}
    >
      {/* Glass container */}
      <div className={`glass-card-strong ${styles.border} ${styles.glow} hover:shadow-neon-strong transition-all duration-300 ${
        compact ? 'p-4' : 'p-6'
      }`}>
        {/* Unread indicator */}
        {!announcement.isRead && (
          <div className="absolute top-4 right-4">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-glow-pulse">
              <div className="absolute inset-0 bg-red-500 rounded-full blur-md opacity-60" />
            </div>
          </div>
        )}

        {/* Sticky badge */}
        {announcement.sticky && !compact && (
          <div className="absolute top-4 left-4">
            <div className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-pill text-white text-xs font-bold shadow-neon-blue">
              📌 Pinned
            </div>
          </div>
        )}

        {/* Image banner */}
        {announcement.image && !compact && (
          <div className="w-full h-40 mb-4 glass-chip overflow-hidden">
            <img 
              src={announcement.image} 
              alt={announcement.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>
        )}

        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-start gap-3 flex-1">
            <div className={`${styles.badge} p-3 glass-chip text-white text-xl shadow-depth flex-shrink-0`}>
              {styles.icon}
            </div>
            <div className="flex-1">
              <h3 className={`font-bold gradient-title ${
                compact ? 'text-base' : 'text-xl'
              } mb-1`}>
                {announcement.title}
              </h3>
              <div className="flex items-center gap-2 text-xs text-[#1C1C1E]/60">
                <span className="flex items-center gap-1">
                  {getCategoryIcon(announcement.category)}
                  {announcement.category}
                </span>
                <span>•</span>
                <span>{new Date(announcement.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Message */}
        <p className={`text-[#1C1C1E]/80 leading-relaxed ${
          compact ? 'text-sm line-clamp-2' : 'text-base mb-4'
        }`}>
          {announcement.message}
        </p>

        {/* Actions */}
        {!compact && (
          <div className="flex gap-2 mt-4">
            {onDismiss && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  onDismiss(announcement._id);
                }}
                className="px-4 py-2 glass-chip text-sm font-semibold text-[#1C1C1E]/70 hover:text-[#1C1C1E] transition-colors"
              >
                Dismiss
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                if (onRead) onRead(announcement._id);
              }}
              className="px-4 py-2 glass-chip-active text-white text-sm font-semibold shadow-neon-blue hover:shadow-neon-strong transition-all"
            >
              {announcement.isRead ? 'View Again' : 'Mark as Read'}
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

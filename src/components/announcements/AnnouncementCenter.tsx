'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from '@/lib/motion';
import AnnouncementCard from './AnnouncementCard';

interface Announcement {
  _id: string;
  title: string;
  message: string;
  image?: string;
  priority: 'normal' | 'important' | 'critical';
  category: string;
  sticky: boolean;
  isRead?: boolean;
  isDismissed?: boolean;
  createdAt: string;
}

interface AnnouncementCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AnnouncementCenter({ isOpen, onClose }: AnnouncementCenterProps) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'unread' | 'read'>('all');

  const categories = ['all', 'gym', 'workout', 'nutrition', 'membership', 'system', 'offer'];

  useEffect(() => {
    if (isOpen) {
      fetchAnnouncements();
    }
  }, [isOpen]);

  useEffect(() => {
    filterAnnouncements();
  }, [announcements, searchQuery, selectedCategory, selectedFilter]);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      const response = await fetch('/api/announcements', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setAnnouncements(data.announcements.filter((a: Announcement) => !a.isDismissed));
      }
    } catch (error) {
      console.error('Failed to fetch announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAnnouncements = () => {
    let filtered = [...announcements];

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(a => a.category === selectedCategory);
    }

    // Read/Unread filter
    if (selectedFilter === 'unread') {
      filtered = filtered.filter(a => !a.isRead);
    } else if (selectedFilter === 'read') {
      filtered = filtered.filter(a => a.isRead);
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(a => 
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.message.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredAnnouncements(filtered);
  };

  const handleRead = async (id: string) => {
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      await fetch('/api/announcements/read', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ announcementId: id }),
      });
      
      setAnnouncements(prev => prev.map(a => 
        a._id === id ? { ...a, isRead: true } : a
      ));
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const handleDismiss = async (id: string) => {
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      await fetch('/api/announcements/dismiss', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ announcementId: id }),
      });
      
      setAnnouncements(prev => prev.filter(a => a._id !== id));
    } catch (error) {
      console.error('Failed to dismiss announcement:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 glass-backdrop"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
          className="glass-panel w-full max-w-5xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div 
            className="p-4 sm:p-6"
            style={{
              borderBottom: '1px solid rgba(255,255,255,0.25)',
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="gradient-title text-xl sm:text-2xl">
                📣 Announcement Center
              </h2>
              <button
                onClick={onClose}
                className="glass-close-btn w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-[#1C1C1E]/70 hover:text-[#1C1C1E] transition-all"
              >
                ✕
              </button>
            </div>

            {/* Search */}
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search announcements..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="glass-input w-full px-4 py-2.5 sm:py-3 pl-10 sm:pl-12 focus:outline-none transition-all text-sm sm:text-base"
              />
              <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-[#1C1C1E]/40 text-base sm:text-lg">
                🔍
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 overflow-x-auto pb-2">
              {/* Read status filter */}
              {['all', 'unread', 'read'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter as any)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                    selectedFilter === filter ? 'glass-chip-active' : 'glass-chip'
                  }`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
              
              <div className="w-px bg-white/30 mx-1 hidden sm:block" />
              
              {/* Category filter */}
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat ? 'glass-chip-active' : 'glass-chip'
                  }`}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 sm:space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div 
                    className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 rounded-full animate-spin border-4 border-transparent"
                    style={{
                      background: 'linear-gradient(135deg, #7AA7FF 0%, #6366F1 100%)',
                      borderTopColor: 'white',
                    }}
                  />
                  <p className="text-[#1C1C1E]/60 text-sm sm:text-base">Loading announcements...</p>
                </div>
              </div>
            ) : filteredAnnouncements.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="text-5xl sm:text-6xl mb-4">📭</div>
                  <h3 className="text-lg sm:text-xl font-bold text-[#1C1C1E] mb-2">No announcements</h3>
                  <p className="text-sm sm:text-base text-[#1C1C1E]/60">
                    {searchQuery || selectedCategory !== 'all' || selectedFilter !== 'all' 
                      ? 'Try adjusting your filters' 
                      : 'Check back later for updates'}
                  </p>
                </div>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {filteredAnnouncements.map((announcement) => (
                  <AnnouncementCard
                    key={announcement._id}
                    announcement={announcement}
                    onRead={handleRead}
                    onDismiss={handleDismiss}
                  />
                ))}
              </AnimatePresence>
            )}
          </div>

          {/* Footer */}
          <div 
            className="p-3 sm:p-4 text-center text-xs sm:text-sm text-[#1C1C1E]/60"
            style={{
              borderTop: '1px solid rgba(255,255,255,0.25)',
            }}
          >
            Showing {filteredAnnouncements.length} of {announcements.length} announcements
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

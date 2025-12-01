'use client';

import { useState, useEffect } from 'react';
import { motion } from '@/lib/motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Announcement {
  _id: string;
  title: string;
  message: string;
  priority: 'normal' | 'important' | 'critical';
  category: string;
  sticky: boolean;
  isActive: boolean;
  scheduleAt?: string;
  expiresAt?: string;
  analytics: {
    totalReach: number;
    totalReads: number;
    totalDismissals: number;
  };
  createdAt: string;
}

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'scheduled' | 'expired'>('all');
  const router = useRouter();

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      const response = await fetch('/api/admin/announcements', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setAnnouncements(data.announcements);
      }
    } catch (error) {
      console.error('Failed to fetch announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteAnnouncement = async (id: string) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return;
    
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      const response = await fetch(`/api/admin/announcements/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setAnnouncements(prev => prev.filter(a => a._id !== id));
      }
    } catch (error) {
      console.error('Failed to delete announcement:', error);
      alert('Failed to delete announcement');
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      const response = await fetch(`/api/admin/announcements/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      const data = await response.json();
      if (data.success) {
        setAnnouncements(prev => prev.map(a => 
          a._id === id ? { ...a, isActive: !currentStatus } : a
        ));
      }
    } catch (error) {
      console.error('Failed to toggle status:', error);
    }
  };

  const getPriorityBadge = (priority: string) => {
    const styles = {
      critical: 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/50',
      important: 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white shadow-lg shadow-orange-500/50',
      normal: 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/50',
    };
    return styles[priority as keyof typeof styles] || styles.normal;
  };

  const filteredAnnouncements = announcements.filter(a => {
    const now = new Date();
    if (filter === 'active') return a.isActive && (!a.expiresAt || new Date(a.expiresAt) > now);
    if (filter === 'scheduled') return a.scheduleAt && new Date(a.scheduleAt) > now;
    if (filter === 'expired') return a.expiresAt && new Date(a.expiresAt) < now;
    return true;
  });

  return (
    <div className="min-h-screen bg-mist-gradient p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="gradient-title text-3xl font-bold mb-2">
              📣 Manage Announcements
            </h1>
            <p className="text-gray-600">Create and manage announcements for your members</p>
          </div>
          <Link href="/admin/announcements/create">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 glass-chip-active text-white font-bold shadow-neon-blue hover:shadow-neon-strong transition-all"
            >
              + Create Announcement
            </motion.button>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 glass-chip p-2">
          {['all', 'active', 'scheduled', 'expired'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-4 py-2 rounded-pill text-sm font-semibold transition-all ${
                filter === f
                  ? 'glass-chip-active text-white shadow-neon-blue'
                  : 'text-gray-700 hover:bg-white/30'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total', value: announcements.length, icon: '📊', color: 'blue' },
            { label: 'Active', value: announcements.filter(a => a.isActive).length, icon: '✅', color: 'green' },
            { label: 'Scheduled', value: announcements.filter(a => a.scheduleAt && new Date(a.scheduleAt) > new Date()).length, icon: '⏰', color: 'orange' },
            { label: 'Expired', value: announcements.filter(a => a.expiresAt && new Date(a.expiresAt) < new Date()).length, icon: '⏹️', color: 'red' },
          ].map((stat) => (
            <div key={stat.label} className="glass-card-strong p-6">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="gradient-title text-3xl font-bold">{stat.value}</div>
              <div className="text-sm text-gray-600 font-semibold">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Announcements Table */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 glass-spinner" />
              <p className="text-gray-600">Loading announcements...</p>
            </div>
          </div>
        ) : filteredAnnouncements.length === 0 ? (
          <div className="glass-card-strong p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No announcements found</h3>
            <p className="text-gray-600 mb-6">Create your first announcement to get started</p>
            <Link href="/admin/announcements/create">
              <button className="px-6 py-3 glass-chip-active text-white font-bold shadow-neon-blue hover:shadow-neon-strong transition-all">
                + Create Announcement
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAnnouncements.map((announcement) => (
              <motion.div
                key={announcement._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card-strong p-6 hover:shadow-depth transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-3 py-1 text-xs font-bold rounded-pill ${getPriorityBadge(announcement.priority)}`}>
                        {announcement.priority.toUpperCase()}
                      </span>
                      <span className="px-3 py-1 text-xs font-bold rounded-pill bg-gray-200 text-gray-700">
                        {announcement.category}
                      </span>
                      {announcement.sticky && (
                        <span className="px-3 py-1 text-xs font-bold rounded-pill bg-gradient-to-r from-yellow-400 to-yellow-500 text-white">
                          📌 STICKY
                        </span>
                      )}
                      <span className={`px-3 py-1 text-xs font-bold rounded-pill ${
                        announcement.isActive ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-700'
                      }`}>
                        {announcement.isActive ? '● ACTIVE' : '○ INACTIVE'}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{announcement.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{announcement.message}</p>
                    
                    {/* Analytics */}
                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <span>👁️</span>
                        <span>{announcement.analytics.totalReach} reach</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>✅</span>
                        <span>{announcement.analytics.totalReads} reads</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>✖️</span>
                        <span>{announcement.analytics.totalDismissals} dismissed</span>
                      </div>
                      {announcement.analytics.totalReach > 0 && (
                        <div className="flex items-center gap-1 font-semibold">
                          <span>📊</span>
                          <span>{Math.round((announcement.analytics.totalReads / announcement.analytics.totalReach) * 100)}% read rate</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Schedule Info */}
                    {(announcement.scheduleAt || announcement.expiresAt) && (
                      <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                        {announcement.scheduleAt && (
                          <span>⏰ Starts: {new Date(announcement.scheduleAt).toLocaleString()}</span>
                        )}
                        {announcement.expiresAt && (
                          <span>⏹️ Expires: {new Date(announcement.expiresAt).toLocaleString()}</span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <Link href={`/admin/announcements/edit/${announcement._id}`}>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-blue-500 text-white font-semibold glass-chip hover:bg-blue-600 transition-all"
                      >
                        ✏️ Edit
                      </motion.button>
                    </Link>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleActive(announcement._id, announcement.isActive)}
                      className={`px-4 py-2 font-semibold glass-chip transition-all ${
                        announcement.isActive
                          ? 'bg-gray-400 text-white hover:bg-gray-500'
                          : 'bg-green-500 text-white hover:bg-green-600'
                      }`}
                    >
                      {announcement.isActive ? '⏸️ Disable' : '▶️ Enable'}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => deleteAnnouncement(announcement._id)}
                      className="px-4 py-2 bg-red-500 text-white font-semibold glass-chip hover:bg-red-600 transition-all"
                    >
                      🗑️ Delete
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

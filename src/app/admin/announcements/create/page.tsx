'use client';

import { useState } from 'react';
import { motion } from '@/lib/motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CreateAnnouncementPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    image: '',
    priority: 'normal' as 'normal' | 'important' | 'critical',
    category: 'gym',
    sticky: false,
    isActive: true,
    scheduleAt: '',
    expiresAt: '',
    audienceType: 'all' as 'all' | 'admins' | 'specific_users' | 'membership_types',
    membershipTypes: [] as string[],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      const payload: any = {
        title: formData.title,
        message: formData.message,
        priority: formData.priority,
        category: formData.category,
        sticky: formData.sticky,
        isActive: formData.isActive,
        audience: {
          type: formData.audienceType,
          membershipTypes: formData.audienceType === 'membership_types' ? formData.membershipTypes : undefined,
        },
      };

      if (formData.image) payload.image = formData.image;
      if (formData.scheduleAt) payload.scheduleAt = formData.scheduleAt;
      if (formData.expiresAt) payload.expiresAt = formData.expiresAt;

      const response = await fetch('/api/admin/announcements', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (data.success) {
        alert('Announcement created successfully!');
        router.push('/admin/announcements');
      } else {
        alert(data.message || 'Failed to create announcement');
      }
    } catch (error) {
      console.error('Failed to create announcement:', error);
      alert('Failed to create announcement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-mist-gradient p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/announcements">
            <motion.button
              whileHover={{ scale: 1.1, x: -2 }}
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 rounded-full glass-chip flex items-center justify-center text-gray-300 hover:text-white"
            >
              ←
            </motion.button>
          </Link>
          <div>
            <h1 className="gradient-title text-3xl font-bold">
              Create New Announcement
            </h1>
            <p className="text-gray-400">Share important updates with your members</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="glass-card-strong p-8 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 glass-input focus:border-[#2D6EF8] focus:ring-[#2D6EF8]/50"
              placeholder="Enter announcement title..."
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2">
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={5}
              className="w-full px-4 py-3 glass-input focus:border-[#2D6EF8] focus:ring-[#2D6EF8]/50 resize-none"
              placeholder="Enter announcement message..."
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2">
              Image URL (Optional)
            </label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full px-4 py-3 glass-input focus:border-[#2D6EF8] focus:ring-[#2D6EF8]/50"
              placeholder="https://example.com/image.jpg"
            />
            {formData.image && (
              <div className="mt-3">
                <img src={formData.image} alt="Preview" className="w-full h-48 object-cover glass-chip" />
              </div>
            )}
          </div>

          {/* Priority & Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">
                Priority <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                className="w-full px-4 py-3 glass-input focus:border-[#2D6EF8] focus:ring-[#2D6EF8]/50"
              >
                <option value="normal">🔵 Normal</option>
                <option value="important">⚡ Important</option>
                <option value="critical">🚨 Critical</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 glass-input focus:border-[#2D6EF8] focus:ring-[#2D6EF8]/50"
              >
                <option value="gym">🏋️ Gym</option>
                <option value="workout">💪 Workout</option>
                <option value="nutrition">🥗 Nutrition</option>
                <option value="membership">⭐ Membership</option>
                <option value="system">⚙️ System</option>
                <option value="offer">🎉 Offer</option>
              </select>
            </div>
          </div>

          {/* Schedule & Expiry */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">
                Schedule At (Optional)
              </label>
              <input
                type="datetime-local"
                value={formData.scheduleAt}
                onChange={(e) => setFormData({ ...formData, scheduleAt: e.target.value })}
                className="w-full px-4 py-3 glass-input focus:border-[#2D6EF8] focus:ring-[#2D6EF8]/50"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">
                Expires At (Optional)
              </label>
              <input
                type="datetime-local"
                value={formData.expiresAt}
                onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                className="w-full px-4 py-3 glass-input focus:border-[#2D6EF8] focus:ring-[#2D6EF8]/50"
              />
            </div>
          </div>

          {/* Audience */}
          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2">
              Audience <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.audienceType}
              onChange={(e) => setFormData({ ...formData, audienceType: e.target.value as any })}
              className="w-full px-4 py-3 glass-input focus:border-[#2D6EF8] focus:ring-[#2D6EF8]/50"
            >
              <option value="all">👥 All Members</option>
              <option value="admins">👑 Admins Only</option>
              <option value="membership_types">💳 Specific Membership Types</option>
            </select>

            {formData.audienceType === 'membership_types' && (
              <div className="mt-3 space-y-2">
                {['basic', 'premium', 'vip'].map((type) => (
                  <label key={type} className="flex items-center gap-2 p-3 glass-chip cursor-pointer hover:bg-white/40 transition-all">
                    <input
                      type="checkbox"
                      checked={formData.membershipTypes.includes(type)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({ ...formData, membershipTypes: [...formData.membershipTypes, type] });
                        } else {
                          setFormData({ ...formData, membershipTypes: formData.membershipTypes.filter(t => t !== type) });
                        }
                      }}
                      className="w-5 h-5 rounded border-2 border-gray-300"
                    />
                    <span className="font-semibold text-gray-300 capitalize">{type} Members</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Toggle Options */}
          <div className="space-y-3">
            <label className="flex items-center gap-3 p-4 glass-chip cursor-pointer hover:bg-white/40 transition-all">
              <input
                type="checkbox"
                checked={formData.sticky}
                onChange={(e) => setFormData({ ...formData, sticky: e.target.checked })}
                className="w-6 h-6 rounded border-2 border-gray-300"
              />
              <div>
                <span className="font-bold text-white">📌 Sticky Announcement</span>
                <p className="text-sm text-gray-400">Keep this announcement at the top</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-4 glass-chip cursor-pointer hover:bg-white/40 transition-all">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-6 h-6 rounded border-2 border-gray-300"
              />
              <div>
                <span className="font-bold text-white">✅ Active</span>
                <p className="text-sm text-gray-400">Make announcement visible immediately</p>
              </div>
            </label>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-4">
            <Link href="/admin/announcements" className="flex-1">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-6 py-4 glass-chip font-bold hover:bg-white/40 transition-all"
              >
                Cancel
              </motion.button>
            </Link>
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 px-6 py-4 glass-chip-active text-white font-bold shadow-neon-blue hover:shadow-neon-strong transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : '📣 Create Announcement'}
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
}

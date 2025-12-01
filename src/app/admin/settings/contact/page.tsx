'use client';

import { useState, useEffect } from 'react';
import { motion } from '@/lib/motion';
import { getContactConfig, GYM_DETAILS } from '@/utils/gym-config';

interface ContactSettings {
  whatsappNumber: string;
  supportPhone: string;
  supportEmail: string;
  businessHoursStart: number;
  businessHoursEnd: number;
  enableContactWidget: boolean;
}

export default function ContactSettingsPage() {
  const [settings, setSettings] = useState<ContactSettings>(() => getContactConfig());
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Load settings from localStorage or use defaults from gym-config
    const loadedConfig = getContactConfig();
    setSettings(loadedConfig);
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      // Save to localStorage (in production, save to API)
      localStorage.setItem('contactSettings', JSON.stringify(settings));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="min-h-screen bg-mist-gradient p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="gradient-title text-3xl font-bold mb-2">
            💬 Contact Widget Settings
          </h1>
          <p className="text-gray-600">Configure the floating contact button for your members</p>
        </div>

        {/* Settings Form */}
        <div className="glass-card-strong p-8 space-y-6">
          {/* Enable/Disable Widget */}
          <div className="flex items-center justify-between p-4 glass-chip">
            <div>
              <h3 className="font-bold text-gray-900 mb-1">Enable Contact Widget</h3>
              <p className="text-sm text-gray-600">Show floating contact button on all pages</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enableContactWidget}
                onChange={(e) => setSettings({ ...settings, enableContactWidget: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-14 h-8 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#25D366] peer-checked:to-[#128C7E] shadow-inner"></div>
            </label>
          </div>

          {/* WhatsApp Number */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              WhatsApp Number <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              <span className="text-2xl">📱</span>
              <input
                type="tel"
                required
                value={settings.whatsappNumber}
                onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                placeholder="1234567890"
                className="flex-1 px-4 py-3 glass-input focus:border-[#25D366] focus:ring-[#25D366]/50"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">Enter without + or country code (e.g., 1234567890)</p>
          </div>

          {/* Support Phone */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Support Phone Number <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              <span className="text-2xl">📞</span>
              <input
                type="tel"
                required
                value={settings.supportPhone}
                onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
                placeholder="+1234567890"
                className="flex-1 px-4 py-3 glass-input focus:border-[#2D6EF8] focus:ring-[#2D6EF8]/50"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">Include country code (e.g., +1234567890)</p>
          </div>

          {/* Support Email */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Support Email <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              <span className="text-2xl">✉️</span>
              <input
                type="email"
                required
                value={settings.supportEmail}
                onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                placeholder="support@fitsense.com"
                className="flex-1 px-4 py-3 glass-input focus:border-[#8A5CF6] focus:ring-[#8A5CF6]/50"
              />
            </div>
          </div>

          {/* Business Hours */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              Business Hours <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-600 mb-2">Start Time</label>
                <select
                  value={settings.businessHoursStart}
                  onChange={(e) => setSettings({ ...settings, businessHoursStart: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 glass-input focus:border-[#2D6EF8] focus:ring-[#2D6EF8]/50"
                >
                  {hours.map((h) => (
                    <option key={h} value={h}>
                      {h.toString().padStart(2, '0')}:00
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-2">End Time</label>
                <select
                  value={settings.businessHoursEnd}
                  onChange={(e) => setSettings({ ...settings, businessHoursEnd: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 glass-input focus:border-[#2D6EF8] focus:ring-[#2D6EF8]/50"
                >
                  {hours.map((h) => (
                    <option key={h} value={h}>
                      {h.toString().padStart(2, '0')}:00
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-3 p-3 glass-chip">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Current Hours:</span> {settings.businessHoursStart.toString().padStart(2, '0')}:00 - {settings.businessHoursEnd.toString().padStart(2, '0')}:00
              </p>
              <p className="text-xs text-gray-500 mt-1">Members will see an offline notice outside these hours</p>
            </div>
          </div>

          {/* Preview */}
          <div className="p-6 glass-card">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-xl">👁️</span>
              Preview
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Widget Status:</span>
                <span className={`font-bold ${settings.enableContactWidget ? 'text-green-600' : 'text-red-600'}`}>
                  {settings.enableContactWidget ? '✅ Enabled' : '❌ Disabled'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">WhatsApp:</span>
                <span className="font-mono font-semibold text-gray-900">
                  wa.me/{settings.whatsappNumber}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Phone:</span>
                <span className="font-mono font-semibold text-gray-900">
                  {settings.supportPhone}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-mono font-semibold text-gray-900">
                  {settings.supportEmail}
                </span>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <motion.button
            onClick={handleSave}
            disabled={loading}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="w-full px-6 py-4 glass-chip-active text-white font-bold shadow-neon-blue hover:shadow-neon-strong transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : saved ? '✅ Saved Successfully!' : '💾 Save Settings'}
          </motion.button>
        </div>

        {/* Info Card */}
        <div className="mt-6 p-6 glass-chip border-blue-200">
          <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
            <span className="text-xl">ℹ️</span>
            How It Works
          </h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>The floating contact button appears on all pages when enabled</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>Members can quickly access WhatsApp, phone, email, and FAQ</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>Outside business hours, an offline notice is automatically shown</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>User information is automatically included in WhatsApp messages</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

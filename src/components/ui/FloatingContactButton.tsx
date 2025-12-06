'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from '@/lib/motion';
import { getContactConfig, getWhatsAppURL, GYM_DETAILS } from '@/utils/gym-config';

interface ContactConfig {
  whatsappNumber: string;
  supportPhone: string;
  supportEmail: string;
  businessHoursStart: number; // 0-23
  businessHoursEnd: number; // 0-23
  enableContactWidget: boolean;
}

interface FloatingContactButtonProps {
  userName?: string;
  userId?: string;
  membershipStatus?: string;
  config?: Partial<ContactConfig>;
}

export default function FloatingContactButton({
  userName,
  userId,
  membershipStatus,
  config: customConfig,
}: FloatingContactButtonProps) {
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [mounted, setMounted] = useState(false);

  const [config, setConfig] = useState(() => ({ ...getContactConfig(), ...customConfig }));

  useEffect(() => {
    setMounted(true);
    // Load settings from gym config and localStorage
    const loadedConfig = getContactConfig();
    setConfig({ ...loadedConfig, ...customConfig });
    checkBusinessHours();
    const interval = setInterval(checkBusinessHours, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const checkBusinessHours = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const online = currentHour >= config.businessHoursStart && currentHour < config.businessHoursEnd;
    setIsOnline(online);
  };

  const handleWhatsApp = () => {
    const url = getWhatsAppURL(userName, userId, membershipStatus);
    window.open(url, '_blank');
    setShowBottomSheet(false);
  };

  const handleCall = () => {
    window.location.href = `tel:${config.supportPhone}`;
    setShowBottomSheet(false);
  };

  const handleEmail = () => {
    const subject = encodeURIComponent(`Support Request - ${GYM_DETAILS.name}`);
    let body = `Hello ${GYM_DETAILS.name} Support,\n\n`;
    if (userName) body += `Name: ${userName}\n`;
    if (userId) body += `User ID: ${userId}\n`;
    if (membershipStatus) body += `Membership: ${membershipStatus}\n`;
    body += '\nMy query:\n';
    window.location.href = `mailto:${config.supportEmail}?subject=${subject}&body=${encodeURIComponent(body)}`;
    setShowBottomSheet(false);
  };

  const handleFAQ = () => {
    window.open('/faq', '_blank');
    setShowBottomSheet(false);
  };

  if (!mounted || !config.enableContactWidget) return null;

  return (
    <>
      {/* Floating Contact Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          type: 'spring', 
          stiffness: 260, 
          damping: 20,
          delay: 0.5 
        }}
        whileHover={{ 
          scale: 1.05,
          boxShadow: '0 0 25px rgba(99, 102, 241, 0.65), 0 10px 40px rgba(0, 0, 40, 0.35), inset 0 0 22px rgba(255, 255, 255, 0.2)'
        }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setShowBottomSheet(true)}
        className="fixed z-40 w-[60px] h-[60px] md:w-[70px] md:h-[70px] 
                   bottom-[100px] right-4 md:bottom-6 md:right-6
                   rounded-full flex items-center justify-center
                   transition-all duration-300 group"
        style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(30px) saturate(140%)',
          WebkitBackdropFilter: 'blur(30px) saturate(140%)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 8px 32px rgba(0, 0, 0, 0.04), 0 0 18px rgba(99, 102, 241, 0.3)',
        }}
      >
        {/* Pulsing Ring Animation */}
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, transparent 70%)',
          }}
        />

        {/* Contact Icon */}
        <svg
          className="w-8 h-8 md:w-9 md:h-9 relative z-10 transition-transform duration-300 group-hover:rotate-12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            filter: 'drop-shadow(0 0 8px rgba(99, 102, 241, 0.8))',
            color: '#6366F1'
          }}
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          <circle cx="9" cy="10" r="1" fill="currentColor" />
          <circle cx="12" cy="10" r="1" fill="currentColor" />
          <circle cx="15" cy="10" r="1" fill="currentColor" />
        </svg>

        {/* Online Badge */}
        {isOnline && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center border-2 border-white shadow-lg"
          >
            <span className="text-[10px] text-white font-bold">●</span>
          </motion.div>
        )}
      </motion.button>

      {/* Bottom Sheet Modal */}
      <AnimatePresence>
        {showBottomSheet && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowBottomSheet(false)}
              className="fixed inset-0 z-50 backdrop-blur-sm"
              style={{
                background: 'rgba(0, 0, 0, 0.2)',
              }}
            />

            {/* Bottom Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{
                type: 'spring',
                stiffness: 400,
                damping: 40,
              }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.2 }}
              onDragEnd={(_: any, info: any) => {
                if (info.offset.y > 150) {
                  setShowBottomSheet(false);
                }
              }}
              className="fixed bottom-0 left-0 right-0 z-50 pb-safe"
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(30px)',
                WebkitBackdropFilter: 'blur(30px)',
                borderTopLeftRadius: '32px',
                borderTopRightRadius: '32px',
                boxShadow: '0 -10px 60px rgba(0, 0, 40, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
              }}
            >
              {/* Drag Handle */}
              <div className="flex justify-center pt-3 pb-2">
                <div 
                  className="w-12 h-1.5 rounded-full"
                  style={{
                    background: 'rgba(0, 0, 0, 0.15)',
                  }}
                />
              </div>

              <div className="px-6 pb-8">
                {/* Header */}
                <div className="text-center mb-6 mt-2">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
                    className="text-5xl mb-3"
                  >
                    💬
                  </motion.div>
                  <h3 className="gradient-title text-2xl font-bold mb-1">
                    Contact Us
                  </h3>
                  <p className="text-gray-400 text-sm font-medium">
                    We're here to support your fitness journey
                  </p>
                </div>

                {/* Offline Banner */}
                {!isOnline && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-4 glass-chip border-orange-200"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255, 200, 124, 0.15) 0%, rgba(255, 152, 0, 0.15) 100%)',
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">⚠️</span>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-orange-800">
                          We are currently offline
                        </p>
                        <p className="text-xs text-orange-700 mt-0.5">
                          Business hours: {config.businessHoursStart}:00 - {config.businessHoursEnd}:00
                        </p>
                        <p className="text-xs text-orange-600 mt-1">
                          Feel free to message us, we'll respond as soon as we're back!
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Action Buttons */}
                <div className="space-y-3">
                  {/* WhatsApp Button */}
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleWhatsApp}
                    className="w-full p-4 glass-chip font-bold text-white shadow-lg hover:shadow-xl transition-all"
                    style={{
                      background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                      boxShadow: '0 8px 24px rgba(37, 211, 102, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                    }}
                  >
                    <div className="flex items-center justify-center gap-3">
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="white">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      <span className="text-lg">Chat on WhatsApp</span>
                    </div>
                  </motion.button>

                  {/* Call Button */}
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCall}
                    className="w-full p-4 glass-chip font-semibold border transition-all"
                    style={{
                      background: 'rgba(255, 255, 255, 0.5)',
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                      border: '1px solid rgba(45, 110, 248, 0.3)',
                      boxShadow: '0 4px 16px rgba(45, 110, 248, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
                    }}
                  >
                    <div className="flex items-center justify-center gap-3 text-[#2D6EF8]">
                      <span className="text-2xl">📞</span>
                      <span className="text-lg">Call Us</span>
                    </div>
                  </motion.button>

                  {/* Email Button */}
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleEmail}
                    className="w-full p-4 glass-chip font-semibold border transition-all"
                    style={{
                      background: 'rgba(255, 255, 255, 0.5)',
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                      border: '1px solid rgba(138, 92, 246, 0.3)',
                      boxShadow: '0 4px 16px rgba(138, 92, 246, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
                    }}
                  >
                    <div className="flex items-center justify-center gap-3 text-[#8A5CF6]">
                      <span className="text-2xl">✉️</span>
                      <span className="text-lg">Email Support</span>
                    </div>
                  </motion.button>

                  {/* FAQ Button */}
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleFAQ}
                    className="w-full p-4 glass-chip font-semibold border transition-all"
                    style={{
                      background: 'rgba(255, 255, 255, 0.5)',
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 106, 61, 0.3)',
                      boxShadow: '0 4px 16px rgba(255, 106, 61, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
                    }}
                  >
                    <div className="flex items-center justify-center gap-3 text-[#FF6A3D]">
                      <span className="text-2xl">❓</span>
                      <span className="text-lg">Visit FAQ</span>
                    </div>
                  </motion.button>
                </div>

                {/* Close Button */}
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowBottomSheet(false)}
                  className="w-full mt-4 py-3 text-gray-400 font-semibold glass-chip hover:bg-gray-100 transition-all"
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

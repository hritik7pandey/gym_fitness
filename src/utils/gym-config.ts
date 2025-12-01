// Gym Details Configuration
// This file contains all gym contact and business information
// Update these details according to your gym's information

export const GYM_DETAILS = {
  // Contact Information
  name: 'Fitsense Gym',
  whatsappNumber: '919136688997', // Without + or country code (India format: 91 + 10 digits)
  supportPhone: '+919136688997', // With country code
  supportEmail: 'support@fitsense.com',
  
  // Business Hours (24-hour format)
  businessHours: {
    start: 9, // 9 AM
    end: 21,  // 9 PM
  },
  
  // Location
  address: '123 Fitness Street, Gym City',
  
  // Social Media
  instagram: 'https://instagram.com/fitsense',
  facebook: 'https://facebook.com/fitsense',
  
  // Features
  features: {
    enableContactWidget: true,
    enableWhatsApp: true,
    enablePhone: true,
    enableEmail: true,
  },
};

// Helper function to get contact configuration
export function getContactConfig() {
  // Try to load from localStorage (admin settings override)
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('contactSettings');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return {
          whatsappNumber: parsed.whatsappNumber || GYM_DETAILS.whatsappNumber,
          supportPhone: parsed.supportPhone || GYM_DETAILS.supportPhone,
          supportEmail: parsed.supportEmail || GYM_DETAILS.supportEmail,
          businessHoursStart: parsed.businessHoursStart ?? GYM_DETAILS.businessHours.start,
          businessHoursEnd: parsed.businessHoursEnd ?? GYM_DETAILS.businessHours.end,
          enableContactWidget: parsed.enableContactWidget ?? GYM_DETAILS.features.enableContactWidget,
        };
      } catch (e) {
        console.error('Failed to parse stored settings:', e);
      }
    }
  }
  
  // Return defaults
  return {
    whatsappNumber: GYM_DETAILS.whatsappNumber,
    supportPhone: GYM_DETAILS.supportPhone,
    supportEmail: GYM_DETAILS.supportEmail,
    businessHoursStart: GYM_DETAILS.businessHours.start,
    businessHoursEnd: GYM_DETAILS.businessHours.end,
    enableContactWidget: GYM_DETAILS.features.enableContactWidget,
  };
}

// Helper to format WhatsApp message
export function formatWhatsAppMessage(userName?: string, userId?: string, membershipStatus?: string) {
  let message = `Hello ${GYM_DETAILS.name}! I need assistance.`;
  if (userName) message += `\n\nName: ${userName}`;
  if (userId) message += `\nUser ID: ${userId}`;
  if (membershipStatus) message += `\nMembership: ${membershipStatus}`;
  return encodeURIComponent(message);
}

// Helper to get WhatsApp URL
export function getWhatsAppURL(userName?: string, userId?: string, membershipStatus?: string) {
  const config = getContactConfig();
  const message = formatWhatsAppMessage(userName, userId, membershipStatus);
  return `https://wa.me/${config.whatsappNumber}?text=${message}`;
}

export default GYM_DETAILS;

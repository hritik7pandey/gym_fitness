import { useEffect, useState } from 'react';

interface HubAccessStatus {
  hasAccess: boolean;
  isLoading: boolean;
  isExpired: boolean;
  expiryDate: Date | null;
  error: string | null;
}

interface UserWithHub {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  hasPremiumHubAccess?: boolean;
  premiumHubAccessEndDate?: string;
}

/**
 * Hook to check if user has Premium Hub Access
 * Premium Hub Access (₹199/month) is required for:
 * - Workout tracking and sessions
 * - Diet plans and meal logging
 * - Attendance tracking
 * 
 * Free features (no hub access needed):
 * - Announcements
 * - Profile management
 * - Settings
 */
export function useHubAccess(): HubAccessStatus {
  const [status, setStatus] = useState<HubAccessStatus>({
    hasAccess: false,
    isLoading: true,
    isExpired: false,
    expiryDate: null,
    error: null,
  });

  useEffect(() => {
    checkHubAccess();
  }, []);

  const checkHubAccess = async () => {
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      
      if (!token) {
        setStatus({
          hasAccess: false,
          isLoading: false,
          isExpired: false,
          expiryDate: null,
          error: 'Not authenticated',
        });
        return;
      }

      // Fetch fresh user data from API
      const response = await fetch('/api/users/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const data = await response.json();
      
      if (!data.success || !data.user) {
        throw new Error('Invalid response');
      }

      const user = data.user as UserWithHub;

      // Admins always have full access
      if (user.role === 'admin') {
        setStatus({
          hasAccess: true,
          isLoading: false,
          isExpired: false,
          expiryDate: null,
          error: null,
        });
        return;
      }

      // Check hub access status
      const hasPremiumHub = user.hasPremiumHubAccess || false;
      const expiryDate = user.premiumHubAccessEndDate ? new Date(user.premiumHubAccessEndDate) : null;
      const isExpired = expiryDate ? new Date() > expiryDate : false;
      const hasActiveAccess = hasPremiumHub && !isExpired;

      console.log('🔐 Hub Access Check:', {
        hasPremiumHub,
        expiryDate: expiryDate?.toISOString(),
        isExpired,
        hasActiveAccess,
        userRole: user.role
      });

      setStatus({
        hasAccess: hasActiveAccess,
        isLoading: false,
        isExpired,
        expiryDate,
        error: !hasActiveAccess ? 'Premium Hub Access required' : null,
      });
    } catch (error) {
      console.error('Hub access check error:', error);
      setStatus({
        hasAccess: false,
        isLoading: false,
        isExpired: false,
        expiryDate: null,
        error: 'Failed to verify hub access',
      });
    }
  };

  return status;
}

/**
 * Helper function to check if a feature requires hub access
 */
export function isHubFeature(feature: string): boolean {
  const hubFeatures = [
    'workouts',
    'workout-session',
    'nutrition',
    'diet',
    'attendance',
    'stats',
    'progress',
  ];
  
  return hubFeatures.includes(feature.toLowerCase());
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { requiresHubAccess, hasActiveHubAccess } from '@/lib/access-control';

interface UseAccessControlOptions {
    redirectTo?: string;
    showUpgradeMessage?: boolean;
}

export function useAccessControl(options: UseAccessControlOptions = {}) {
    const router = useRouter();
    const pathname = usePathname();
    const [isChecking, setIsChecking] = useState(true);
    const [hasAccess, setHasAccess] = useState(false);
    const [userData, setUserData] = useState<any>(null);

    useEffect(() => {
        checkAccess();
    }, [pathname]);

    const checkAccess = async () => {
        try {
            // Check if current route requires Premium Hub Access
            if (!requiresHubAccess(pathname)) {
                setHasAccess(true);
                setIsChecking(false);
                return;
            }

            // Get user data
            const token = localStorage.getItem('authToken') || localStorage.getItem('token');
            if (!token) {
                // Not logged in, redirect to login
                router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
                return;
            }

            // Fetch user data from API
            const response = await fetch('/api/users/me', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                // Invalid token, redirect to login
                localStorage.removeItem('authToken');
                localStorage.removeItem('token');
                router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
                return;
            }

            const data = await response.json();

            if (data.success && data.user) {
                setUserData(data.user);

                // Admins always have full access - skip Premium Hub Access check
                if (data.user.role === 'admin') {
                    setHasAccess(true);
                    setIsChecking(false);
                    return;
                }

                // Check if user has Premium Hub Access
                const userHasAccess = hasActiveHubAccess({
                    hasPremiumHubAccess: data.user.hasPremiumHubAccess,
                    premiumHubAccessEndDate: data.user.premiumHubAccessEndDate,
                });

                setHasAccess(userHasAccess);

                // If no access, redirect to profile with upgrade message
                if (!userHasAccess) {
                    const redirectUrl = options.redirectTo || '/profile?upgrade=true&reason=premium_required';
                    router.push(redirectUrl);
                }
            }
        } catch (error) {
            console.error('Access control error:', error);
            // On error, allow access but log the issue
            setHasAccess(true);
        } finally {
            setIsChecking(false);
        }
    };

    return {
        isChecking,
        hasAccess,
        userData,
    };
}

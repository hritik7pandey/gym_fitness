/**
 * Access Control Utility
 * Checks if user has Premium Hub Access for restricted features
 */

export interface UserAccessInfo {
    hasPremiumHubAccess: boolean;
    membershipType?: string;
    premiumHubAccessEndDate?: Date;
}

/**
 * Check if user has active Premium Hub Access
 */
export function hasActiveHubAccess(user: UserAccessInfo): boolean {
    if (!user.hasPremiumHubAccess) {
        return false;
    }

    // If there's an end date, check if it's still valid
    if (user.premiumHubAccessEndDate) {
        const now = new Date();
        const endDate = new Date(user.premiumHubAccessEndDate);
        return now <= endDate;
    }

    // If no end date but has access flag, allow access
    return true;
}

/**
 * Routes that require Premium Hub Access (₹199/month)
 * Note: Dashboard is accessible to all users, but some features within require hub access
 */
export const PREMIUM_ROUTES = [
    '/workouts',
    '/nutrition',
    '/diet',
    '/attendance',
    '/progress',
    '/analytics',
];

/**
 * Routes accessible without Premium Hub Access
 */
export const PUBLIC_ROUTES = [
    '/',
    '/login',
    '/auth/signin',
    '/auth/signup',
    '/register',
    '/plans',
    '/contact',
    '/profile',
    '/settings',
];

/**
 * Admin routes (require admin role)
 */
export const ADMIN_ROUTES = [
    '/admin',
];

/**
 * Check if a route requires Premium Hub Access
 */
export function requiresHubAccess(pathname: string): boolean {
    return PREMIUM_ROUTES.some(route => pathname.startsWith(route));
}

/**
 * Check if a route is publicly accessible
 */
export function isPublicRoute(pathname: string): boolean {
    return PUBLIC_ROUTES.some(route => pathname.startsWith(route));
}

/**
 * Check if a route is an admin route
 */
export function isAdminRoute(pathname: string): boolean {
    return ADMIN_ROUTES.some(route => pathname.startsWith(route));
}

/**
 * Get redirect URL based on access level
 */
export function getRedirectUrl(pathname: string, hasAccess: boolean): string | null {
    // If trying to access premium route without access
    if (requiresHubAccess(pathname) && !hasAccess) {
        return '/profile?upgrade=true&reason=premium_required';
    }

    return null;
}

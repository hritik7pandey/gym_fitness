import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, JWTPayload } from '@/lib/jwt';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export type AuthResult = { error: string } | JWTPayload;

export function authMiddleware(request: NextRequest): AuthResult {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');

  if (!token) {
    return { error: 'Unauthorized - No token provided' };
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    return { error: 'Unauthorized - Invalid token' };
  }

  return decoded;
}

export function adminMiddleware(request: NextRequest): AuthResult {
  const decoded = authMiddleware(request);

  if ('error' in decoded) {
    return decoded; // Return error object
  }

  if (decoded.role !== 'admin') {
    return { error: 'Forbidden - Admin access required' };
  }

  return decoded;
}

/**
 * Hub Access Middleware
 * Restricts access to premium hub features (workouts, diet, attendance)
 * Requires active Premium Hub Access subscription (₹199/month)
 */
export async function hubAccessMiddleware(request: NextRequest): Promise<AuthResult> {
  const decoded = authMiddleware(request);

  if ('error' in decoded) {
    return decoded; // Return auth error
  }

  // Admins have full access to all features
  if (decoded.role === 'admin') {
    return decoded;
  }

  try {
    await connectDB();
    
    const user = await User.findById(decoded.userId).select('hasPremiumHubAccess premiumHubAccessEndDate').lean();
    
    if (!user) {
      return { error: 'User not found' };
    }

    // Check if user has premium hub access
    if (!user.hasPremiumHubAccess) {
      return { error: 'Premium Hub Access required - Please upgrade to access workout tracking, diet plans, and attendance features' };
    }

    // Check if hub access is still active (not expired)
    if (user.premiumHubAccessEndDate && new Date() > new Date(user.premiumHubAccessEndDate)) {
      return { error: 'Premium Hub Access expired - Please renew your subscription to continue using premium features' };
    }

    return decoded;
  } catch (error) {
    console.error('Hub access middleware error:', error);
    return { error: 'Failed to verify hub access' };
  }
}

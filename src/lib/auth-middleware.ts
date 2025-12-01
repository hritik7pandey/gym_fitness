import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, JWTPayload } from '@/lib/jwt';

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

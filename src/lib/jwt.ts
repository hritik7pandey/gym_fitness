import jwt from 'jsonwebtoken';

const JWT_SECRET: string = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || '7d';

export interface JWTPayload {
  userId: string;
  email: string;
  role: 'user' | 'admin';
}

export function generateToken(payload: JWTPayload): string {
  // @ts-ignore - jwt typing issue with process.env
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

export function generateRefreshToken(payload: JWTPayload): string {
  // @ts-ignore - jwt typing issue with process.env
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' });
}

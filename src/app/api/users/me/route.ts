import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import jwt from 'jsonwebtoken';


/**
 * GET /api/users/me
 * Fetch current authenticated user's data
 * Requires: Authorization header with Bearer token
 */
export async function GET(req: NextRequest) {
    try {
        await dbConnect();

        // Get token from Authorization header
        const authHeader = req.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'No token provided',
                },
                { status: 401 }
            );
        }

        const token = authHeader.split(' ')[1];

        // Verify token
        const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
        let decoded: any;
        try {
            decoded = jwt.verify(token, JWT_SECRET);
        } catch (error) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Invalid or expired token',
                },
                { status: 401 }
            );
        }

        // Fetch user data
        const user = await User.findById(decoded.userId).select('-password');

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'User not found',
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                membershipType: user.membershipType,
                membershipStartDate: user.membershipStartDate,
                membershipEndDate: user.membershipEndDate,
                hasPremiumHubAccess: user.hasPremiumHubAccess,
                premiumHubAccessEndDate: user.premiumHubAccessEndDate,
                premiumHubAccessStartDate: user.premiumHubAccessStartDate,
                attendanceStreak: user.attendanceStreak,
                isEmailVerified: user.isEmailVerified,
                createdAt: user.createdAt,
            },
        });
    } catch (error: any) {
        console.error('Error fetching user data:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Failed to fetch user data',
                error: error.message,
            },
            { status: 500 }
        );
    }
}

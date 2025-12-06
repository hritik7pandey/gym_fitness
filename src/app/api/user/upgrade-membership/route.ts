import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: NextRequest) {
  try {
    // Verify authentication - prioritize Bearer token, fallback to cookie
    let token = req.cookies.get('token')?.value;

    // Check Authorization header for Bearer token
    const authHeader = req.headers.get('authorization');
    if (!token && authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { membershipType } = await req.json();

    if (!membershipType || !['basic', 'premium', 'vip'].includes(membershipType)) {
      return NextResponse.json(
        { error: 'Invalid membership type' },
        { status: 400 }
      );
    }

    await connectDB();

    // Find user
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update membership
    user.membershipType = membershipType;
    
    // Set membership start date if not already set
    if (!user.membershipStartDate) {
      user.membershipStartDate = new Date();
    }
    
    // Extend expiry by 30 days from now (or from current expiry if still active)
    const now = new Date();
    const currentExpiry = user.membershipEndDate ? new Date(user.membershipEndDate) : now;
    const newExpiry = currentExpiry > now ? currentExpiry : now;
    newExpiry.setDate(newExpiry.getDate() + 30);
    user.membershipEndDate = newExpiry;

    await user.save();

    return NextResponse.json({
      message: 'Membership updated successfully',
      membershipType: user.membershipType,
      membershipEndDate: user.membershipEndDate
    });

  } catch (error) {
    console.error('Upgrade membership error:', error);
    return NextResponse.json(
      { error: 'Failed to update membership' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { authMiddleware } from '@/lib/auth-middleware';

// GET /api/user/profile
export async function GET(request: NextRequest) {
  try {
    const decoded = authMiddleware(request);
    if ('error' in decoded) {
      return NextResponse.json({ success: false, message: decoded.error }, { status: 401 });
    }

    await dbConnect();

    const user = await User.findById(decoded.userId).select('-password -emailVerificationOTP -resetPasswordOTP');

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user,
    });

  } catch (error: any) {
    console.error('Get profile error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error', error: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/user/profile
export async function PUT(request: NextRequest) {
  try {
    const decoded = authMiddleware(request);
    if ('error' in decoded) {
      return NextResponse.json({ success: false, message: decoded.error }, { status: 401 });
    }

    await dbConnect();

    const updates = await request.json();

    // Don't allow updating sensitive fields
    delete updates.password;
    delete updates.email;
    delete updates.role;
    delete updates.isEmailVerified;

    const user = await User.findByIdAndUpdate(
      decoded.userId,
      updates,
      { new: true, runValidators: true }
    ).select('-password -emailVerificationOTP -resetPasswordOTP');

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Recalculate BMI if height or weight changed
    if (updates.height || updates.weight) {
      user.calculateBMI();
      await user.save();
    }

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user,
    });

  } catch (error: any) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error', error: error.message },
      { status: 500 }
    );
  }
}

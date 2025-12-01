import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { adminMiddleware } from '@/lib/auth-middleware';
import { sendEmail, generateOTPEmail } from '@/lib/email';

// Get single user
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authResult = adminMiddleware(request);
    if ('error' in authResult) {
      return NextResponse.json({ success: false, message: authResult.error }, { status: 403 });
    }

    const { id } = params;

    await connectDB();

    const user = await User.findById(id)
      .select('-password -otp -otpExpiry -resetPasswordOtp -resetPasswordOtpExpiry')
      .populate('workoutPlanId', 'name description')
      .populate('dietPlanId', 'name description');

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
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
        isEmailVerified: user.isEmailVerified,
        age: user.age,
        gender: user.gender,
        height: user.height,
        weight: user.weight,
        bmi: user.bmi,
        membershipType: user.membershipType,
        membershipStartDate: user.membershipStartDate,
        membershipEndDate: user.membershipEndDate,
        membershipDuration: user.membershipDuration,
        attendanceStreak: user.attendanceStreak,
        waterIntakeGoal: user.waterIntakeGoal,
        workoutPlan: user.workoutPlanId,
        dietPlan: user.dietPlanId,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error: any) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to get user' },
      { status: 500 }
    );
  }
}

// Update user
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authResult = adminMiddleware(request);
    if ('error' in authResult) {
      return NextResponse.json({ success: false, message: authResult.error }, { status: 403 });
    }

    const { id } = params;
    const updates = await request.json();

    await connectDB();

    // Don't allow password updates through this endpoint
    delete updates.password;
    delete updates.otp;
    delete updates.otpExpiry;

    const user = await User.findByIdAndUpdate(id, updates, { new: true })
      .select('-password -otp -otpExpiry -resetPasswordOtp -resetPasswordOtpExpiry');

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'User updated successfully',
      user,
    });
  } catch (error: any) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update user' },
      { status: 500 }
    );
  }
}

// Delete user
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authResult = adminMiddleware(request);
    if ('error' in authResult) {
      return NextResponse.json({ success: false, message: authResult.error }, { status: 403 });
    }

    const { id } = params;

    await connectDB();

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete user error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to delete user' },
      { status: 500 }
    );
  }
}

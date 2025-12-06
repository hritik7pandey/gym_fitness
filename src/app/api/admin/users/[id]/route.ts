import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { adminMiddleware } from '@/lib/auth-middleware';
import { sendEmail, generateOTPEmail, generatePremiumHubAccessEmail } from '@/lib/email';
import Announcement from '@/models/Announcement';

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

    console.log('Received updates for user:', id, updates);

    await connectDB();

    // Don't allow password updates through this endpoint
    delete updates.password;
    delete updates.otp;
    delete updates.otpExpiry;

    // Explicitly handle hasPremiumHubAccess if present
    const updatePayload: any = { ...updates };
    if (typeof updates.hasPremiumHubAccess !== 'undefined') {
      updatePayload.hasPremiumHubAccess = updates.hasPremiumHubAccess;
      // Set dates if enabling access
      if (updates.hasPremiumHubAccess) {
        if (!updates.premiumHubAccessStartDate) updatePayload.premiumHubAccessStartDate = new Date();
        if (!updates.premiumHubAccessEndDate) {
          const endDate = new Date();
          endDate.setMonth(endDate.getMonth() + 1); // Default 1 month
          updatePayload.premiumHubAccessEndDate = endDate;
        }
      }
    }

    console.log('Final update payload:', updatePayload);

    const user = await User.findByIdAndUpdate(id, updatePayload, { new: true })
      .select('-password -otp -otpExpiry -resetPasswordOtp -resetPasswordOtpExpiry');

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    console.log('Updated user hasPremiumHubAccess:', user.hasPremiumHubAccess);

    // Send email notification if premium hub access was just granted
    if (updatePayload.hasPremiumHubAccess && updates.hasPremiumHubAccess) {
      try {
        // Send email
        await sendEmail({
          to: user.email,
          subject: '🎉 Premium Hub Access Activated!',
          html: generatePremiumHubAccessEmail(
            user.name,
            new Date(user.premiumHubAccessEndDate || new Date()).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })
          ),
        });

        // Create in-app announcement
        await Announcement.create({
          title: '🎉 Premium Hub Access Activated',
          message: `Congratulations! Your Premium Hub Access has been activated. You now have full access to all features including workout tracking, nutrition plans, and attendance management. Your access is valid until ${new Date(user.premiumHubAccessEndDate || new Date()).toLocaleDateString()}.`,
          priority: 'important',
          category: 'system',
          createdBy: authResult.userId,
          audience: {
            type: 'specific_users',
            userIds: [user._id.toString()],
            membershipTypes: [],
          },
          isActive: true,
          expiresAt: user.premiumHubAccessEndDate,
          sticky: false,
        });
      } catch (emailError) {
        console.error('Failed to send hub access notification:', emailError);
        // Don't fail the whole request if email fails
      }
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

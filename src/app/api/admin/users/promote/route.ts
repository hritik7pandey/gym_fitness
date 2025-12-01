import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { adminMiddleware } from '@/lib/auth-middleware';
import { sendEmail, generateOTPEmail } from '@/lib/email';

// Promote user to admin with OTP verification
export async function POST(request: NextRequest) {
  try {
    const authResult = adminMiddleware(request);
    if ('error' in authResult) {
      return NextResponse.json({ success: false, message: authResult.error }, { status: 403 });
    }

    const { userId, otp, action } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    if (action === 'request') {
      // Generate OTP and send to user's email
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      user.emailVerificationOTP = otpCode;
      user.emailVerificationOTPExpiry = otpExpiry;
      await user.save();

      const emailHtml = generateOTPEmail(otpCode, 'verification');
      await sendEmail({
        to: user.email,
        subject: 'Admin Promotion - OTP Verification',
        html: emailHtml,
      });

      return NextResponse.json({
        success: true,
        message: 'OTP sent to user email for verification',
      });
    } else if (action === 'verify') {
      // Verify OTP and promote to admin
      if (!otp) {
        return NextResponse.json(
          { success: false, message: 'OTP is required' },
          { status: 400 }
        );
      }

      if (user.emailVerificationOTP !== otp) {
        return NextResponse.json(
          { success: false, message: 'Invalid OTP' },
          { status: 400 }
        );
      }

      if (!user.emailVerificationOTPExpiry || user.emailVerificationOTPExpiry < new Date()) {
        return NextResponse.json(
          { success: false, message: 'OTP has expired' },
          { status: 400 }
        );
      }

      // Promote to admin
      user.role = 'admin';
      user.emailVerificationOTP = undefined;
      user.emailVerificationOTPExpiry = undefined;
      await user.save();

      return NextResponse.json({
        success: true,
        message: 'User promoted to admin successfully',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } else {
      return NextResponse.json(
        { success: false, message: 'Invalid action. Use "request" or "verify"' },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Promote to admin error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to promote user' },
      { status: 500 }
    );
  }
}

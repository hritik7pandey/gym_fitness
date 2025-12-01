import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { adminMiddleware } from '@/lib/auth-middleware';
import bcrypt from 'bcryptjs';
import { sendEmail, generateOTPEmail } from '@/lib/email';

// Create new user (by admin)
export async function POST(request: NextRequest) {
  try {
    const authResult = adminMiddleware(request);
    if ('error' in authResult) {
      return NextResponse.json({ success: false, message: authResult.error }, { status: 403 });
    }

    const { name, email, phone, password, membershipType, membershipDuration, age, gender, height, weight } = await request.json();

    if (!name || !email) {
      return NextResponse.json(
        { success: false, message: 'Name and email are required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Generate temporary password if not provided
    const tempPassword = password || Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(tempPassword, 12);

    // Generate OTP for email verification
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Calculate membership dates
    const membershipStartDate = new Date();
    const membershipEndDate = new Date();
    membershipEndDate.setDate(membershipEndDate.getDate() + (membershipDuration || 30));

    // Create user
    const newUser = new User({
      name,
      email,
      phone: phone || '',
      password: hashedPassword,
      role: 'user',
      membershipType: membershipType || 'Basic',
      membershipDuration: membershipDuration || 30,
      membershipStartDate,
      membershipEndDate,
      age: age || null,
      gender: gender || 'Other',
      height: height || null,
      weight: weight || null,
      emailVerificationOTP: otp,
      emailVerificationOTPExpiry: otpExpiry,
      isEmailVerified: false,
    });

    await newUser.save();

    // Send verification email
    try {
      const emailHtml = generateOTPEmail(otp, 'verification');
      await sendEmail({
        to: email,
        subject: 'Welcome to FitSense - Verify Your Email',
        html: emailHtml,
      });
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
    }

    return NextResponse.json({
      success: true,
      message: 'User created successfully. Verification email sent.',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        membershipType: newUser.membershipType,
        tempPassword: !password ? tempPassword : undefined, // Only send if auto-generated
      },
    });
  } catch (error: any) {
    console.error('Create user error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create user' },
      { status: 500 }
    );
  }
}

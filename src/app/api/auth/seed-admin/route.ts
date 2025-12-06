import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

// POST /api/auth/seed-admin
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@fitsense.com' });

    if (existingAdmin) {
      return NextResponse.json({
        success: false,
        message: 'Admin user already exists',
      }, { status: 400 });
    }

    // Create admin user
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@fitsense.com',
      password: 'admin123',
      role: 'admin',
      isEmailVerified: true,
    });

    return NextResponse.json({
      success: true,
      message: 'Admin user created successfully',
      credentials: {
        email: 'admin@fitsense.com',
        password: 'admin123',
      },
    }, { status: 201 });

  } catch (error: any) {
    console.error('Admin seed error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error', error: error.message },
      { status: 500 }
    );
  }
}

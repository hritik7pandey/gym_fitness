import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

// POST /api/auth/seed-database
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    // Admin user
    const adminData = {
      name: 'Admin',
      email: 'admin@fitsense.com',
      phone: '+919876543210',
      password: 'Admin@123',
      role: 'admin',
      isEmailVerified: true,
    };

    // Sample Indian users
    const usersData = [
      {
        name: 'Rohan Sharma',
        email: 'rohan.sharma@gmail.com',
        phone: '+919876543211',
        password: 'User@123',
        role: 'user',
        isEmailVerified: true,
      },
      {
        name: 'Aditi Patel',
        email: 'aditi.patel@gmail.com',
        phone: '+919876543212',
        password: 'User@123',
        role: 'user',
        isEmailVerified: true,
      },
      {
        name: 'Kunal Reddy',
        email: 'kunal.reddy@gmail.com',
        phone: '+919876543213',
        password: 'User@123',
        role: 'user',
        isEmailVerified: true,
      },
      {
        name: 'Priya Singh',
        email: 'priya.singh@gmail.com',
        phone: '+919876543214',
        password: 'User@123',
        role: 'user',
        isEmailVerified: true,
      },
      {
        name: 'Arjun Mehta',
        email: 'arjun.mehta@gmail.com',
        phone: '+919876543215',
        password: 'User@123',
        role: 'user',
        isEmailVerified: true,
      },
      {
        name: 'Sneha Iyer',
        email: 'sneha.iyer@gmail.com',
        phone: '+919876543216',
        password: 'User@123',
        role: 'user',
        isEmailVerified: true,
      },
      {
        name: 'Vikram Kapoor',
        email: 'vikram.kapoor@gmail.com',
        phone: '+919876543217',
        password: 'User@123',
        role: 'user',
        isEmailVerified: true,
      },
      {
        name: 'Ananya Gupta',
        email: 'ananya.gupta@gmail.com',
        phone: '+919876543218',
        password: 'User@123',
        role: 'user',
        isEmailVerified: true,
      },
    ];

    const createdUsers = [];

    // Check and create admin
    const existingAdmin = await User.findOne({ email: adminData.email });
    if (!existingAdmin) {
      const admin = await User.create(adminData);
      createdUsers.push({ name: admin.name, email: admin.email, role: admin.role });
    } else {
      createdUsers.push({ name: existingAdmin.name, email: existingAdmin.email, role: existingAdmin.role, status: 'already exists' });
    }

    // Check and create users
    for (const userData of usersData) {
      const existingUser = await User.findOne({ email: userData.email });
      if (!existingUser) {
        const user = await User.create(userData);
        createdUsers.push({ name: user.name, email: user.email, role: user.role });
      } else {
        createdUsers.push({ name: existingUser.name, email: existingUser.email, role: existingUser.role, status: 'already exists' });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      users: createdUsers,
      credentials: {
        admin: { email: 'admin@fitsense.com', password: 'Admin@123' },
        users: { email: 'any user email above', password: 'User@123' },
      },
    }, { status: 201 });

  } catch (error: any) {
    console.error('Database seed error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error', error: error.message },
      { status: 500 }
    );
  }
}

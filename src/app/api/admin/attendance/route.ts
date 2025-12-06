import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Attendance from '@/models/Attendance';
import User from '@/models/User';
import { adminMiddleware } from '@/lib/auth-middleware';

// Admin: Get all users' attendance for a specific date
export async function GET(request: NextRequest) {
  try {
    const authResult = adminMiddleware(request);
    if ('error' in authResult) {
      return NextResponse.json({ success: false, message: authResult.error }, { status: 403 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get('date');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const status = searchParams.get('status'); // Filter by status

    const targetDate = dateParam ? new Date(dateParam) : new Date();
    targetDate.setHours(0, 0, 0, 0);
    const dateString = targetDate.toISOString().split('T')[0];

    // Get all users
    const totalUsers = await User.countDocuments({ role: 'user' });
    const users = await User.find({ role: 'user' })
      .select('name email phone membershipType attendanceStreak')
      .skip((page - 1) * limit)
      .limit(limit);

    // Get attendance for the target date
    const attendanceRecords = await Attendance.find({
      date: dateString,
      ...(status && { status }),
    }).populate('userId', 'name email');

    const attendanceMap = new Map();
    attendanceRecords.forEach((record) => {
      attendanceMap.set(record.userId._id.toString(), record);
    });

    // Combine user data with attendance
    const attendanceData = users.map((user) => {
      const attendance = attendanceMap.get(user._id.toString());
      return {
        userId: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        membershipType: user.membershipType,
        streak: user.attendanceStreak,
        attendance: attendance
          ? {
              checkIn: attendance.checkIn,
              checkOut: attendance.checkOut,
              status: attendance.status,
            }
          : { status: 'absent' },
      };
    });

    // Calculate statistics
    const presentCount = attendanceRecords.filter((a) => a.status === 'present').length;
    const lateCount = attendanceRecords.filter((a) => a.status === 'late').length;
    const absentCount = totalUsers - attendanceRecords.length;

    return NextResponse.json({
      success: true,
      date: dateString,
      statistics: {
        total: totalUsers,
        present: presentCount,
        late: lateCount,
        absent: absentCount,
        attendanceRate: Math.round(((presentCount + lateCount) / totalUsers) * 100),
      },
      attendance: attendanceData,
      pagination: {
        page,
        limit,
        total: totalUsers,
        pages: Math.ceil(totalUsers / limit),
      },
    });
  } catch (error: any) {
    console.error('Admin attendance error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to get attendance data' },
      { status: 500 }
    );
  }
}

// Admin: Mark attendance manually
export async function POST(request: NextRequest) {
  try {
    const authResult = adminMiddleware(request);
    if ('error' in authResult) {
      return NextResponse.json({ success: false, message: authResult.error }, { status: 403 });
    }

    const { userId, date, status, checkIn, checkOut } = await request.json();

    if (!userId || !date || !status) {
      return NextResponse.json(
        { success: false, message: 'User ID, date, and status are required' },
        { status: 400 }
      );
    }

    await connectDB();

    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    const dateString = targetDate.toISOString().split('T')[0];

    const attendance = await Attendance.findOneAndUpdate(
      { userId, date: dateString },
      {
        status,
        checkIn: checkIn ? new Date(checkIn) : undefined,
        checkOut: checkOut ? new Date(checkOut) : undefined,
        markedBy: 'admin',
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Attendance marked successfully',
      attendance,
    });
  } catch (error: any) {
    console.error('Mark attendance error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to mark attendance' },
      { status: 500 }
    );
  }
}

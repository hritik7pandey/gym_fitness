import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Attendance from '@/models/Attendance';
import User from '@/models/User';
import { authMiddleware } from '@/lib/auth-middleware';

export async function POST(request: NextRequest) {
  try {
    const authResult = authMiddleware(request);
    if ('error' in authResult) {
      return NextResponse.json({ success: false, message: authResult.error }, { status: 401 });
    }

    const userId = authResult.userId;

    await connectDB();

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dateString = today.toISOString().split('T')[0]; // YYYY-MM-DD

    // Check if already checked in today
    const existingAttendance = await Attendance.findOne({
      userId,
      date: dateString,
    });

    if (existingAttendance && existingAttendance.checkIn) {
      return NextResponse.json(
        { success: false, message: 'Already checked in today' },
        { status: 400 }
      );
    }

    const now = new Date();
    const hour = now.getHours();
    
    // Determine status based on check-in time (late if after 10 AM)
    const status = hour >= 10 ? 'late' : 'present';

    // Create or update attendance
    const attendance = await Attendance.findOneAndUpdate(
      { userId, date: dateString },
      {
        checkIn: now,
        status,
      },
      { upsert: true, new: true }
    );

    // Update user's attendance streak
    const user = await User.findById(userId);
    if (user) {
      // Calculate streak
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayString = yesterday.toISOString().split('T')[0];

      const yesterdayAttendance = await Attendance.findOne({
        userId,
        date: yesterdayString,
        status: { $in: ['present', 'late'] },
      });

      if (yesterdayAttendance || (user.attendanceStreak || 0) === 0) {
        user.attendanceStreak = (user.attendanceStreak || 0) + 1;
      } else {
        user.attendanceStreak = 1; // Reset streak
      }

      await user.save();
    }

    return NextResponse.json({
      success: true,
      message: 'Checked in successfully',
      attendance: {
        checkIn: attendance.checkIn,
        status: attendance.status,
        streak: user?.attendanceStreak || 1,
      },
    });
  } catch (error: any) {
    console.error('Check-in error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to check in' },
      { status: 500 }
    );
  }
}

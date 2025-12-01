import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Attendance from '@/models/Attendance';
import User from '@/models/User';
import { authMiddleware } from '@/lib/auth-middleware';

export async function GET(request: NextRequest) {
  try {
    const authResult = authMiddleware(request);
    if ('error' in authResult) {
      return NextResponse.json({ success: false, message: authResult.error }, { status: 401 });
    }

    const userId = authResult.userId;
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30', 10);

    await connectDB();

    const user = await User.findById(userId);

    // Get today's attendance
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayString = today.toISOString().split('T')[0];

    const todayAttendance = await Attendance.findOne({
      userId,
      date: todayString,
    });

    // Get historical attendance
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - days);
    const startDateString = startDate.toISOString().split('T')[0];

    const history = await Attendance.find({
      userId,
      date: { $gte: startDateString },
    }).sort({ date: -1 });

    // Calculate statistics
    const totalDays = history.length;
    const presentDays = history.filter((a) => a.status === 'present' || a.status === 'late').length;
    const lateDays = history.filter((a) => a.status === 'late').length;
    const absentDays = days - presentDays;

    const attendancePercentage = totalDays > 0 ? Math.round((presentDays / days) * 100) : 0;

    return NextResponse.json({
      success: true,
      today: todayAttendance
        ? {
            checkIn: todayAttendance.checkIn,
            checkOut: todayAttendance.checkOut,
            status: todayAttendance.status,
          }
        : null,
      streak: user?.attendanceStreak || 0,
      statistics: {
        totalDays: days,
        presentDays,
        lateDays,
        absentDays,
        attendancePercentage,
      },
      history: history.map((a) => ({
        date: a.date,
        checkIn: a.checkIn,
        checkOut: a.checkOut,
        status: a.status,
      })),
    });
  } catch (error: any) {
    console.error('Attendance status error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to get attendance status' },
      { status: 500 }
    );
  }
}

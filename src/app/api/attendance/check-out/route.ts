import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Attendance from '@/models/Attendance';
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

    // Find today's attendance
    const attendance = await Attendance.findOne({
      userId,
      date: dateString,
    });

    if (!attendance || !attendance.checkIn) {
      return NextResponse.json(
        { success: false, message: 'No check-in found for today' },
        { status: 400 }
      );
    }

    if (attendance.checkOut) {
      return NextResponse.json(
        { success: false, message: 'Already checked out today' },
        { status: 400 }
      );
    }

    attendance.checkOut = new Date();
    await attendance.save();

    // Calculate session duration
    const durationMs = attendance.checkOut.getTime() - attendance.checkIn.getTime();
    const durationMinutes = Math.round(durationMs / 60000);

    return NextResponse.json({
      success: true,
      message: 'Checked out successfully',
      attendance: {
        checkIn: attendance.checkIn,
        checkOut: attendance.checkOut,
        duration: durationMinutes,
        status: attendance.status,
      },
    });
  } catch (error: any) {
    console.error('Check-out error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to check out' },
      { status: 500 }
    );
  }
}

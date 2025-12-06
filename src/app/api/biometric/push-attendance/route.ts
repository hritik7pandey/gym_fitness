import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Attendance from '@/models/Attendance';
import User from '@/models/User';

// Biometric device webhook endpoint
// This endpoint receives attendance data from biometric devices
export async function POST(request: NextRequest) {
  try {
    const {
      userId,
      email,
      deviceId,
      machineId,
      punchType,
      timestamp,
      authKey,
    } = await request.json();

    // Verify auth key (you should set this in environment variables)
    const expectedAuthKey = process.env.BIOMETRIC_AUTH_KEY || 'default-biometric-key';
    if (authKey !== expectedAuthKey) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized - Invalid auth key' },
        { status: 401 }
      );
    }

    if (!userId && !email) {
      return NextResponse.json(
        { success: false, message: 'User ID or email is required' },
        { status: 400 }
      );
    }

    if (!punchType || !['in', 'out'].includes(punchType)) {
      return NextResponse.json(
        { success: false, message: 'Invalid punch type' },
        { status: 400 }
      );
    }

    await connectDB();

    // Find user
    let user;
    if (userId) {
      user = await User.findById(userId);
    } else if (email) {
      user = await User.findOne({ email });
    }

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    const punchTime = timestamp ? new Date(timestamp) : new Date();
    const dateOnly = new Date(punchTime);
    dateOnly.setHours(0, 0, 0, 0);
    const dateString = dateOnly.toISOString().split('T')[0];

    if (punchType === 'in') {
      // Check-in
      const existingAttendance = await Attendance.findOne({
        userId: user._id,
        date: dateString,
      });

      if (existingAttendance && existingAttendance.checkIn) {
        return NextResponse.json(
          { success: false, message: 'Already checked in today' },
          { status: 400 }
        );
      }

      const hour = punchTime.getHours();
      const status = hour >= 10 ? 'late' : 'present';

      const attendance = await Attendance.findOneAndUpdate(
        { userId: user._id, date: dateString },
        {
          checkIn: punchTime,
          status,
          biometricDeviceId: deviceId,
          machineId,
          punchType: 'in',
        },
        { upsert: true, new: true }
      );

      // Update streak
      const yesterday = new Date(dateOnly);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayString = yesterday.toISOString().split('T')[0];

      const yesterdayAttendance = await Attendance.findOne({
        userId: user._id,
        date: yesterdayString,
        status: { $in: ['present', 'late'] },
      });

      if (yesterdayAttendance || (user.attendanceStreak || 0) === 0) {
        user.attendanceStreak = (user.attendanceStreak || 0) + 1;
      } else {
        user.attendanceStreak = 1;
      }

      await user.save();

      return NextResponse.json({
        success: true,
        message: 'Check-in recorded',
        attendance: {
          userId: user._id,
          userName: user.name,
          checkIn: attendance.checkIn,
          status: attendance.status,
          streak: user.attendanceStreak,
        },
      });
    } else {
      // Check-out
      const attendance = await Attendance.findOne({
        userId: user._id,
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

      attendance.checkOut = punchTime;
      attendance.punchType = 'out';
      if (machineId) attendance.machineId = machineId;
      if (deviceId) attendance.biometricDeviceId = deviceId;

      await attendance.save();

      const durationMs = attendance.checkOut.getTime() - attendance.checkIn.getTime();
      const durationMinutes = Math.round(durationMs / 60000);

      return NextResponse.json({
        success: true,
        message: 'Check-out recorded',
        attendance: {
          userId: user._id,
          userName: user.name,
          checkIn: attendance.checkIn,
          checkOut: attendance.checkOut,
          duration: durationMinutes,
          status: attendance.status,
        },
      });
    }
  } catch (error: any) {
    console.error('Biometric webhook error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to process attendance' },
      { status: 500 }
    );
  }
}

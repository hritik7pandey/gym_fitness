import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Attendance from '@/models/Attendance';
import User from '@/models/User';
import { adminMiddleware } from '@/lib/auth-middleware';

export async function GET(request: NextRequest) {
  try {
    const authResult = adminMiddleware(request);
    if ('error' in authResult) {
      return NextResponse.json({ success: false, message: authResult.error }, { status: 403 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!startDate || !endDate) {
      return NextResponse.json(
        { success: false, message: 'Start date and end date are required' },
        { status: 400 }
      );
    }

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    // Get all users
    const users = await User.find({ role: 'user' }).select('name email phone membershipType');

    const startDateString = start.toISOString().split('T')[0];
    const endDateString = end.toISOString().split('T')[0];

    // Get attendance records
    const attendanceRecords = await Attendance.find({
      date: { $gte: startDateString, $lte: endDateString },
    });

    // Build CSV
    const csvRows: string[] = [];
    csvRows.push('Date,User Name,Email,Phone,Membership,Check In,Check Out,Status');

    // Group attendance by date
    const dateMap = new Map<string, Map<string, any>>();
    attendanceRecords.forEach((record) => {
      const dateKey = record.date; // Already in YYYY-MM-DD format
      if (!dateMap.has(dateKey)) {
        dateMap.set(dateKey, new Map());
      }
      dateMap.get(dateKey)?.set(record.userId.toString(), record);
    });

    // Create rows for each date and user
    const currentDate = new Date(start);
    while (currentDate <= end) {
      const dateKey = currentDate.toISOString().split('T')[0];
      const dayAttendance = dateMap.get(dateKey);

      users.forEach((user) => {
        const attendance = dayAttendance?.get(user._id.toString());
        const checkIn = attendance?.checkIn
          ? new Date(attendance.checkIn).toLocaleTimeString('en-US', { hour12: false })
          : '-';
        const checkOut = attendance?.checkOut
          ? new Date(attendance.checkOut).toLocaleTimeString('en-US', { hour12: false })
          : '-';
        const status = attendance?.status || 'absent';

        csvRows.push(
          `${dateKey},"${user.name}","${user.email}","${user.phone || '-'}","${
            user.membershipType || 'N/A'
          }","${checkIn}","${checkOut}","${status}"`
        );
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    const csv = csvRows.join('\n');

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="attendance_${startDate}_${endDate}.csv"`,
      },
    });
  } catch (error: any) {
    console.error('Export attendance error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to export attendance' },
      { status: 500 }
    );
  }
}

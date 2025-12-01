import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import connectDB from '@/lib/mongodb';
import WorkoutSession from '@/models/WorkoutSession';

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ success: false, message: 'No token provided' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = parseInt(searchParams.get('skip') || '0');
    const period = searchParams.get('period') || 'all'; // all, week, month, year

    await connectDB();

    let dateFilter = {};
    const now = new Date();

    if (period === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      dateFilter = { startTime: { $gte: weekAgo } };
    } else if (period === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      dateFilter = { startTime: { $gte: monthAgo } };
    } else if (period === 'year') {
      const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      dateFilter = { startTime: { $gte: yearAgo } };
    }

    const sessions = await WorkoutSession.find({
      userId: decoded.userId,
      isCompleted: true,
      ...dateFilter,
    })
      .sort({ startTime: -1 })
      .limit(limit)
      .skip(skip)
      .select('-exercises.sets -heartRateSamples');

    const total = await WorkoutSession.countDocuments({
      userId: decoded.userId,
      isCompleted: true,
      ...dateFilter,
    });

    // Calculate summary stats
    const totalMinutes = sessions.reduce((sum, s) => sum + (s.duration || 0), 0);
    const totalCalories = sessions.reduce((sum, s) => sum + (s.caloriesBurned || 0), 0);
    const totalVolume = sessions.reduce((sum, s) => sum + (s.totalVolume || 0), 0);

    return NextResponse.json({
      success: true,
      sessions: sessions,
      total: total,
      limit: limit,
      skip: skip,
      summary: {
        totalWorkouts: sessions.length,
        totalMinutes: totalMinutes,
        totalCalories: totalCalories,
        totalVolume: totalVolume,
        averageDuration: sessions.length > 0 ? Math.round(totalMinutes / sessions.length) : 0,
      },
    });

  } catch (error) {
    console.error('Error fetching workout history:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to fetch workout history' 
    }, { status: 500 });
  }
}

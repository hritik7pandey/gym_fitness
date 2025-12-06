import { NextRequest, NextResponse } from 'next/server';
import { hubAccessMiddleware } from '@/lib/auth-middleware';
import connectDB from '@/lib/mongodb';
import WorkoutSession from '@/models/WorkoutSession';

export async function GET(request: NextRequest) {
  try {
    const authResult = await hubAccessMiddleware(request);
    if ('error' in authResult) {
      return NextResponse.json({ success: false, message: authResult.error }, { status: 403 });
    }
    const decoded = authResult;

    await connectDB();

    const stats = await WorkoutSession.getWeeklyStats(decoded.userId);

    // Get last 7 days breakdown
    const dailyStats = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const sessions = await WorkoutSession.find({
        userId: decoded.userId,
        isCompleted: true,
        startTime: {
          $gte: date,
          $lt: nextDate,
        },
      });

      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      
      dailyStats.push({
        date: date.toISOString().split('T')[0],
        dayName: dayName,
        workouts: sessions.length,
        minutes: sessions.reduce((sum, s) => sum + (s.duration || 0), 0),
        calories: sessions.reduce((sum, s) => sum + (s.caloriesBurned || 0), 0),
        volume: sessions.reduce((sum, s) => sum + (s.totalVolume || 0), 0),
      });
    }

    // Calculate streak
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    for (let i = dailyStats.length - 1; i >= 0; i--) {
      if (dailyStats[i].workouts > 0) {
        tempStreak++;
        if (i === dailyStats.length - 1) {
          currentStreak = tempStreak;
        }
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        if (i === dailyStats.length - 1) {
          currentStreak = 0;
        }
        tempStreak = 0;
      }
    }

    return NextResponse.json({
      success: true,
      weekly: {
        ...stats,
        dailyStats: dailyStats,
        currentStreak: currentStreak,
        longestStreak: longestStreak,
      },
    });

  } catch (error) {
    console.error('Error fetching weekly stats:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to fetch weekly stats' 
    }, { status: 500 });
  }
}

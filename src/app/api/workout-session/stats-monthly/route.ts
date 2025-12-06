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

    const stats = await WorkoutSession.getMonthlyStats(decoded.userId);

    // Calculate recovery score
    const recentWorkouts = await WorkoutSession.find({
      userId: decoded.userId,
      isCompleted: true,
      startTime: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    }).sort({ startTime: -1 });

    const lastWorkout = recentWorkouts[0];
    const daysSinceLastWorkout = lastWorkout 
      ? Math.floor((Date.now() - new Date(lastWorkout.startTime).getTime()) / (1000 * 60 * 60 * 24))
      : 7;

    const weeklyVolume = recentWorkouts.reduce((sum, s) => sum + (s.totalVolume || 0), 0);
    const averageIntensity = recentWorkouts.length > 0 
      ? recentWorkouts.reduce((sum, s) => sum + (s.perceivedExertion || 5), 0) / recentWorkouts.length
      : 5;

    let recoveryScore: 'excellent' | 'good' | 'moderate' | 'needed' = 'good';
    let recoveryMessage = 'You\'re well recovered';

    if (daysSinceLastWorkout === 0) {
      recoveryScore = 'needed';
      recoveryMessage = 'Consider taking a rest day';
    } else if (daysSinceLastWorkout === 1 && averageIntensity > 7) {
      recoveryScore = 'moderate';
      recoveryMessage = 'Light activity recommended';
    } else if (daysSinceLastWorkout >= 3) {
      recoveryScore = 'excellent';
      recoveryMessage = 'Fully recovered and ready';
    }

    return NextResponse.json({
      success: true,
      monthly: {
        ...stats,
        recovery: {
          score: recoveryScore,
          message: recoveryMessage,
          daysSinceLastWorkout: daysSinceLastWorkout,
          weeklyVolume: weeklyVolume,
          averageIntensity: Math.round(averageIntensity * 10) / 10,
          workoutsThisWeek: recentWorkouts.length,
        },
      },
    });

  } catch (error) {
    console.error('Error fetching monthly stats:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to fetch monthly stats' 
    }, { status: 500 });
  }
}

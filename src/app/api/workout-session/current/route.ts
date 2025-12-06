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

    const session = await WorkoutSession.getActiveSession(decoded.userId);
    
    if (!session) {
      return NextResponse.json({ 
        success: true, 
        hasActiveSession: false,
        session: null 
      });
    }

    // Calculate current metrics
    const elapsedTime = session.getElapsedTime();
    const durationMinutes = Math.floor(elapsedTime / 1000 / 60);
    session.calculateVolume();
    session.calculateCalories();

    const currentExercise = session.getCurrentExercise();

    return NextResponse.json({
      success: true,
      hasActiveSession: true,
      session: {
        sessionId: session._id,
        workoutName: session.workoutName,
        startTime: session.startTime,
        elapsedTime: elapsedTime,
        durationMinutes: durationMinutes,
        isPaused: session.isPaused,
        isCompleted: session.isCompleted,
        currentExerciseIndex: session.currentExerciseIndex,
        totalExercises: session.exercises.length,
        exercises: session.exercises,
        currentExercise: currentExercise,
        totalSets: session.totalSets,
        totalReps: session.totalReps,
        totalVolume: session.totalVolume,
        caloriesBurned: session.caloriesBurned,
        totalPausedTime: session.totalPausedTime,
      },
    });

  } catch (error) {
    console.error('Error fetching current workout session:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to fetch workout session' 
    }, { status: 500 });
  }
}

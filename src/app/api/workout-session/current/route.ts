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

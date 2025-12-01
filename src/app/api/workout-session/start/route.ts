import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import connectDB from '@/lib/mongodb';
import WorkoutSession from '@/models/WorkoutSession';
import WorkoutPlan from '@/models/WorkoutPlan';

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ success: false, message: 'No token provided' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();
    const { workoutId, workoutName, exercises } = body;

    if (!exercises || !Array.isArray(exercises) || exercises.length === 0) {
      return NextResponse.json({ 
        success: false, 
        message: 'Exercises array is required and cannot be empty' 
      }, { status: 400 });
    }

    await connectDB();

    // Check if user already has an active session
    const existingSession = await WorkoutSession.getActiveSession(decoded.userId);
    if (existingSession) {
      return NextResponse.json({ 
        success: false, 
        message: 'You already have an active workout session',
        activeSession: existingSession
      }, { status: 400 });
    }

    // Create exercises array with sets
    const sessionExercises = exercises.map((ex: any) => ({
      exerciseId: ex.id || ex._id,
      name: ex.name,
      targetSets: ex.sets || 3,
      targetReps: ex.reps || 10,
      category: ex.type || ex.category,
      equipment: ex.equipment,
      sets: Array.from({ length: ex.sets || 3 }, (_, i) => ({
        setNumber: i + 1,
        reps: 0,
        weight: 0,
        completed: false,
        restSeconds: ex.restSeconds || 60,
      })),
      status: 'pending',
    }));

    // Mark first exercise as active
    if (sessionExercises.length > 0) {
      sessionExercises[0].status = 'active';
      sessionExercises[0].startedAt = new Date();
    }

    // Create new workout session
    const session = new WorkoutSession({
      userId: decoded.userId,
      workoutId: workoutId,
      workoutName: workoutName || 'Custom Workout',
      startTime: new Date(),
      exercises: sessionExercises,
      isPaused: false,
      isCompleted: false,
      currentExerciseIndex: 0,
      totalPausedTime: 0,
    });

    await session.save();

    return NextResponse.json({
      success: true,
      message: 'Workout session started',
      session: {
        sessionId: session._id,
        startTime: session.startTime,
        workoutName: session.workoutName,
        exercises: session.exercises,
        currentExerciseIndex: session.currentExerciseIndex,
        isPaused: session.isPaused,
      },
    });

  } catch (error) {
    console.error('Error starting workout session:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to start workout session',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

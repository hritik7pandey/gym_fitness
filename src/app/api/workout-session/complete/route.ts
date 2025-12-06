import { NextRequest, NextResponse } from 'next/server';
import { hubAccessMiddleware } from '@/lib/auth-middleware';
import connectDB from '@/lib/mongodb';
import WorkoutSession from '@/models/WorkoutSession';

export async function POST(request: NextRequest) {
  try {
    const authResult = await hubAccessMiddleware(request);
    if ('error' in authResult) {
      return NextResponse.json({ success: false, message: authResult.error }, { status: 403 });
    }
    const decoded = authResult;

    const body = await request.json();
    const { sessionId, perceivedExertion, notes } = body;

    await connectDB();

    const session = await WorkoutSession.findOne({ _id: sessionId, userId: decoded.userId });
    
    if (!session) {
      return NextResponse.json({ success: false, message: 'Session not found' }, { status: 404 });
    }

    if (session.isCompleted) {
      return NextResponse.json({ success: false, message: 'Session already completed' }, { status: 400 });
    }

    // Add user feedback
    if (perceivedExertion) session.perceivedExertion = perceivedExertion;
    if (notes) session.notes = notes;

    // Complete the session
    session.completeSession();
    await session.save();

    return NextResponse.json({
      success: true,
      message: 'Workout completed successfully! 🎉',
      session: {
        sessionId: session._id,
        workoutName: session.workoutName,
        duration: session.duration,
        caloriesBurned: session.caloriesBurned,
        totalVolume: session.totalVolume,
        totalSets: session.totalSets,
        totalReps: session.totalReps,
        startTime: session.startTime,
        endTime: session.endTime,
        exercises: session.exercises.map((ex: any) => ({
          name: ex.name,
          completedSets: ex.sets.filter((s: any) => s.completed).length,
          totalSets: ex.sets.length,
          status: ex.status,
        })),
      },
    });

  } catch (error) {
    console.error('Error completing workout session:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to complete workout session' 
    }, { status: 500 });
  }
}

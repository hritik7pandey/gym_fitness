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
    const { sessionId } = body;

    await connectDB();

    const session = await WorkoutSession.findOne({ _id: sessionId, userId: decoded.userId });
    
    if (!session) {
      return NextResponse.json({ success: false, message: 'Session not found' }, { status: 404 });
    }

    if (session.isCompleted) {
      return NextResponse.json({ success: false, message: 'Session already completed' }, { status: 400 });
    }

    const moved = session.previousExercise();
    
    if (!moved) {
      return NextResponse.json({ 
        success: false, 
        message: 'Already at first exercise'
      }, { status: 400 });
    }

    await session.save();

    const currentExercise = session.getCurrentExercise();

    return NextResponse.json({
      success: true,
      message: 'Moved to previous exercise',
      session: {
        sessionId: session._id,
        currentExerciseIndex: session.currentExerciseIndex,
        totalExercises: session.exercises.length,
        currentExercise: currentExercise,
      },
    });

  } catch (error) {
    console.error('Error moving to previous exercise:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to move to previous exercise' 
    }, { status: 500 });
  }
}

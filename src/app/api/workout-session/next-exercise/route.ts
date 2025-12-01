import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import connectDB from '@/lib/mongodb';
import WorkoutSession from '@/models/WorkoutSession';

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
    const { sessionId } = body;

    await connectDB();

    const session = await WorkoutSession.findOne({ _id: sessionId, userId: decoded.userId });
    
    if (!session) {
      return NextResponse.json({ success: false, message: 'Session not found' }, { status: 404 });
    }

    if (session.isCompleted) {
      return NextResponse.json({ success: false, message: 'Session already completed' }, { status: 400 });
    }

    const moved = session.nextExercise();
    
    if (!moved) {
      return NextResponse.json({ 
        success: false, 
        message: 'Already at last exercise',
        canComplete: true
      }, { status: 400 });
    }

    await session.save();

    const currentExercise = session.getCurrentExercise();

    return NextResponse.json({
      success: true,
      message: 'Moved to next exercise',
      session: {
        sessionId: session._id,
        currentExerciseIndex: session.currentExerciseIndex,
        totalExercises: session.exercises.length,
        currentExercise: currentExercise,
        isLastExercise: session.currentExerciseIndex === session.exercises.length - 1,
      },
    });

  } catch (error) {
    console.error('Error moving to next exercise:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to move to next exercise' 
    }, { status: 500 });
  }
}

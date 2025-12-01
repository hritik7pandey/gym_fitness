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

    if (session.isPaused) {
      return NextResponse.json({ success: false, message: 'Session already paused' }, { status: 400 });
    }

    // Mark as paused and record pause start time
    session.isPaused = true;
    session.pauseStartTime = new Date();
    await session.save();

    return NextResponse.json({
      success: true,
      message: 'Workout paused',
      session: {
        sessionId: session._id,
        isPaused: session.isPaused,
        pauseStartTime: session.pauseStartTime,
        elapsedTime: session.getElapsedTime(),
      },
    });

  } catch (error) {
    console.error('Error pausing workout session:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to pause workout session' 
    }, { status: 500 });
  }
}

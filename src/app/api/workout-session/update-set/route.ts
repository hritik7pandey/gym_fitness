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
    const { sessionId, exerciseIndex, setIndex, reps, weight, completed } = body;

    await connectDB();

    const session = await WorkoutSession.findOne({ _id: sessionId, userId: decoded.userId });
    
    if (!session) {
      return NextResponse.json({ success: false, message: 'Session not found' }, { status: 404 });
    }

    if (session.isCompleted) {
      return NextResponse.json({ success: false, message: 'Session already completed' }, { status: 400 });
    }

    if (exerciseIndex < 0 || exerciseIndex >= session.exercises.length) {
      return NextResponse.json({ success: false, message: 'Invalid exercise index' }, { status: 400 });
    }

    const exercise = session.exercises[exerciseIndex];
    
    if (setIndex < 0 || setIndex >= exercise.sets.length) {
      return NextResponse.json({ success: false, message: 'Invalid set index' }, { status: 400 });
    }

    const set = exercise.sets[setIndex];
    
    // Update set data
    if (reps !== undefined) set.reps = reps;
    if (weight !== undefined) set.weight = weight;
    if (completed !== undefined) {
      set.completed = completed;
      if (completed) {
        set.completedAt = new Date();
      }
    }

    // Recalculate volume and calories
    session.calculateVolume();
    session.calculateCalories();

    await session.save();

    return NextResponse.json({
      success: true,
      message: 'Set updated',
      session: {
        sessionId: session._id,
        exercise: exercise,
        totalVolume: session.totalVolume,
        totalSets: session.totalSets,
        totalReps: session.totalReps,
        caloriesBurned: session.caloriesBurned,
      },
    });

  } catch (error) {
    console.error('Error updating set:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to update set' 
    }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import WorkoutHistory from '@/models/WorkoutHistory';
import { hubAccessMiddleware } from '@/lib/auth-middleware';

// Get workout history
export async function GET(request: NextRequest) {
  try {
    const authResult = await hubAccessMiddleware(request);
    if ('error' in authResult) {
      return NextResponse.json({ success: false, message: authResult.error }, { status: 403 });
    }

    const userId = authResult.userId;
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '30', 10);

    await connectDB();

    const history = await WorkoutHistory.find({ userId })
      .sort({ date: -1 })
      .limit(limit)
      .populate('workoutPlanId', 'name description');

    return NextResponse.json({
      success: true,
      history: history.map((h) => ({
        id: h._id,
        workoutPlan: h.workoutPlanId,
        date: h.date,
        duration: h.duration,
        caloriesBurned: h.caloriesBurned,
        completedExercises: h.completedExercises,
        totalExercises: h.totalExercises,
        notes: h.notes,
        rating: h.rating,
      })),
    });
  } catch (error: any) {
    console.error('Get workout history error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to get workout history' },
      { status: 500 }
    );
  }
}

// Log workout completion
export async function POST(request: NextRequest) {
  try {
    const authResult = await hubAccessMiddleware(request);
    if ('error' in authResult) {
      return NextResponse.json({ success: false, message: authResult.error }, { status: 403 });
    }

    const userId = authResult.userId;
    const { workoutPlanId, duration, caloriesBurned, completedExercises, totalExercises, notes, rating } = await request.json();

    if (!workoutPlanId) {
      return NextResponse.json(
        { success: false, message: 'Workout plan ID is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const workoutHistory = new WorkoutHistory({
      userId,
      workoutPlanId,
      date: new Date(),
      duration: duration || 0,
      caloriesBurned: caloriesBurned || 0,
      completedExercises: completedExercises || 0,
      totalExercises: totalExercises || 0,
      notes: notes || '',
      rating: rating || undefined,
    });

    await workoutHistory.save();

    return NextResponse.json({
      success: true,
      message: 'Workout logged successfully',
      workoutHistory: {
        id: workoutHistory._id,
        date: workoutHistory.date,
        duration: workoutHistory.duration,
        caloriesBurned: workoutHistory.caloriesBurned,
      },
    });
  } catch (error: any) {
    console.error('Log workout error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to log workout' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import WorkoutPlan from '@/models/WorkoutPlan';
import { hubAccessMiddleware } from '@/lib/auth-middleware';

export async function GET(request: NextRequest) {
  try {
    const authResult = await hubAccessMiddleware(request);
    if ('error' in authResult) {
      return NextResponse.json({ success: false, message: authResult.error }, { status: 403 });
    }

    const userId = authResult.userId;

    await connectDB();

    // Get user's assigned workout plan
    const workoutPlan = await WorkoutPlan.findOne({
      assignedTo: userId,
    }).sort({ createdAt: -1 });

    if (!workoutPlan) {
      return NextResponse.json({
        success: true,
        message: 'No workout plan assigned',
        workoutPlan: null,
      });
    }

    return NextResponse.json({
      success: true,
      workoutPlan: {
        id: workoutPlan._id,
        name: workoutPlan.name,
        description: workoutPlan.description,
        difficulty: workoutPlan.difficulty,
        duration: workoutPlan.duration,
        exercises: workoutPlan.exercises,
        createdAt: workoutPlan.createdAt,
      },
    });
  } catch (error: any) {
    console.error('Get workout plan error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to get workout plan' },
      { status: 500 }
    );
  }
}

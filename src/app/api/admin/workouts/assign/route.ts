import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import WorkoutPlan from '@/models/WorkoutPlan';
import User from '@/models/User';
import { adminMiddleware } from '@/lib/auth-middleware';

// Assign workout plan to users
export async function POST(request: NextRequest) {
  try {
    const authResult = adminMiddleware(request);
    if ('error' in authResult) {
      return NextResponse.json({ success: false, message: authResult.error }, { status: 403 });
    }

    const { workoutPlanId, userIds } = await request.json();

    if (!workoutPlanId || !userIds || userIds.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Workout plan ID and user IDs are required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Update workout plan
    const workoutPlan = await WorkoutPlan.findByIdAndUpdate(
      workoutPlanId,
      { $addToSet: { assignedTo: { $each: userIds } } },
      { new: true }
    );

    if (!workoutPlan) {
      return NextResponse.json(
        { success: false, message: 'Workout plan not found' },
        { status: 404 }
      );
    }

    // Update users
    await User.updateMany(
      { _id: { $in: userIds } },
      { $set: { workoutPlanId: workoutPlanId } }
    );

    return NextResponse.json({
      success: true,
      message: `Workout plan assigned to ${userIds.length} user(s)`,
      workoutPlan,
    });
  } catch (error: any) {
    console.error('Assign workout plan error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to assign workout plan' },
      { status: 500 }
    );
  }
}

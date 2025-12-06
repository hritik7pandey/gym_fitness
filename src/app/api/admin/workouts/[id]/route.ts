import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import WorkoutPlan from '@/models/WorkoutPlan';
import User from '@/models/User';
import { adminMiddleware } from '@/lib/auth-middleware';

// Update workout plan
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authResult = adminMiddleware(request);
    if ('error' in authResult) {
      return NextResponse.json({ success: false, message: authResult.error }, { status: 403 });
    }

    const { id } = params;
    const updates = await request.json();

    await connectDB();

    const workoutPlan = await WorkoutPlan.findByIdAndUpdate(id, updates, { new: true });

    if (!workoutPlan) {
      return NextResponse.json(
        { success: false, message: 'Workout plan not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Workout plan updated successfully',
      workoutPlan,
    });
  } catch (error: any) {
    console.error('Update workout plan error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update workout plan' },
      { status: 500 }
    );
  }
}

// Delete workout plan
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authResult = adminMiddleware(request);
    if ('error' in authResult) {
      return NextResponse.json({ success: false, message: authResult.error }, { status: 403 });
    }

    const { id } = params;

    await connectDB();

    const workoutPlan = await WorkoutPlan.findByIdAndDelete(id);

    if (!workoutPlan) {
      return NextResponse.json(
        { success: false, message: 'Workout plan not found' },
        { status: 404 }
      );
    }

    // Remove workout plan reference from users
    await User.updateMany(
      { workoutPlanId: id },
      { $unset: { workoutPlanId: '' } }
    );

    return NextResponse.json({
      success: true,
      message: 'Workout plan deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete workout plan error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to delete workout plan' },
      { status: 500 }
    );
  }
}

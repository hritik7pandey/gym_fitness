import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import DietPlan from '@/models/DietPlan';
import User from '@/models/User';
import { adminMiddleware } from '@/lib/auth-middleware';

// Assign diet plan to users
export async function POST(request: NextRequest) {
  try {
    const authResult = adminMiddleware(request);
    if ('error' in authResult) {
      return NextResponse.json({ success: false, message: authResult.error }, { status: 403 });
    }

    const { dietPlanId, userIds } = await request.json();

    if (!dietPlanId || !userIds || userIds.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Diet plan ID and user IDs are required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Update diet plan
    const dietPlan = await DietPlan.findByIdAndUpdate(
      dietPlanId,
      { $addToSet: { assignedTo: { $each: userIds } } },
      { new: true }
    );

    if (!dietPlan) {
      return NextResponse.json(
        { success: false, message: 'Diet plan not found' },
        { status: 404 }
      );
    }

    // Update users
    await User.updateMany(
      { _id: { $in: userIds } },
      { $set: { dietPlanId: dietPlanId } }
    );

    return NextResponse.json({
      success: true,
      message: `Diet plan assigned to ${userIds.length} user(s)`,
      dietPlan,
    });
  } catch (error: any) {
    console.error('Assign diet plan error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to assign diet plan' },
      { status: 500 }
    );
  }
}

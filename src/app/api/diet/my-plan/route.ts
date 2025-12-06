import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import DietPlan from '@/models/DietPlan';
import { hubAccessMiddleware } from '@/lib/auth-middleware';

export async function GET(request: NextRequest) {
  try {
    const authResult = await hubAccessMiddleware(request);
    if ('error' in authResult) {
      return NextResponse.json({ success: false, message: authResult.error }, { status: 403 });
    }

    const userId = authResult.userId;

    await connectDB();

    // Get user's assigned diet plan
    const dietPlan = await DietPlan.findOne({
      assignedTo: userId,
    }).sort({ createdAt: -1 });

    if (!dietPlan) {
      return NextResponse.json({
        success: true,
        message: 'No diet plan assigned',
        dietPlan: null,
      });
    }

    return NextResponse.json({
      success: true,
      dietPlan: {
        id: dietPlan._id,
        name: dietPlan.name,
        description: dietPlan.description,
        targetCalories: dietPlan.targetCalories,
        dietType: dietPlan.dietType,
        weeklyPlan: dietPlan.weeklyPlan,
        createdAt: dietPlan.createdAt,
      },
    });
  } catch (error: any) {
    console.error('Get diet plan error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to get diet plan' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import DietPlan from '@/models/DietPlan';
import { adminMiddleware } from '@/lib/auth-middleware';

// Get all diet plans
export async function GET(request: NextRequest) {
  try {
    const authResult = adminMiddleware(request);
    if ('error' in authResult) {
      return NextResponse.json({ success: false, message: authResult.error }, { status: 403 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const isTemplate = searchParams.get('isTemplate');

    const query: any = {};
    if (isTemplate === 'true') {
      query.isTemplate = true;
    }

    const dietPlans = await DietPlan.find(query)
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      dietPlans: dietPlans.map((plan) => ({
        id: plan._id,
        name: plan.name,
        description: plan.description,
        targetCalories: plan.targetCalories,
        dietType: plan.dietType,
        weeklyPlan: plan.weeklyPlan,
        isTemplate: plan.isTemplate,
        assignedTo: plan.assignedTo,
        createdAt: plan.createdAt,
      })),
    });
  } catch (error: any) {
    console.error('Get diet plans error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to get diet plans' },
      { status: 500 }
    );
  }
}

// Create diet plan or template
export async function POST(request: NextRequest) {
  try {
    const authResult = adminMiddleware(request);
    if ('error' in authResult) {
      return NextResponse.json({ success: false, message: authResult.error }, { status: 403 });
    }

    const { 
      name, 
      description, 
      targetCalories, 
      dietType,
      weeklyPlan, 
      isTemplate, 
      assignedTo,
      createdBy,
    } = await request.json();

    if (!name || !weeklyPlan || weeklyPlan.length !== 7) {
      return NextResponse.json(
        { success: false, message: 'Name and 7-day weekly plan are required' },
        { status: 400 }
      );
    }

    if (!createdBy) {
      return NextResponse.json(
        { success: false, message: 'Creator ID is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const dietPlan = new DietPlan({
      name,
      description: description || '',
      targetCalories: targetCalories || 2000,
      dietType: dietType || 'Balanced',
      weeklyPlan,
      createdBy,
      isTemplate: isTemplate || false,
      assignedTo: assignedTo || [],
    });

    await dietPlan.save();

    return NextResponse.json({
      success: true,
      message: 'Diet plan created successfully',
      dietPlan: {
        id: dietPlan._id,
        name: dietPlan.name,
        description: dietPlan.description,
        targetCalories: dietPlan.targetCalories,
        dietType: dietPlan.dietType,
        weeklyPlan: dietPlan.weeklyPlan,
        isTemplate: dietPlan.isTemplate,
        assignedTo: dietPlan.assignedTo,
      },
    });
  } catch (error: any) {
    console.error('Create diet plan error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create diet plan' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import WorkoutPlan from '@/models/WorkoutPlan';
import { adminMiddleware } from '@/lib/auth-middleware';

// Get all workout plans (including templates)
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

    const workoutPlans = await WorkoutPlan.find(query)
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      workoutPlans: workoutPlans.map((plan) => ({
        id: plan._id,
        name: plan.name,
        description: plan.description,
        difficulty: plan.difficulty,
        duration: plan.duration,
        exercises: plan.exercises,
        isTemplate: plan.isTemplate,
        assignedTo: plan.assignedTo,
        createdAt: plan.createdAt,
      })),
    });
  } catch (error: any) {
    console.error('Get workout plans error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to get workout plans' },
      { status: 500 }
    );
  }
}

// Create workout plan or template
export async function POST(request: NextRequest) {
  try {
    const authResult = adminMiddleware(request);
    if ('error' in authResult) {
      return NextResponse.json({ success: false, message: authResult.error }, { status: 403 });
    }

    const { name, description, difficulty, duration, exercises, isTemplate, assignedTo } = await request.json();

    if (!name || !exercises || exercises.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Name and exercises are required' },
        { status: 400 }
      );
    }

    await connectDB();

    const workoutPlan = new WorkoutPlan({
      name,
      description: description || '',
      difficulty: difficulty || 'Intermediate',
      duration: duration || 60,
      exercises,
      type: 'Custom',
      createdBy: authResult.userId, // Use admin's userId
      isTemplate: isTemplate || false,
      assignedTo: assignedTo || [],
    });

    await workoutPlan.save();

    return NextResponse.json({
      success: true,
      message: 'Workout plan created successfully',
      workoutPlan: {
        id: workoutPlan._id,
        name: workoutPlan.name,
        description: workoutPlan.description,
        difficulty: workoutPlan.difficulty,
        duration: workoutPlan.duration,
        exercises: workoutPlan.exercises,
        isTemplate: workoutPlan.isTemplate,
        assignedTo: workoutPlan.assignedTo,
      },
    });
  } catch (error: any) {
    console.error('Create workout plan error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create workout plan' },
      { status: 500 }
    );
  }
}

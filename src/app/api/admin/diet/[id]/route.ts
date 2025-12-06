import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import DietPlan from '@/models/DietPlan';
import User from '@/models/User';
import { adminMiddleware } from '@/lib/auth-middleware';

// Get single diet plan by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = adminMiddleware(request);
    if ('error' in authResult) {
      return NextResponse.json({ success: false, message: authResult.error }, { status: 403 });
    }

    await connectDB();

    const dietPlan = await DietPlan.findById(params.id)
      .populate('assignedTo', 'name email membershipType')
      .populate('createdBy', 'name email');

    if (!dietPlan) {
      return NextResponse.json(
        { success: false, message: 'Diet plan not found' },
        { status: 404 }
      );
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
        isTemplate: dietPlan.isTemplate,
        assignedTo: dietPlan.assignedTo,
        createdBy: dietPlan.createdBy,
        createdAt: dietPlan.createdAt,
        updatedAt: dietPlan.updatedAt,
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

// Update diet plan
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    } = await request.json();

    if (weeklyPlan && weeklyPlan.length !== 7) {
      return NextResponse.json(
        { success: false, message: 'Weekly plan must contain exactly 7 days' },
        { status: 400 }
      );
    }

    await connectDB();

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (targetCalories !== undefined) updateData.targetCalories = targetCalories;
    if (dietType !== undefined) updateData.dietType = dietType;
    if (weeklyPlan !== undefined) updateData.weeklyPlan = weeklyPlan;
    if (isTemplate !== undefined) updateData.isTemplate = isTemplate;

    const dietPlan = await DietPlan.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('assignedTo', 'name email');

    if (!dietPlan) {
      return NextResponse.json(
        { success: false, message: 'Diet plan not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Diet plan updated successfully',
      dietPlan: {
        id: dietPlan._id,
        name: dietPlan.name,
        description: dietPlan.description,
        targetCalories: dietPlan.targetCalories,
        dietType: dietPlan.dietType,
        weeklyPlan: dietPlan.weeklyPlan,
        isTemplate: dietPlan.isTemplate,
        assignedTo: dietPlan.assignedTo,
        updatedAt: dietPlan.updatedAt,
      },
    });
  } catch (error: any) {
    console.error('Update diet plan error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update diet plan' },
      { status: 500 }
    );
  }
}

// Delete diet plan
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = adminMiddleware(request);
    if ('error' in authResult) {
      return NextResponse.json({ success: false, message: authResult.error }, { status: 403 });
    }

    await connectDB();

    const dietPlan = await DietPlan.findById(params.id);

    if (!dietPlan) {
      return NextResponse.json(
        { success: false, message: 'Diet plan not found' },
        { status: 404 }
      );
    }

    // Remove dietPlanId reference from all users who have this plan
    if (dietPlan.assignedTo && dietPlan.assignedTo.length > 0) {
      await User.updateMany(
        { dietPlanId: params.id },
        { $unset: { dietPlanId: '' } }
      );
    }

    // Delete the diet plan
    await DietPlan.findByIdAndDelete(params.id);

    return NextResponse.json({
      success: true,
      message: 'Diet plan deleted successfully',
      deletedCount: dietPlan.assignedTo?.length || 0,
    });
  } catch (error: any) {
    console.error('Delete diet plan error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to delete diet plan' },
      { status: 500 }
    );
  }
}

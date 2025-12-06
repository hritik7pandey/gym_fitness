import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { hubAccessMiddleware } from '@/lib/auth-middleware';
import mongoose from 'mongoose';

// Simple meal log schema
const MealLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true }, // YYYY-MM-DD format
  meals: [{
    mealId: String,
    name: String,
    time: String,
    calories: Number,
    protein: Number,
    carbs: Number,
    fats: Number,
    loggedAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

const MealLog = mongoose.models.MealLog || mongoose.model('MealLog', MealLogSchema);

// POST /api/diet/log-meal - Log a meal
export async function POST(request: NextRequest) {
  try {
    const decoded = await hubAccessMiddleware(request);
    if ('error' in decoded) {
      return NextResponse.json({ success: false, message: decoded.error }, { status: 403 });
    }

    await dbConnect();

    const { meal } = await request.json();
    
    if (!meal || !meal.name) {
      return NextResponse.json(
        { success: false, message: 'Meal data is required' },
        { status: 400 }
      );
    }

    const today = new Date().toISOString().split('T')[0];

    // Find or create today's meal log
    let mealLog = await MealLog.findOne({ 
      userId: decoded.userId, 
      date: today 
    });

    if (!mealLog) {
      mealLog = new MealLog({
        userId: decoded.userId,
        date: today,
        meals: []
      });
    }

    // Add the meal
    mealLog.meals.push({
      mealId: meal.id || `meal-${Date.now()}`,
      name: meal.name,
      time: meal.time || new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      calories: meal.calories || 0,
      protein: meal.protein || 0,
      carbs: meal.carbs || 0,
      fats: meal.fats || 0,
      loggedAt: new Date()
    });

    await mealLog.save();

    // Calculate totals
    const totals = mealLog.meals.reduce((acc: any, m: any) => ({
      calories: acc.calories + (m.calories || 0),
      protein: acc.protein + (m.protein || 0),
      carbs: acc.carbs + (m.carbs || 0),
      fats: acc.fats + (m.fats || 0),
    }), { calories: 0, protein: 0, carbs: 0, fats: 0 });

    return NextResponse.json({
      success: true,
      message: 'Meal logged successfully',
      meal: mealLog.meals[mealLog.meals.length - 1],
      totals,
      mealsLogged: mealLog.meals.length
    });

  } catch (error: any) {
    console.error('Log meal error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error', error: error.message },
      { status: 500 }
    );
  }
}

// GET /api/diet/log-meal - Get today's logged meals
export async function GET(request: NextRequest) {
  try {
    const decoded = authMiddleware(request);
    if ('error' in decoded) {
      return NextResponse.json({ success: false, message: decoded.error }, { status: 401 });
    }

    await dbConnect();

    const today = new Date().toISOString().split('T')[0];
    
    const mealLog = await MealLog.findOne({ 
      userId: decoded.userId, 
      date: today 
    });

    if (!mealLog) {
      return NextResponse.json({
        success: true,
        meals: [],
        totals: { calories: 0, protein: 0, carbs: 0, fats: 0 }
      });
    }

    const totals = mealLog.meals.reduce((acc: any, m: any) => ({
      calories: acc.calories + (m.calories || 0),
      protein: acc.protein + (m.protein || 0),
      carbs: acc.carbs + (m.carbs || 0),
      fats: acc.fats + (m.fats || 0),
    }), { calories: 0, protein: 0, carbs: 0, fats: 0 });

    return NextResponse.json({
      success: true,
      meals: mealLog.meals,
      totals
    });

  } catch (error: any) {
    console.error('Get meal log error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error', error: error.message },
      { status: 500 }
    );
  }
}

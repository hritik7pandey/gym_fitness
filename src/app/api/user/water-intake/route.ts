import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { authMiddleware } from '@/lib/auth-middleware';
import mongoose from 'mongoose';

// Water intake tracking with daily reset
const WaterLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true }, // YYYY-MM-DD format
  intake: { type: Number, default: 0 },
}, { timestamps: true });

const WaterLog = mongoose.models.WaterLog || mongoose.model('WaterLog', WaterLogSchema);

// POST /api/user/water-intake
export async function POST(request: NextRequest) {
  try {
    const decoded = authMiddleware(request);
    if ('error' in decoded) {
      return NextResponse.json({ success: false, message: decoded.error }, { status: 401 });
    }

    await dbConnect();

    const { amount } = await request.json(); // amount in ml

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { success: false, message: 'Valid amount is required' },
        { status: 400 }
      );
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    const today = new Date().toISOString().split('T')[0];
    
    // Find or create today's water log
    let waterLog = await WaterLog.findOne({ userId: decoded.userId, date: today });
    
    if (!waterLog) {
      waterLog = new WaterLog({
        userId: decoded.userId,
        date: today,
        intake: 0
      });
    }

    waterLog.intake += amount;
    await waterLog.save();

    const goal = user.waterIntakeGoal || 2000;

    return NextResponse.json({
      success: true,
      message: 'Water intake updated',
      dailyWaterIntake: waterLog.intake,
      goal,
      percentage: Math.round((waterLog.intake / goal) * 100),
    });

  } catch (error: any) {
    console.error('Water intake error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error', error: error.message },
      { status: 500 }
    );
  }
}

// GET /api/user/water-intake
export async function GET(request: NextRequest) {
  try {
    const decoded = authMiddleware(request);
    if ('error' in decoded) {
      return NextResponse.json({ success: false, message: decoded.error }, { status: 401 });
    }

    await dbConnect();

    const user = await User.findById(decoded.userId).select('waterIntakeGoal');
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    const today = new Date().toISOString().split('T')[0];
    const waterLog = await WaterLog.findOne({ userId: decoded.userId, date: today });
    
    const intake = waterLog?.intake || 0;
    const goal = user.waterIntakeGoal || 2000;

    return NextResponse.json({
      success: true,
      dailyWaterIntake: intake,
      goal,
      percentage: Math.round((intake / goal) * 100),
    });

  } catch (error: any) {
    console.error('Get water intake error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error', error: error.message },
      { status: 500 }
    );
  }
}

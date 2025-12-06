import { NextRequest, NextResponse } from 'next/server';
import { hubAccessMiddleware } from '@/lib/auth-middleware';
import connectDB from '@/lib/mongodb';
import WorkoutSession from '@/models/WorkoutSession';

/**
 * POST /api/workout-session/cancel
 * Cancel an active workout session
 * User can cancel a session if started by mistake or unable to continue
 */
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    // Verify authentication
    const authResult = await hubAccessMiddleware(req);
    if ('error' in authResult) {
      return NextResponse.json({ success: false, message: authResult.error }, { status: 403 });
    }
    const decoded = authResult;

    const userId = decoded.userId;

    // Get the body (optional: can include sessionId or just cancel the active one)
    const body = await req.json().catch(() => ({}));
    const { sessionId, reason } = body;

    let session;

    if (sessionId) {
      // Cancel specific session by ID
      session = await WorkoutSession.findOne({
        _id: sessionId,
        userId,
      });
    } else {
      // Cancel the most recent active session for this user
      session = await WorkoutSession.findOne({
        userId,
        status: { $in: ['in-progress', 'paused'] },
      }).sort({ startTime: -1 });
    }

    if (!session) {
      return NextResponse.json(
        { success: false, message: 'No active workout session found' },
        { status: 404 }
      );
    }

    // Check if session is already completed or cancelled
    if (session.status === 'completed') {
      return NextResponse.json(
        { success: false, message: 'Cannot cancel a completed workout session' },
        { status: 400 }
      );
    }

    if (session.status === 'cancelled') {
      return NextResponse.json(
        { success: false, message: 'Workout session is already cancelled' },
        { status: 400 }
      );
    }

    // Update session status to cancelled
    session.status = 'cancelled';
    session.endTime = new Date();
    
    // Calculate total duration (including paused time)
    const totalDuration = Math.floor((session.endTime.getTime() - session.startTime.getTime()) / 1000);
    session.totalDuration = totalDuration;

    // Add cancellation reason if provided
    if (reason) {
      session.notes = session.notes 
        ? `${session.notes}\n\nCancellation reason: ${reason}` 
        : `Cancellation reason: ${reason}`;
    }

    await session.save();

    return NextResponse.json({
      success: true,
      message: 'Workout session cancelled successfully',
      session: {
        id: session._id,
        status: session.status,
        startTime: session.startTime,
        endTime: session.endTime,
        totalDuration: session.totalDuration,
        workoutPlanId: session.workoutPlanId,
        workoutName: session.workoutName,
        notes: session.notes,
      },
    });
  } catch (error: any) {
    console.error('Cancel workout session error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to cancel workout session' },
      { status: 500 }
    );
  }
}

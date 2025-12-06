import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import connectDB from '@/lib/mongodb';
import UserAnnouncementStatus from '@/models/UserAnnouncementStatus';
import Announcement from '@/models/Announcement';

// POST - Mark announcement as read
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 });
    }

    const { announcementId } = await req.json();
    if (!announcementId) {
      return NextResponse.json({ success: false, message: 'Announcement ID required' }, { status: 400 });
    }

    const userId = decoded.userId;

    // Update or create status
    const status = await UserAnnouncementStatus.findOneAndUpdate(
      { userId, announcementId },
      { 
        $set: { 
          isRead: true,
          readAt: new Date(),
        }
      },
      { upsert: true, new: true }
    );

    // Update analytics
    await Announcement.findByIdAndUpdate(announcementId, {
      $inc: { 'analytics.totalReads': 1 }
    });

    return NextResponse.json({
      success: true,
      message: 'Announcement marked as read',
      status,
    });
  } catch (error: any) {
    console.error('Mark read error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to mark as read' },
      { status: 500 }
    );
  }
}

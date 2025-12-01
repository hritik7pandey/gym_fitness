import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import connectDB from '@/lib/mongodb';
import Announcement from '@/models/Announcement';

// GET - Fetch all announcements (Admin)
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Admin access required' }, { status: 403 });
    }

    const announcements = await Announcement.find()
      .sort({ sticky: -1, priority: -1, createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      announcements: announcements.map(a => ({ ...a, _id: a._id.toString() })),
    });
  } catch (error: any) {
    console.error('Get admin announcements error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch announcements' },
      { status: 500 }
    );
  }
}

// POST - Create announcement (Admin)
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Admin access required' }, { status: 403 });
    }

    const body = await req.json();
    const {
      title,
      message,
      image,
      priority = 'normal',
      category,
      sticky = false,
      scheduleAt,
      expiresAt,
      audience = { type: 'all' }
    } = body;

    if (!title || !message || !category) {
      return NextResponse.json(
        { success: false, message: 'Title, message, and category are required' },
        { status: 400 }
      );
    }

    const announcement = await Announcement.create({
      title,
      message,
      image,
      priority,
      category,
      sticky,
      scheduleAt: scheduleAt ? new Date(scheduleAt) : undefined,
      expiresAt: expiresAt ? new Date(expiresAt) : undefined,
      audience,
      isActive: true,
      createdBy: decoded.userId,
    });

    return NextResponse.json({
      success: true,
      message: 'Announcement created successfully',
      announcement: { ...announcement.toObject(), _id: announcement._id.toString() },
    });
  } catch (error: any) {
    console.error('Create announcement error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create announcement' },
      { status: 500 }
    );
  }
}

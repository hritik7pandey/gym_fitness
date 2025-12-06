import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import connectDB from '@/lib/mongodb';
import Announcement from '@/models/Announcement';

// GET - Fetch single announcement (Admin)
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const announcement = await Announcement.findById(params.id).lean();
    if (!announcement) {
      return NextResponse.json({ success: false, message: 'Announcement not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      announcement: { ...announcement, _id: announcement._id.toString() },
    });
  } catch (error: any) {
    console.error('Get announcement error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch announcement' },
      { status: 500 }
    );
  }
}

// PUT - Update announcement (Admin)
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const updateData: any = {};

    if (body.title !== undefined) updateData.title = body.title;
    if (body.message !== undefined) updateData.message = body.message;
    if (body.image !== undefined) updateData.image = body.image;
    if (body.priority !== undefined) updateData.priority = body.priority;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.sticky !== undefined) updateData.sticky = body.sticky;
    if (body.scheduleAt !== undefined) updateData.scheduleAt = body.scheduleAt ? new Date(body.scheduleAt) : null;
    if (body.expiresAt !== undefined) updateData.expiresAt = body.expiresAt ? new Date(body.expiresAt) : null;
    if (body.audience !== undefined) updateData.audience = body.audience;
    if (body.isActive !== undefined) updateData.isActive = body.isActive;

    const announcement = await Announcement.findByIdAndUpdate(
      params.id,
      { $set: updateData },
      { new: true }
    );

    if (!announcement) {
      return NextResponse.json({ success: false, message: 'Announcement not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Announcement updated successfully',
      announcement: { ...announcement.toObject(), _id: announcement._id.toString() },
    });
  } catch (error: any) {
    console.error('Update announcement error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update announcement' },
      { status: 500 }
    );
  }
}

// DELETE - Delete announcement (Admin)
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const announcement = await Announcement.findByIdAndDelete(params.id);
    if (!announcement) {
      return NextResponse.json({ success: false, message: 'Announcement not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Announcement deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete announcement error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete announcement' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import connectDB from '@/lib/mongodb';
import Announcement from '@/models/Announcement';
import UserAnnouncementStatus from '@/models/UserAnnouncementStatus';
import User from '@/models/User';

// GET - Fetch announcements for user
export async function GET(req: NextRequest) {
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

    const userId = decoded.userId;
    const now = new Date();

    // Fetch user's membership type
    const user = await User.findById(userId).select('membershipType').lean();
    const userMembershipType = user?.membershipType || 'None';

    // Find active announcements
    const announcements = await Announcement.find({
      isActive: true,
      $and: [
        {
          $or: [
            { scheduleAt: { $exists: false } },
            { scheduleAt: { $lte: now } }
          ]
        },
        {
          $or: [
            { expiresAt: { $exists: false } },
            { expiresAt: { $gte: now } }
          ]
        },
        {
          $or: [
            { 'audience.type': 'all' },
            { 'audience.type': 'specific_users', 'audience.userIds': userId },
            { 'audience.type': 'membership_types', 'audience.membershipTypes': userMembershipType }
          ]
        }
      ]
    })
    .sort({ sticky: -1, priority: -1, createdAt: -1 })
    .lean();

    // Get user's read/dismiss status
    const statuses = await UserAnnouncementStatus.find({
      userId,
      announcementId: { $in: announcements.map(a => a._id.toString()) }
    }).lean();

    const statusMap = new Map(
      statuses.map(s => [s.announcementId, s])
    );

    // Merge announcements with status
    const enrichedAnnouncements = announcements.map(announcement => ({
      ...announcement,
      _id: announcement._id.toString(),
      isRead: statusMap.get(announcement._id.toString())?.isRead || false,
      isDismissed: statusMap.get(announcement._id.toString())?.isDismissed || false,
      readAt: statusMap.get(announcement._id.toString())?.readAt,
    }));

    // Get unread count
    const unreadCount = enrichedAnnouncements.filter(a => !a.isRead && !a.isDismissed).length;

    return NextResponse.json({
      success: true,
      announcements: enrichedAnnouncements,
      unreadCount,
    });
  } catch (error: any) {
    console.error('Get announcements error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch announcements' },
      { status: 500 }
    );
  }
}

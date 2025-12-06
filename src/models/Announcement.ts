import mongoose, { Schema, Document } from 'mongoose';

export interface IAnnouncement extends Document {
  title: string;
  message: string;
  image?: string;
  priority: 'normal' | 'important' | 'critical';
  category: 'gym' | 'workout' | 'nutrition' | 'membership' | 'system' | 'offer';
  sticky: boolean;
  scheduleAt?: Date;
  expiresAt?: Date;
  audience: {
    type: 'all' | 'admins' | 'specific_users' | 'membership_types' | 'custom';
    userIds?: string[];
    membershipTypes?: string[];
  };
  isActive: boolean;
  createdBy: string;
  analytics: {
    totalReach: number;
    totalReads: number;
    totalDismissals: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const AnnouncementSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    image: {
      type: String,
      trim: true,
    },
    priority: {
      type: String,
      enum: ['normal', 'important', 'critical'],
      default: 'normal',
      required: true,
    },
    category: {
      type: String,
      enum: ['gym', 'workout', 'nutrition', 'membership', 'system', 'offer'],
      required: true,
    },
    sticky: {
      type: Boolean,
      default: false,
    },
    scheduleAt: {
      type: Date,
    },
    expiresAt: {
      type: Date,
    },
    audience: {
      type: {
        type: String,
        enum: ['all', 'admins', 'specific_users', 'membership_types', 'custom'],
        default: 'all',
      },
      userIds: [String],
      membershipTypes: [String],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: String,
      required: true,
    },
    analytics: {
      totalReach: {
        type: Number,
        default: 0,
      },
      totalReads: {
        type: Number,
        default: 0,
      },
      totalDismissals: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying
AnnouncementSchema.index({ isActive: 1, scheduleAt: 1, expiresAt: 1 });
AnnouncementSchema.index({ sticky: -1, priority: -1, createdAt: -1 });
AnnouncementSchema.index({ category: 1 });

export default mongoose.models.Announcement || mongoose.model<IAnnouncement>('Announcement', AnnouncementSchema);

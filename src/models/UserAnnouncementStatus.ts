import mongoose, { Schema, Document } from 'mongoose';

export interface IUserAnnouncementStatus extends Document {
  userId: string;
  announcementId: string;
  isRead: boolean;
  isDismissed: boolean;
  readAt?: Date;
  dismissedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserAnnouncementStatusSchema: Schema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    announcementId: {
      type: String,
      required: true,
      index: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    isDismissed: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
    },
    dismissedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient user-announcement queries
UserAnnouncementStatusSchema.index({ userId: 1, announcementId: 1 }, { unique: true });
UserAnnouncementStatusSchema.index({ userId: 1, isRead: 1 });
UserAnnouncementStatusSchema.index({ userId: 1, isDismissed: 1 });

export default mongoose.models.UserAnnouncementStatus || 
  mongoose.model<IUserAnnouncementStatus>('UserAnnouncementStatus', UserAnnouncementStatusSchema);

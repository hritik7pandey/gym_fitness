import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAttendance extends Document {
  userId: mongoose.Types.ObjectId;
  checkIn: Date;
  checkOut?: Date;
  date: string; // YYYY-MM-DD format
  duration?: number; // in minutes
  status: 'present' | 'absent' | 'late';
  
  // Biometric integration
  biometricDeviceId?: string;
  machineId?: string;
  punchType?: 'in' | 'out';
  
  createdAt: Date;
  updatedAt: Date;
}

const AttendanceSchema = new Schema<IAttendance>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    checkIn: { type: Date, required: true },
    checkOut: Date,
    date: { type: String, required: true }, // Format: YYYY-MM-DD
    duration: Number,
    status: { type: String, enum: ['present', 'absent', 'late'], default: 'present' },
    
    biometricDeviceId: String,
    machineId: String,
    punchType: { type: String, enum: ['in', 'out'] },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
AttendanceSchema.index({ userId: 1, date: 1 }, { unique: true });
AttendanceSchema.index({ date: 1 });
AttendanceSchema.index({ userId: 1, createdAt: -1 });

const Attendance: Model<IAttendance> = mongoose.models.Attendance || mongoose.model<IAttendance>('Attendance', AttendanceSchema);

export default Attendance;

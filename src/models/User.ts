import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  isEmailVerified: boolean;
  emailVerificationOTP?: string;
  emailVerificationOTPExpiry?: Date;
  resetPasswordOTP?: string;
  resetPasswordOTPExpiry?: Date;

  // Profile details
  phone?: string;
  age?: number;
  height?: number; // in cm
  weight?: number; // in kg
  gender?: 'male' | 'female' | 'other';
  goals?: string[];
  bmi?: number;


  // Membership (₹999/month Basic, ₹1,999/month Premium, ₹3,999/month VIP)
  membershipType?: 'None' | 'Basic' | 'Premium' | 'VIP';
  membershipStartDate?: Date;
  membershipEndDate?: Date;

  // Premium Hub Access (₹199/month for full app features)
  hasPremiumHubAccess?: boolean;
  premiumHubAccessStartDate?: Date;
  premiumHubAccessEndDate?: Date;


  // Tracking
  waterIntakeGoal?: number; // ml per day
  dailyWaterIntake?: number; // ml
  workoutPlanId?: mongoose.Types.ObjectId;
  dietPlanId?: mongoose.Types.ObjectId;

  // Streaks
  attendanceStreak?: number;
  lastAttendanceDate?: Date;

  // Notification Preferences
  notificationPreferences?: {
    emailWorkouts: boolean;
    emailAnnouncements: boolean;
    emailDiet: boolean;
    pushWorkouts: boolean;
    pushAnnouncements: boolean;
    pushDiet: boolean;
  };

  createdAt: Date;
  updatedAt: Date;

  // Methods
  comparePassword(candidatePassword: string): Promise<boolean>;
  calculateBMI(): number;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationOTP: String,
    emailVerificationOTPExpiry: Date,
    resetPasswordOTP: String,
    resetPasswordOTPExpiry: Date,

    // Profile
    phone: String,
    age: Number,
    height: Number,
    weight: Number,
    gender: { type: String, enum: ['male', 'female', 'other'] },
    goals: [String],
    bmi: Number,


    // Membership
    membershipType: { type: String, enum: ['None', 'Basic', 'Premium', 'VIP'], default: 'None' },
    membershipStartDate: Date,
    membershipEndDate: Date,

    // Premium Hub Access (₹199/month for full app features)
    hasPremiumHubAccess: { type: Boolean, default: false },
    premiumHubAccessStartDate: Date,
    premiumHubAccessEndDate: Date,


    // Tracking
    waterIntakeGoal: { type: Number, default: 2000 },
    dailyWaterIntake: { type: Number, default: 0 },
    workoutPlanId: { type: Schema.Types.ObjectId, ref: 'WorkoutPlan' },
    dietPlanId: { type: Schema.Types.ObjectId, ref: 'DietPlan' },

    // Streaks
    attendanceStreak: { type: Number, default: 0 },
    lastAttendanceDate: Date,

    // Notification Preferences
    notificationPreferences: {
      type: {
        emailWorkouts: { type: Boolean, default: true },
        emailAnnouncements: { type: Boolean, default: true },
        emailDiet: { type: Boolean, default: true },
        pushWorkouts: { type: Boolean, default: true },
        pushAnnouncements: { type: Boolean, default: false },
        pushDiet: { type: Boolean, default: true }
      },
      default: {
        emailWorkouts: true,
        emailAnnouncements: true,
        emailDiet: true,
        pushWorkouts: true,
        pushAnnouncements: false,
        pushDiet: true
      }
    }
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Calculate BMI
UserSchema.methods.calculateBMI = function (): number {
  if (this.height && this.weight) {
    const heightInMeters = this.height / 100;
    const bmi = this.weight / (heightInMeters * heightInMeters);
    this.bmi = Math.round(bmi * 10) / 10;
    return this.bmi;
  }
  return 0;
};

// Prevent model recompilation in development
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;

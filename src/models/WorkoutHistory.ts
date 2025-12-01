import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IWorkoutHistory extends Document {
  userId: mongoose.Types.ObjectId;
  workoutPlanId: mongoose.Types.ObjectId;
  date: Date;
  completedExercises: number;
  totalExercises: number;
  duration: number; // minutes
  caloriesBurned: number;
  notes?: string;
  rating?: number; // 1-5
  createdAt: Date;
  updatedAt: Date;
}

const WorkoutHistorySchema = new Schema<IWorkoutHistory>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    workoutPlanId: { type: Schema.Types.ObjectId, ref: 'WorkoutPlan', required: true },
    date: { type: Date, required: true, default: Date.now },
    completedExercises: { type: Number, required: true },
    totalExercises: { type: Number, required: true },
    duration: { type: Number, required: true },
    caloriesBurned: { type: Number, required: true },
    notes: String,
    rating: { type: Number, min: 1, max: 5 },
  },
  {
    timestamps: true,
  }
);

WorkoutHistorySchema.index({ userId: 1, date: -1 });
WorkoutHistorySchema.index({ workoutPlanId: 1 });

const WorkoutHistory: Model<IWorkoutHistory> = mongoose.models.WorkoutHistory || mongoose.model<IWorkoutHistory>('WorkoutHistory', WorkoutHistorySchema);

export default WorkoutHistory;

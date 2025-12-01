import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IExercise {
  name: string;
  sets: number;
  reps: number;
  weight?: number; // kg
  duration?: number; // minutes
  restTime?: number; // seconds
  caloriesBurned?: number;
  instructions?: string;
}

export interface IWorkoutPlan extends Document {
  name: string;
  description: string;
  type: 'Cardio' | 'Strength' | 'Flexibility' | 'Core' | 'HIIT' | 'Custom';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: number; // minutes
  exercises: IExercise[];
  targetMuscles?: string[];
  caloriesBurnedEstimate?: number;
  isTemplate: boolean; // true for pre-made templates
  createdBy: mongoose.Types.ObjectId; // admin who created it
  assignedTo?: mongoose.Types.ObjectId[]; // users assigned to this plan
  createdAt: Date;
  updatedAt: Date;
}

const ExerciseSchema = new Schema<IExercise>({
  name: { type: String, required: true },
  sets: { type: Number, required: true },
  reps: { type: Number, required: true },
  weight: Number,
  duration: Number,
  restTime: Number,
  caloriesBurned: Number,
  instructions: String,
}, { _id: false });

const WorkoutPlanSchema = new Schema<IWorkoutPlan>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, enum: ['Cardio', 'Strength', 'Flexibility', 'Core', 'HIIT', 'Custom'], required: true },
    difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], required: true },
    duration: { type: Number, required: true },
    exercises: [ExerciseSchema],
    targetMuscles: [String],
    caloriesBurnedEstimate: Number,
    isTemplate: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    assignedTo: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  {
    timestamps: true,
  }
);

WorkoutPlanSchema.index({ createdBy: 1 });
WorkoutPlanSchema.index({ assignedTo: 1 });
WorkoutPlanSchema.index({ isTemplate: 1 });

const WorkoutPlan: Model<IWorkoutPlan> = mongoose.models.WorkoutPlan || mongoose.model<IWorkoutPlan>('WorkoutPlan', WorkoutPlanSchema);

export default WorkoutPlan;

import mongoose from 'mongoose';

const ExerciseSetSchema = new mongoose.Schema({
  setNumber: { type: Number, required: true },
  reps: { type: Number, default: 0 },
  weight: { type: Number, default: 0 },
  completed: { type: Boolean, default: false },
  completedAt: { type: Date },
  restSeconds: { type: Number, default: 60 },
});

const SessionExerciseSchema = new mongoose.Schema({
  exerciseId: { type: String },
  name: { type: String, required: true },
  targetSets: { type: Number, default: 3 },
  targetReps: { type: Number, default: 10 },
  category: { type: String },
  equipment: { type: String },
  sets: [ExerciseSetSchema],
  status: { 
    type: String, 
    enum: ['pending', 'active', 'completed', 'skipped'], 
    default: 'pending' 
  },
  notes: { type: String },
  startedAt: { type: Date },
  completedAt: { type: Date },
});

const HeartRateSampleSchema = new mongoose.Schema({
  timestamp: { type: Date, required: true },
  bpm: { type: Number, required: true },
});

const WorkoutSessionSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    index: true 
  },
  workoutId: { 
    type: String,  // Changed to String to accept any ID
    index: true
  },
  workoutName: { type: String, required: true },
  
  // Session timing (UTC timestamps)
  startTime: { type: Date, required: true },
  endTime: { type: Date },
  totalPausedTime: { type: Number, default: 0 }, // milliseconds
  pauseStartTime: { type: Date },
  isPaused: { type: Boolean, default: false },
  isCompleted: { type: Boolean, default: false },
  
  // Exercise tracking
  currentExerciseIndex: { type: Number, default: 0 },
  exercises: [SessionExerciseSchema],
  
  // Performance metrics
  duration: { type: Number }, // calculated in minutes
  caloriesBurned: { type: Number, default: 0 },
  totalVolume: { type: Number, default: 0 }, // weight × reps × sets
  totalSets: { type: Number, default: 0 },
  totalReps: { type: Number, default: 0 },
  
  // Heart rate data (optional)
  heartRateSamples: [HeartRateSampleSchema],
  averageHeartRate: { type: Number },
  peakHeartRate: { type: Number },
  
  // Recovery & fatigue
  perceivedExertion: { type: Number, min: 1, max: 10 }, // RPE scale
  fatigueLevel: { type: Number, min: 1, max: 10 },
  muscleGroups: [{ type: String }],
  
  // Session metadata
  location: { type: String },
  weather: { type: String },
  notes: { type: String },
  
  // Sync & offline support
  lastSyncedAt: { type: Date, default: Date.now },
  offlineChanges: { type: Boolean, default: false },
  version: { type: Number, default: 1 }, // for conflict resolution
}, {
  timestamps: true,
});

// Indexes for performance
WorkoutSessionSchema.index({ userId: 1, createdAt: -1 });
WorkoutSessionSchema.index({ userId: 1, isCompleted: 1 });
WorkoutSessionSchema.index({ userId: 1, startTime: -1 });

// Calculate elapsed time (accounting for pauses)
WorkoutSessionSchema.methods.getElapsedTime = function() {
  if (!this.startTime) return 0;
  
  const now = new Date();
  const start = new Date(this.startTime);
  let elapsed = now.getTime() - start.getTime();
  
  // Subtract total paused time
  elapsed -= this.totalPausedTime;
  
  // If currently paused, subtract ongoing pause duration
  if (this.isPaused && this.pauseStartTime) {
    const pauseStart = new Date(this.pauseStartTime);
    elapsed -= (now.getTime() - pauseStart.getTime());
  }
  
  return Math.max(0, elapsed); // milliseconds
};

// Calculate total volume
WorkoutSessionSchema.methods.calculateVolume = function() {
  let volume = 0;
  let totalSets = 0;
  let totalReps = 0;
  
  this.exercises.forEach((exercise: any) => {
    exercise.sets.forEach((set: any) => {
      if (set.completed) {
        volume += set.weight * set.reps;
        totalSets += 1;
        totalReps += set.reps;
      }
    });
  });
  
  this.totalVolume = volume;
  this.totalSets = totalSets;
  this.totalReps = totalReps;
  
  return volume;
};

// Estimate calories burned (simple formula)
WorkoutSessionSchema.methods.calculateCalories = function() {
  const durationMinutes = this.getElapsedTime() / 1000 / 60;
  const baseCaloriesPerMinute = 8; // moderate intensity
  
  // Adjust based on volume and intensity
  const volumeMultiplier = Math.min(1 + (this.totalVolume / 10000), 2);
  
  this.caloriesBurned = Math.round(durationMinutes * baseCaloriesPerMinute * volumeMultiplier);
  return this.caloriesBurned;
};

// Get current exercise
WorkoutSessionSchema.methods.getCurrentExercise = function() {
  if (this.currentExerciseIndex >= 0 && this.currentExerciseIndex < this.exercises.length) {
    return this.exercises[this.currentExerciseIndex];
  }
  return null;
};

// Move to next exercise
WorkoutSessionSchema.methods.nextExercise = function() {
  if (this.currentExerciseIndex < this.exercises.length - 1) {
    // Mark current as completed if not already
    const current = this.getCurrentExercise();
    if (current && current.status !== 'completed') {
      current.status = 'completed';
      current.completedAt = new Date();
    }
    
    this.currentExerciseIndex += 1;
    
    // Mark new exercise as active
    const next = this.getCurrentExercise();
    if (next) {
      next.status = 'active';
      next.startedAt = new Date();
    }
    
    return true;
  }
  return false;
};

// Move to previous exercise
WorkoutSessionSchema.methods.previousExercise = function() {
  if (this.currentExerciseIndex > 0) {
    this.currentExerciseIndex -= 1;
    
    const prev = this.getCurrentExercise();
    if (prev) {
      prev.status = 'active';
    }
    
    return true;
  }
  return false;
};

// Complete session
WorkoutSessionSchema.methods.completeSession = function() {
  this.isCompleted = true;
  this.endTime = new Date();
  
  // Calculate final metrics
  const elapsed = this.getElapsedTime();
  this.duration = Math.round(elapsed / 1000 / 60); // minutes
  this.calculateVolume();
  this.calculateCalories();
  
  // Mark all exercises as completed
  this.exercises.forEach((ex: any) => {
    if (ex.status === 'active' || ex.status === 'pending') {
      ex.status = 'completed';
      ex.completedAt = new Date();
    }
  });
  
  this.lastSyncedAt = new Date();
};

// Static method to get active session for user
WorkoutSessionSchema.statics.getActiveSession = async function(userId) {
  return this.findOne({ 
    userId, 
    isCompleted: false 
  }).sort({ startTime: -1 });
};

// Static method to get weekly stats
WorkoutSessionSchema.statics.getWeeklyStats = async function(userId) {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
  const sessions = await this.find({
    userId,
    isCompleted: true,
    startTime: { $gte: oneWeekAgo }
  });
  
  const totalWorkouts = sessions.length;
  const totalMinutes = sessions.reduce((sum: number, s: any) => sum + (s.duration || 0), 0);
  const totalCalories = sessions.reduce((sum: number, s: any) => sum + (s.caloriesBurned || 0), 0);
  const totalVolume = sessions.reduce((sum: number, s: any) => sum + (s.totalVolume || 0), 0);
  
  return {
    totalWorkouts,
    totalMinutes,
    totalCalories,
    totalVolume,
    averageMinutes: totalWorkouts > 0 ? Math.round(totalMinutes / totalWorkouts) : 0,
  };
};

// Static method to get monthly stats
WorkoutSessionSchema.statics.getMonthlyStats = async function(userId) {
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  
  const sessions = await this.find({
    userId,
    isCompleted: true,
    startTime: { $gte: oneMonthAgo }
  });
  
  // Create heatmap data
  const heatmap: Record<string, { workouts: number; minutes: number; calories: number; volume: number }> = {};
  sessions.forEach((session: any) => {
    const date = new Date(session.startTime).toISOString().split('T')[0];
    if (!heatmap[date]) {
      heatmap[date] = {
        workouts: 0,
        minutes: 0,
        calories: 0,
        volume: 0,
      };
    }
    heatmap[date].workouts += 1;
    heatmap[date].minutes += session.duration || 0;
    heatmap[date].calories += session.caloriesBurned || 0;
    heatmap[date].volume += session.totalVolume || 0;
  });
  
  return {
    totalWorkouts: sessions.length,
    heatmap,
    sessions: sessions.map((s: any) => ({
      date: s.startTime,
      duration: s.duration,
      calories: s.caloriesBurned,
      volume: s.totalVolume,
      workoutName: s.workoutName,
    })),
  };
};

// Pre-save middleware
WorkoutSessionSchema.pre('save', function() {
  this.lastSyncedAt = new Date();
});

// Define the model type
interface WorkoutSessionModel extends mongoose.Model<any> {
  getActiveSession(userId: string): Promise<any>;
  getWeeklyStats(userId: string): Promise<any>;
  getMonthlyStats(userId: string): Promise<any>;
}

export default (mongoose.models.WorkoutSession as WorkoutSessionModel) || mongoose.model<any, WorkoutSessionModel>('WorkoutSession', WorkoutSessionSchema);

import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMeal {
  name: string;
  type: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  calories: number;
  protein: number; // grams
  carbs: number; // grams
  fats: number; // grams
  ingredients?: string[];
  instructions?: string;
  time?: string; // e.g., "08:00 AM"
}

export interface IDayPlan {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  meals: IMeal[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFats: number;
}

export interface IDietPlan extends Document {
  name: string;
  description: string;
  targetCalories: number;
  weeklyPlan: IDayPlan[];
  createdBy: mongoose.Types.ObjectId;
  assignedTo?: mongoose.Types.ObjectId[]; // users assigned to this plan
  isTemplate: boolean;
  dietType?: 'Balanced' | 'High-Protein' | 'Low-Carb' | 'Vegan' | 'Keto' | 'Custom';
  createdAt: Date;
  updatedAt: Date;
}

const MealSchema = new Schema<IMeal>({
  name: { type: String, required: true },
  type: { type: String, enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack'], required: true },
  calories: { type: Number, required: true },
  protein: { type: Number, required: true },
  carbs: { type: Number, required: true },
  fats: { type: Number, required: true },
  ingredients: [String],
  instructions: String,
  time: String,
}, { _id: false });

const DayPlanSchema = new Schema<IDayPlan>({
  day: { 
    type: String, 
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], 
    required: true 
  },
  meals: [MealSchema],
  totalCalories: { type: Number, default: 0 },
  totalProtein: { type: Number, default: 0 },
  totalCarbs: { type: Number, default: 0 },
  totalFats: { type: Number, default: 0 },
}, { _id: false });

const DietPlanSchema = new Schema<IDietPlan>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    targetCalories: { type: Number, required: true },
    weeklyPlan: [DayPlanSchema],
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    assignedTo: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    isTemplate: { type: Boolean, default: false },
    dietType: { 
      type: String, 
      enum: ['Balanced', 'High-Protein', 'Low-Carb', 'Vegan', 'Keto', 'Custom'],
      default: 'Balanced'
    },
  },
  {
    timestamps: true,
  }
);

// Calculate totals before saving
DayPlanSchema.pre('save', function() {
  this.totalCalories = this.meals.reduce((sum, meal) => sum + meal.calories, 0);
  this.totalProtein = this.meals.reduce((sum, meal) => sum + meal.protein, 0);
  this.totalCarbs = this.meals.reduce((sum, meal) => sum + meal.carbs, 0);
  this.totalFats = this.meals.reduce((sum, meal) => sum + meal.fats, 0);
});

DietPlanSchema.index({ createdBy: 1 });
DietPlanSchema.index({ assignedTo: 1 });
DietPlanSchema.index({ isTemplate: 1 });

const DietPlan: Model<IDietPlan> = mongoose.models.DietPlan || mongoose.model<IDietPlan>('DietPlan', DietPlanSchema);

export default DietPlan;

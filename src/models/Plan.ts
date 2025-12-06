import mongoose, { Schema, Document } from 'mongoose';

export interface IPlan extends Document {
    name: string;
    price: number;
    durationMonths: number;
    features: string[];
    isActive: boolean;
    displayOrder: number;
    createdAt: Date;
    updatedAt: Date;
}

const PlanSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Plan name is required'],
            trim: true,
        },
        price: {
            type: Number,
            required: [true, 'Price is required'],
            min: [0, 'Price cannot be negative'],
        },
        durationMonths: {
            type: Number,
            required: [true, 'Duration is required'],
            default: 1,
            min: [1, 'Duration must be at least 1 month'],
        },
        features: {
            type: [String],
            default: [],
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        displayOrder: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

// Index for efficient querying
PlanSchema.index({ isActive: 1, displayOrder: 1 });

export default mongoose.models.Plan || mongoose.model<IPlan>('Plan', PlanSchema);

import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IEquipment extends Document {
  name: string;
  category: string;
  quantity: number;
  status: 'Available' | 'In Use' | 'Maintenance' | 'Out of Order';
  purchaseDate?: Date;
  lastMaintenanceDate?: Date;
  nextMaintenanceDate?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const EquipmentSchema = new Schema<IEquipment>(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    quantity: { type: Number, required: true, default: 1 },
    status: { 
      type: String, 
      enum: ['Available', 'In Use', 'Maintenance', 'Out of Order'], 
      default: 'Available' 
    },
    purchaseDate: Date,
    lastMaintenanceDate: Date,
    nextMaintenanceDate: Date,
    notes: String,
  },
  {
    timestamps: true,
  }
);

EquipmentSchema.index({ status: 1 });
EquipmentSchema.index({ category: 1 });

const Equipment: Model<IEquipment> = mongoose.models.Equipment || mongoose.model<IEquipment>('Equipment', EquipmentSchema);

export default Equipment;

import mongoose, { Document } from "mongoose";

export interface IBudget extends Document {
  month: number;
  year: number;
  monthlyGoal: number;
  savingsTarget: number;
}

const budgetSchema = new mongoose.Schema<IBudget>(
  {
    month: { type: Number, required: true, min: 1, max: 12 },
    year: { type: Number, required: true },
    monthlyGoal: { type: Number, required: true, min: 0 },
    savingsTarget: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<IBudget>("Budget", budgetSchema);

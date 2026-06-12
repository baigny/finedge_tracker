import mongoose, { Document } from "mongoose";

export interface IBudget extends Document {
  month: string;
  monthlyGoal: number;
  savingsTarget: number;
}

const budgetSchema = new mongoose.Schema<IBudget>(
  {
    month: { type: String, required: true, unique: true, match: /^\d{4}-\d{2}$/ },
    monthlyGoal: { type: Number, required: true, min: 0 },
    savingsTarget: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<IBudget>("Budget", budgetSchema);

import mongoose, { Document } from "mongoose";

export interface ITransaction extends Document {
  type: "income" | "expense";
  category: string;
  amount: number;
  date: Date;
}

const transactionSchema = new mongoose.Schema<ITransaction>(
  {
    type: { type: String, enum: ["income", "expense"], required: true },
    category: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0.01 },
    date: { type: Date, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<ITransaction>("Transaction", transactionSchema);

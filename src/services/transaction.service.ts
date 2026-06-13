import Transaction from "../models/transaction.model";
import { ValidationError } from "../utils/errors";

export const createTransaction = async (data: any) => {
  const transaction = new Transaction(data);
  return await transaction.save();
};

export const getAllTransactions = async () => {
  return await Transaction.find();
};

export const getTransactionById = async (id: string) => {
  return await Transaction.findById(id);
};

export const updateTransaction = async (id: string, data: any) => {
  return await Transaction.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

export const deleteTransaction = async (id: string) => {
  return await Transaction.findByIdAndDelete(id);
};

export const getSummary = async () => {
  const transactions = await Transaction.find();

  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  return { income, expense, balance: income - expense };
};


export const filterTransactions = async (filters: any) => {
  const query: any = {};

  if (filters.category) {
    query.category = filters.category;
  }

  if (filters.startDate || filters.endDate) {
    if (filters.startDate && isNaN(Date.parse(filters.startDate))) {
      throw new ValidationError("startDate must be a valid date string");
    }
    if (filters.endDate && isNaN(Date.parse(filters.endDate))) {
      throw new ValidationError("endDate must be a valid date string");
    }

    query.date = {};
    if (filters.startDate) query.date.$gte = new Date(filters.startDate);
    if (filters.endDate) query.date.$lte = new Date(filters.endDate);
  }

  return await Transaction.find(query);
};


export const getMonthlyTrends = async () => {
  const trends = await Transaction.aggregate([
    {
      $group: {
        _id: {
          year: { $year: "$date" },
          month: { $month: "$date" },
        },
        income: {
          $sum: {
            $cond: [{ $eq: ["$type", "income"] }, "$amount", 0],
          },
        },
        expense: {
          $sum: {
            $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0],
          },
        },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  return trends.map((t) => ({
    label: `${t._id.year}-${String(t._id.month).padStart(2, "0")}`,
    year: t._id.year,
    month: t._id.month,
    income: t.income,
    expense: t.expense,
    balance: t.income - t.expense,
  }));
};
import Transaction from "../models/transaction.model";

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

import * as transactionService from "../services/transaction.service";

export const createTransaction = async (req: any, res: any) => {
  try {
    const transaction = await transactionService.createTransaction(req.body);
    res.status(201).json({ success: true, message: "Transaction created", data: transaction });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllTransactions = async (req: any, res: any) => {
  try {
    const transactions = await transactionService.getAllTransactions();
    res.status(200).json({ success: true, data: transactions });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTransactionById = async (req: any, res: any) => {
  try {
    const transaction = await transactionService.getTransactionById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }
    res.status(200).json({ success: true, data: transaction });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateTransaction = async (req: any, res: any) => {
  try {
    const transaction = await transactionService.updateTransaction(req.params.id, req.body);
    if (!transaction) {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }
    res.status(200).json({ success: true, message: "Transaction updated", data: transaction });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteTransaction = async (req: any, res: any) => {
  try {
    const transaction = await transactionService.deleteTransaction(req.params.id);
    if (!transaction) {
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }
    res.status(200).json({ success: true, message: "Transaction deleted" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSummary = async (req: any, res: any) => {
  try {
    const summary = await transactionService.getSummary();
    res.status(200).json({ success: true, data: summary });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

import { Request, Response } from "express";
import * as transactionService from "../services/transaction.service";
import { NotFoundError } from "../utils/errors";

export const createTransaction = async (req: Request, res: Response) => {
  const transaction = await transactionService.createTransaction(req.body);
  res.status(201).json({ success: true, message: "Transaction created", data: transaction });
};

export const getAllTransactions = async (_req: Request, res: Response) => {
  const transactions = await transactionService.getAllTransactions();
  res.status(200).json({ success: true, data: transactions });
};

export const getTransactionById = async (req: Request, res: Response) => {
  const transaction = await transactionService.getTransactionById(String(req.params.id));
  if (!transaction) {
    throw new NotFoundError("Transaction not found");
  }
  res.status(200).json({ success: true, data: transaction });
};

export const updateTransaction = async (req: Request, res: Response) => {
  const transaction = await transactionService.updateTransaction(String(req.params.id), req.body);
  if (!transaction) {
    throw new NotFoundError("Transaction not found");
  }
  res.status(200).json({ success: true, message: "Transaction updated", data: transaction });
};

export const deleteTransaction = async (req: Request, res: Response) => {
  const transaction = await transactionService.deleteTransaction(String(req.params.id));
  if (!transaction) {
    throw new NotFoundError("Transaction not found");
  }
  res.status(200).json({ success: true, message: "Transaction deleted" });
};

export const getSummary = async (_req: Request, res: Response) => {
  const summary = await transactionService.getSummary();
  res.status(200).json({ success: true, data: summary });
};


export const filterTransactions = async (req: Request, res: Response) => {
  const data = await transactionService.filterTransactions(req.query);
  res.status(200).json({ success: true, data });
};

export const getMonthlyTrends = async (_req: Request, res: Response) => {
  const data = await transactionService.getMonthlyTrends();
  res.status(200).json({ success: true, data });
};
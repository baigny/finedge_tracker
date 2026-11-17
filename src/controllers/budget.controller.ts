import { Request, Response } from "express";
import * as budgetService from "../services/budget.service";
import { NotFoundError } from "../utils/errors";

export const createBudget = async (req: Request, res: Response) => {
  const budget = await budgetService.createBudget(req.body);
  res.status(201).json({ success: true, message: "Budget created", data: budget });
};

export const getAllBudgets = async (_req: Request, res: Response) => {
  const budgets = await budgetService.getAllBudgets();
  res.status(200).json({ success: true, data: budgets });
};

export const getBudgetById = async (req: Request, res: Response) => {
  const budget = await budgetService.getBudgetById(String(req.params.id));
  if (!budget) throw new NotFoundError("Budget not found");
  res.status(200).json({ success: true, data: budget });
};

export const updateBudget = async (req: Request, res: Response) => {
  const budget = await budgetService.updateBudget(String(req.params.id), req.body);
  if (!budget) throw new NotFoundError("Budget not found");
  res.status(200).json({ success: true, message: "Budget updated", data: budget });
};

export const deleteBudget = async (req: Request, res: Response) => {
  const budget = await budgetService.deleteBudget(String(req.params.id));
  if (!budget) throw new NotFoundError("Budget not found");
  res.status(200).json({ success: true, message: "Budget deleted" });
};

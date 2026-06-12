import * as budgetService from "../services/budget.service";

export const createBudget = async (req: any, res: any) => {
  try {
    const budget = await budgetService.createBudget(req.body);
    res.status(201).json({ success: true, message: "Budget created", data: budget });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllBudgets = async (req: any, res: any) => {
  try {
    const budgets = await budgetService.getAllBudgets();
    res.status(200).json({ success: true, data: budgets });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBudgetByMonth = async (req: any, res: any) => {
  try {
    const budget = await budgetService.getBudgetByMonth(req.params.month);
    if (!budget) {
      return res.status(404).json({ success: false, message: "Budget not found" });
    }
    res.status(200).json({ success: true, data: budget });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateBudget = async (req: any, res: any) => {
  try {
    const budget = await budgetService.updateBudget(req.params.month, req.body);
    if (!budget) {
      return res.status(404).json({ success: false, message: "Budget not found" });
    }
    res.status(200).json({ success: true, message: "Budget updated", data: budget });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteBudget = async (req: any, res: any) => {
  try {
    const budget = await budgetService.deleteBudget(req.params.month);
    if (!budget) {
      return res.status(404).json({ success: false, message: "Budget not found" });
    }
    res.status(200).json({ success: true, message: "Budget deleted" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

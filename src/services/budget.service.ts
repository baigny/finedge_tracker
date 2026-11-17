import Budget from "../models/budget.model";

export const createBudget = async (data: any) => {
  return await new Budget(data).save();
};

export const getAllBudgets = async () => {
  return await Budget.find();
};

export const getBudgetById = async (id: string) => {
  return await Budget.findById(id);
};

export const updateBudget = async (id: string, data: any) => {
  return await Budget.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};

export const deleteBudget = async (id: string) => {
  return await Budget.findByIdAndDelete(id);
};

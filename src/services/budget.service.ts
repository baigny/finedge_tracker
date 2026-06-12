import Budget from "../models/budget.model";

export const createBudget = async (data: any) => {
  const budget = new Budget(data);
  return await budget.save();
};

export const getAllBudgets = async () => {
  return await Budget.find().sort({ month: -1 });
};

export const getBudgetByMonth = async (month: string) => {
  return await Budget.findOne({ month });
};

export const updateBudget = async (month: string, data: any) => {
  return await Budget.findOneAndUpdate({ month }, data, {
    new: true,
    runValidators: true,
  });
};

export const deleteBudget = async (month: string) => {
  return await Budget.findOneAndDelete({ month });
};

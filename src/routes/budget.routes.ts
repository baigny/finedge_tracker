import { Router } from "express";
import {
  createBudget,
  getAllBudgets,
  getBudgetById,
  updateBudget,
  deleteBudget,
} from "../controllers/budget.controller";
import asyncHandler from "../utils/asyncHandler";

const router = Router();

router.post("/", asyncHandler(createBudget));
router.get("/", asyncHandler(getAllBudgets));
router.get("/:id", asyncHandler(getBudgetById));
router.patch("/:id", asyncHandler(updateBudget));
router.delete("/:id", asyncHandler(deleteBudget));

export default router;

import { Router } from "express";
import {
  createBudget,
  getAllBudgets,
  getBudgetByMonth,
  updateBudget,
  deleteBudget,
} from "../controllers/budget.controller";

const router = Router();

router.post("/", createBudget);
router.get("/", getAllBudgets);
router.get("/:month", getBudgetByMonth);
router.patch("/:month", updateBudget);
router.delete("/:month", deleteBudget);

export default router;

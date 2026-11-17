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

/**
 * @swagger
 * /budgets:
 *   post:
 *     summary: Create a budget
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [month, year, monthlyGoal, savingsTarget]
 *             properties:
 *               month:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 12
 *               year:
 *                 type: integer
 *               monthlyGoal:
 *                 type: number
 *               savingsTarget:
 *                 type: number
 *     responses:
 *       201:
 *         description: Budget created
 *       400:
 *         description: Validation error
 */
router.post("/", asyncHandler(createBudget));
/**
 * @swagger
 * /budgets:
 *   get:
 *     summary: Get all budgets
 *     responses:
 *       200:
 *         description: List of budgets
 */
router.get("/", asyncHandler(getAllBudgets));

/**
 * @swagger
 * /budgets/{id}:
 *   get:
 *     summary: Get a budget by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Budget found
 *       404:
 *         description: Budget not found
 *   patch:
 *     summary: Update a budget
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               month:
 *                 type: integer
 *               year:
 *                 type: integer
 *               monthlyGoal:
 *                 type: number
 *               savingsTarget:
 *                 type: number
 *     responses:
 *       200:
 *         description: Budget updated
 *       404:
 *         description: Budget not found
 *   delete:
 *     summary: Delete a budget
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Budget deleted
 *       404:
 *         description: Budget not found
 */
router.get("/:id", asyncHandler(getBudgetById));
router.patch("/:id", asyncHandler(updateBudget));
router.delete("/:id", asyncHandler(deleteBudget));

export default router;

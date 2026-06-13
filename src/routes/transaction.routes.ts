import { Router } from "express";
import {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  filterTransactions,
  getMonthlyTrends,
} from "../controllers/transaction.controller";
import validateTransaction from "../middlewares/validateTransaction.middleware";
import asyncHandler from "../utils/asyncHandler";

const router = Router();

/**
 * @swagger
 * /transactions:
 *   post:
 *     summary: Create a new transaction
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [type, category, amount, date]
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *               category:
 *                 type: string
 *               amount:
 *                 type: number
 *               date:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Transaction created
 *       400:
 *         description: Validation error
 */
router.post("/", validateTransaction, asyncHandler(createTransaction));

/**
 * @swagger
 * /transactions:
 *   get:
 *     summary: Get all transactions
 *     responses:
 *       200:
 *         description: List of transactions
 */
router.get("/", asyncHandler(getAllTransactions));

router.get("/filter", asyncHandler(filterTransactions));

router.get("/trends", asyncHandler(getMonthlyTrends));
/**
 * @swagger
 * /transactions/{id}:
 *   get:
 *     summary: Get a transaction by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Transaction found
 *       404:
 *         description: Transaction not found
 */
router.get("/:id", asyncHandler(getTransactionById));

/**
 * @swagger
 * /transactions/{id}:
 *   patch:
 *     summary: Update a transaction
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
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *               category:
 *                 type: string
 *               amount:
 *                 type: number
 *               date:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Transaction updated
 *       400:
 *         description: Validation error
 *       404:
 *         description: Transaction not found
 */
router.patch("/:id", asyncHandler(updateTransaction));

/**
 * @swagger
 * /transactions/{id}:
 *   delete:
 *     summary: Delete a transaction
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Transaction deleted
 *       404:
 *         description: Transaction not found
 */
router.delete("/:id", asyncHandler(deleteTransaction));

export default router;

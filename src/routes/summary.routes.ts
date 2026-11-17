import { Router } from "express";
import { getSummary } from "../controllers/transaction.controller";
import asyncHandler from "../utils/asyncHandler";

const router = Router();

/**
 * @swagger
 * /summary:
 *   get:
 *     summary: Get total income, expense, and balance
 *     responses:
 *       200:
 *         description: Financial summary
 */
router.get("/", asyncHandler(getSummary));

export default router;

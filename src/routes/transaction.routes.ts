import { Router } from "express";
import {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  getSummary,
} from "../controllers/transaction.controller";

const router = Router();

router.post("/", createTransaction);
router.get("/", getAllTransactions);
router.get("/summary", getSummary);
router.get("/:id", getTransactionById);
router.patch("/:id", updateTransaction);
router.delete("/:id", deleteTransaction);

export default router;

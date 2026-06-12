import { Router } from "express";
import { getSummary } from "../controllers/transaction.controller";

const router = Router();

router.get("/", getSummary);

export default router;

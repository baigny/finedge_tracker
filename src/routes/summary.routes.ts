import { Router } from "express";
import { getSummary } from "../controllers/transaction.controller";
import asyncHandler from "../utils/asyncHandler";

const router = Router();

router.get("/", asyncHandler(getSummary));

export default router;

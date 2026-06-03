import { Router } from "express";
import { getHealth } from "../controllers/health.controller";

const router = Router();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check
 *     description: Verify the server is running
 *     responses:
 *       200:
 *         description: Server is healthy
 */
router.get("/", getHealth);

export default router;

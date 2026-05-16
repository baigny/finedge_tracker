import { Router, Request, Response } from "express";

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
router.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    message: "FinEdge API is running",
    timestamp: new Date().toISOString(),
  });
});

export default router;

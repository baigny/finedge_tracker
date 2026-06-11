import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors";

/**
 * Global error-handling middleware.
 * Must be registered LAST in app.use() chain.
 * Catches all errors thrown or passed via next(err).
 */
const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // If it's one of our custom AppErrors, use its statusCode
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: "false",
      message: err.message,
    });
    return;
  }

  // For unexpected errors (DB crash, null pointer, etc.)
  console.error("Unhandled Error:", err);
  res.status(500).json({
    success: "false",
    message: "Internal Server Error",
  });
};

export default errorHandler;

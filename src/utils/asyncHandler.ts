import { Request, Response, NextFunction } from "express";

/**
 * Wraps an async route handler so that any thrown error
 * is automatically passed to next() — no try/catch needed.
 */
const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

export default asyncHandler;

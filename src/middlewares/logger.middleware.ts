import { Request, Response, NextFunction } from "express";

/**
 * Logging middleware — logs method, URL, status code, and response time.
 * Register early in app.ts (before routes) so it captures all requests.
 */
const logger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  // 'finish' event fires when the response is fully sent
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`
    );
  });

  next();
};

export default logger;

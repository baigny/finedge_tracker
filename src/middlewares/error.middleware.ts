import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { AppError } from "../utils/errors";

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ success: false, message: err.message });
    return;
  }

  if (err instanceof mongoose.Error.ValidationError) {
    res.status(400).json({ success: false, message: err.message });
    return;
  }

  console.error("Unhandled Error:", err);
  res.status(500).json({ success: false, message: "Internal Server Error" });
};

export default errorHandler;

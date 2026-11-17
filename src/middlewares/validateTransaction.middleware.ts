import { Request, Response, NextFunction } from "express";
import { ValidationError } from "../utils/errors";

const VALID_TYPES = ["income", "expense"];
const VALID_CATEGORIES = [
  "food",
  "transport",
  "entertainment",
  "utilities",
  "health",
  "shopping",
  "salary",
  "freelance",
  "investment",
  "other",
];

/**
 * Validates transaction request body before it reaches the controller.
 * Checks: type, category, amount, date.
 * Throws ValidationError on failure (caught by asyncHandler → errorHandler).
 */
const validateTransaction = (req: Request, res: Response, next: NextFunction) => {
  const { type, category, amount, date } = req.body;
  const errors: string[] = [];

  // Type validation
  if (!type) {
    errors.push("type is required");
  } else if (!VALID_TYPES.includes(type)) {
    errors.push(`type must be one of: ${VALID_TYPES.join(", ")}`);
  }

  // Category validation
  if (!category) {
    errors.push("category is required");
  } else if (!VALID_CATEGORIES.includes(category)) {
    errors.push(`category must be one of: ${VALID_CATEGORIES.join(", ")}`);
  }

  // Amount validation
  if (amount === undefined || amount === null) {
    errors.push("amount is required");
  } else if (typeof amount !== "number" || amount <= 0) {
    errors.push("amount must be a positive number");
  }

  // Date validation
  if (!date) {
    errors.push("date is required");
  } else if (isNaN(Date.parse(date))) {
    errors.push("date must be a valid date string");
  }

  if (errors.length > 0) {
    throw new ValidationError(errors.join("; "));
  }

  next();
};

export default validateTransaction;

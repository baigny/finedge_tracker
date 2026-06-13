import { Request, Response, NextFunction } from "express";
import { ValidationError } from "../utils/errors";

/**
 * Validates registration request body before it reaches the controller.
 * Checks: name, email, password.
 */
const validateRegistration = (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;
  const errors: string[] = [];

  if (!name || !name.trim()) {
    errors.push("name is required");
  }

  if (!email || !email.trim()) {
    errors.push("email is required");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push("email must be a valid email address");
  }

  if (!password) {
    errors.push("password is required");
  } else if (password.length < 6) {
    errors.push("password must be at least 6 characters");
  }

  if (errors.length > 0) {
    throw new ValidationError(errors.join("; "));
  }

  next();
};

export default validateRegistration;

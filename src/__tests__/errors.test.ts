import {
  AppError,
  NotFoundError,
  ValidationError,
  UnauthorizedError,
  ConflictError,
} from "../utils/errors";

describe("Custom Error Classes", () => {
  describe("AppError", () => {
    it("should create an error with message and statusCode", () => {
      const error = new AppError("Something went wrong", 500);

      expect(error.message).toBe("Something went wrong");
      expect(error.statusCode).toBe(500);
      expect(error.isOperational).toBe(true);
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(AppError);
    });
  });

  describe("NotFoundError", () => {
    it("should default to 404 and default message", () => {
      const error = new NotFoundError();

      expect(error.statusCode).toBe(404);
      expect(error.message).toBe("Resource not found");
    });

    it("should accept a custom message", () => {
      const error = new NotFoundError("User not found");

      expect(error.statusCode).toBe(404);
      expect(error.message).toBe("User not found");
    });
  });

  describe("ValidationError", () => {
    it("should default to 400 and default message", () => {
      const error = new ValidationError();

      expect(error.statusCode).toBe(400);
      expect(error.message).toBe("Validation failed");
    });
  });

  describe("UnauthorizedError", () => {
    it("should default to 401 and default message", () => {
      const error = new UnauthorizedError();

      expect(error.statusCode).toBe(401);
      expect(error.message).toBe("Unauthorized");
    });
  });

  describe("ConflictError", () => {
    it("should default to 409 and default message", () => {
      const error = new ConflictError();

      expect(error.statusCode).toBe(409);
      expect(error.message).toBe("Resource already exists");
    });
  });
});

import { Request, Response } from "express";
import userModel from "../models/user.model";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { UnauthorizedError, ConflictError } from "../utils/errors";

const SALT_ROUNDS = 10;

async function RegisterUser(req: Request, res: Response) {
  const { name, password, email, age, gender } = req.body;

  // Check if user already exists
  const existingUser = await userModel.findOne({ email });
  if (existingUser) {
    throw new ConflictError("User with this email already exists");
  }

  // Hash password before saving
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const newUser = new userModel({ name, password: hashedPassword, email, age, gender });
  const responsefromDB = await newUser.save();

  res.status(201).json({
    success: "true",
    message: "User Registered Successfully",
    data: responsefromDB,
  });
}

async function loginUser(req: Request, res: Response) {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) {
    throw new UnauthorizedError("Invalid User Credentials");
  }

  // Compare plain password with hashed password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new UnauthorizedError("Invalid User Credentials");
  }

  const jwtSecret = process.env.JWT_SECRET as string;
  const token = jwt.sign(
    { userId: user._id, email: user.email },
    jwtSecret,
    { expiresIn: "1h" }
  );

  res.status(200).json({
    success: "true",
    message: "login successful",
    data: user,
    token: token,
  });
}

export { loginUser, RegisterUser };

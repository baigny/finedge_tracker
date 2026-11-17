import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  age: {
    type: Number,
    min: 18,
  },
  gender: {
    type: String,
    enum: ["M", "F", "Others"],
  },
});

const User = mongoose.model("User", userSchema);

export default User;

import { Schema, model } from "mongoose";
import { emailRegex } from "../utils/regex.js";

const userSchema = new Schema({
  fullName: String,
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value) => {
        return emailRegex.test(value);
      },
      message: "Invalid email address",
    },
  },
  otp: Number,
  otpExpiry: Number,
  createdAt: Number,
  updatedAt: Number,
});

export const User = model("User", userSchema);

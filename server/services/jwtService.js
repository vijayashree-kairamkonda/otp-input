import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const generateToken = (claims) => {
  return jwt.sign(claims, process.env.JWT_SECRET_KEY, { expiresIn: "4Weeks" });
};

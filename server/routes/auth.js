import { Router } from "express";
import { emailRegex } from "../utils/regex.js";
import { sendOTP } from "../services/authService.js";

const router = Router();

router.post("/otp/send", (req, res) => {
  const { email } = req.body;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email address" });
  }
  sendOTP(email, res);
});

export default router;

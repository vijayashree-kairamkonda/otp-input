import { Router } from "express";
import { emailRegex } from "../utils/regex.js";
import { sendOTP, verifyOTP } from "../services/authService.js";

const router = Router();

router.post("/otp/send", (req, res) => {
  const { email } = req.body;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email address" });
  }
  sendOTP(email, res);
});

router.post("/otp/verify", async (req, res) => {
  const { email, otp } = req.body;
  if (!emailRegex.test(email) || otp.length !== 4) {
    return res.status(400).json({ message: "Invalid payload" });
  }
  const { statusCode, message, token } = await verifyOTP(email, otp);
  if (token) {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 28);
    res.cookie("jwt-token", token, { expires: currentDate });
  }
  res.status(statusCode).json({ message });
});

export default router;

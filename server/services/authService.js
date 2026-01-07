import { User } from "../models/User.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  secure: true,
  auth: {
    user: process.env.EMAIL,
    // Prefer an app password when using Gmail
    pass: process.env.PASS,
  },
});

const sendOtpEmail = (email, otp) => {
  return transporter.sendMail({
    from: process.env.EMAIL,
    to: email,
    subject: "Verify your email",
    html: `
    <p>Below is the OTP for email verification</p>
    <p>${otp}</p>
    `,
  });
};

export const sendOTP = async (email, res) => {
  try {
    const user = await User.findOne({ email });
    const currentTimeStamp = parseInt(new Date().getTime() / 1000);
    if (user && user.otpExpiry && user.otpExpiry > currentTimeStamp) {
      return res
        .status(400)
        .json({ message: "OTP already sent to your email address" });
    }
    const otp = parseInt(Math.random() * 10000);
    const otpExpiry = currentTimeStamp + 1800;
    await sendOtpEmail(email, otp);
    if (user) {
      console.log("otp sent for existing user");
      user.otp = otp;
      user.otpExpiry = otpExpiry;
      await user.save();
    } else {
      console.log("otp sent for new user");
      await User.create({
        email,
        otp,
        otpExpiry,
        createdAt: currentTimeStamp,
        updatedAt: currentTimeStamp,
      });
    }
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    console.log("An error occurred while sending an OTP", err.message);
    res.status(500).json({ message: "An internal error occurred" });
  }
};

import { User } from "../models/User.js";
import dotenv from "dotenv";
import { generateToken } from "./jwtService.js";
import { Resend } from "resend";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

const sendOtpEmail = async (email, otp) => {
  await resend.emails.send({
    from: "OTP Auth <onboarding@resend.dev>",
    to: email,
    subject: "Verify your email",
    html: `
      <p>Your OTP for email verification:</p>
      <h2>${otp}</h2>
      <p>This OTP is valid for 30 minutes</p>
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
    // Generate a 4-digit, zero-padded OTP as a string to avoid type issues
    const otp = String(Math.floor(Math.random() * 10000)).padStart(4, "0");
    const otpExpiry = currentTimeStamp + 1800;
    console.log("Sending OTP to:", email);
    await sendOtpEmail(email, otp);
    console.log("OTP email sent");

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

export const verifyOTP = async (email, otp) => {
  try {
    const user = await User.findOne({ email });
    console.log(user);
    if (!user) return { statusCode: 404, message: "User not found" };
    if (!user.otp)
      return {
        statusCode: 404,
        message: "OTP not found, please send another OTP",
      };
    const currentTimeStamp = Math.floor(new Date().getTime() / 1000);
    if (user.otpExpiry < currentTimeStamp) {
      return { statusCode: 410, message: "OTP expired" };
    }
    const providedOtp = String(otp).trim();
    if (String(user.otp) !== providedOtp)
      return { statusCode: 400, message: "Invalid OTP" };
    await User.updateOne(
      { _id: user._id },
      { $unset: { otp: "", otpExpiry: "" } }
    );
    const token = generateToken({ id: user._id });
    return { statusCode: 200, message: "Email verification successful", token };
  } catch (err) {
    return { statusCode: 500, message: err.message };
  }
};

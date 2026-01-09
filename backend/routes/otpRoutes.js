// routes/otpRoutes.js
const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();

// Temporary in-memory OTP store
let otpStore = {};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "resultprouov@gmail.com", // replace with your Gmail
    pass: "gsmytctbmodiqyuv",   // Gmail App Password (not your real password)
  },
});

router.post("/send", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Email required" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[email] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 };

    await transporter.sendMail({
      from: "yourgmail@gmail.com",
      to: email,
      subject: "University OTP Verification",
      text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
    });

    return res.json({ success: true, message: "OTP sent successfully!" });
  } catch (err) {
    console.error("Error sending OTP:", err);
    return res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
});

router.post("/verify", (req, res) => {
  const { email, otp } = req.body;
  const record = otpStore[email];

  if (!record)
    return res.json({ success: false, message: "OTP not found. Please request again." });
  if (Date.now() > record.expiresAt)
    return res.json({ success: false, message: "OTP expired!" });
  if (record.otp !== otp)
    return res.json({ success: false, message: "Invalid OTP!" });

  delete otpStore[email];
  res.json({ success: true, message: "OTP verified!" });
});

module.exports = router;

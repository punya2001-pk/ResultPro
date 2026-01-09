const express = require("express");
const router = express.Router();
const argon2 = require("argon2");
const Student = require("../models/Student");
const Staff = require("../models/Staff");
const Admin = require("../models/admin");
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const Otp = require('../models/Otp');

const OTP_EXPIRE_MIN = parseInt(process.env.OTP_EXPIRE_MIN || '5', 10);
const MAX_OTP_ATTEMPTS = 5;

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

function genOtp() {
  return (Math.floor(100000 + Math.random() * 900000)).toString();
}

// POST /api/auth/send-otp
router.post('/send-otp', async (req, res) => {
  try {
    const { regNo, role, faculty, department, email } = req.body;
    if (!regNo || !role || !email) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    // Optional: verify user exists in DB with those details
    const user = await User.findOne({ email, regNo, role });
    if (!user) {
      // For security, you might still respond with success to not leak which emails exist.
      return res.status(400).json({ message: 'User not found with given details' });
    }

    // Create OTP
    const code = genOtp();
    const expiresAt = new Date(Date.now() + OTP_EXPIRE_MIN * 60 * 1000);

    // Upsert OTP record for the email
    await Otp.findOneAndUpdate(
      { email },
      { code, expiresAt, attempts: 0 },
      { upsert: true, new: true }
    );

    // send email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your password reset OTP',
      text: `Your OTP to reset password is ${code}. It expires in ${OTP_EXPIRE_MIN} minutes.\nIf you didn't request this, ignore this email.`
    };

    await transporter.sendMail(mailOptions);

    return res.json({ message: 'OTP sent to your university email.' });
  } catch (err) {
    console.error('send-otp err', err);
    return res.status(500).json({ message: 'Failed to send OTP' });
  }
});

// POST /api/auth/verify-otp
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    const otpDoc = await Otp.findOne({ email });
    if (!otpDoc) {
      return res.status(400).json({ message: 'No OTP request found or OTP expired' });
    }

    // check expiry
    if (otpDoc.expiresAt < new Date()) {
      await Otp.deleteOne({ email });
      return res.status(400).json({ message: 'OTP expired' });
    }

    // check attempts
    if (otpDoc.attempts >= MAX_OTP_ATTEMPTS) {
      await Otp.deleteOne({ email });
      return res.status(429).json({ message: 'Too many attempts. Request a new OTP.' });
    }

    if (otpDoc.code !== otp) {
      otpDoc.attempts += 1;
      await otpDoc.save();
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // OTP matched -> update user's password
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPassword, salt);
    await user.save();

    // delete OTP doc
    await Otp.deleteOne({ email });

    return res.json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error('verify-otp err', err);
    return res.status(500).json({ message: 'Failed to verify OTP' });
  }
});

// ================================
// 🔐 LOGIN (Student, Staff, Admin)
// ================================
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // =======================
    // 🎓 Check Student
    // =======================
    const student = await Student.findOne({ username });
    if (student) {
      const ok = await argon2.verify(student.password, password);
      console.log("Entered password:", password);
      console.log("Stored hash:", student.password);
      console.log("Compare result (student):", ok);

      if (ok) {
        return res.json({
          success: true,
          user: {
            username: student.username,
            name: student.name,
            id: student._id,
          },
          role: "student",
        });
      } else {
        return res.json({
          success: false,
          message: "Invalid username or password",
        });
      }
    }

    // =======================
    // 👨‍🏫 Check Staff
    // =======================
    const staff = await Staff.findOne({ username });
    if (staff) {
      const ok = await argon2.verify(staff.password, password);
      console.log("Compare result (staff):", ok);

      if (ok) {
        return res.json({
          success: true,
          user: {
            username: staff.username,
            name: staff.name,
            id: staff._id,
          },
          role: "staff",
        });
      } else {
        return res.json({
          success: false,
          message: "Invalid username or password",
        });
      }
    }

    // =======================
    // 🧑‍💼 Check Admin
    // =======================
    const admin = await Admin.findOne({ username });
    if (admin) {
      const ok = await argon2.verify(admin.password, password);
      console.log("Compare result (admin):", ok);

      if (ok) {
        return res.json({
          success: true,
          user: {
            username: admin.username,
            name: admin.name,
            id: admin._id,
          },
          role: "admin",
        });
      } else {
        return res.json({
          success: false,
          message: "Invalid username or password",
        });
      }
    }

    // =======================
    // ❌ User not found
    // =======================
    return res.json({
      success: false,
      message: "User not found",
    });

  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

module.exports = router;

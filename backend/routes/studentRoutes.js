// routes/studentRoutes.js
const express = require("express");
const bcrypt = require("bcryptjs");
const Student = require("../models/studentSchema");

const router = express.Router();

// ------------------ REGISTER STUDENT ------------------ //
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if username already exists
    const existingUser = await Student.findOne({ username });
    if (existingUser) {
      return res.json({ success: false, message: "Username already exists" });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    req.body.password = hashedPassword;

    // Create and save student
    const newStudent = new Student(req.body);
    await newStudent.save();

    res.json({ success: true, message: "Student registered successfully" });
  } catch (err) {
    console.error("Error registering student:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ------------------ LOGIN STUDENT ------------------ //
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user
    const student = await Student.findOne({ username });
    if (!student) {
      return res.json({ success: false, message: "User not found" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Incorrect password" });
    }

    res.json({
      success: true,
      role: student.role,
      message: "Login successful",
      data: {
        name: student.name,
        username: student.username,
        faculty: student.faculty,
        department: student.department,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

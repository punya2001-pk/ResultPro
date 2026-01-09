const express = require("express");
const router = express.Router();
const Student = require("../models/student");

// Default users
const defaultAdmin = { username: "admin", password: "admin123" };
const defaultStaff = { username: "staff", password: "staff123" };

// LOGIN route
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Admin login
    if (username === defaultAdmin.username && password === defaultAdmin.password) {
      return res.json({ success: true, role: "admin", user: { username: "admin" } });
    }

    // Staff login
    if (username === defaultStaff.username && password === defaultStaff.password) {
      return res.json({ success: true, role: "staff", user: { username: "staff" } });
    }

    // Student login
    const student = await Student.findOne({ regNumber: username });
    if (!student) return res.json({ success: false, message: "User not found." });

    if (password !== student.password) {
      return res.json({ success: false, message: "Incorrect password." });
    }

    res.json({ success: true, role: "student", user: student });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Server error" });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const argon2 = require("argon2");

const Student = require("../models/Student");
const Staff = require("../models/Staff");
const Admin = require("../models/admin");

//login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: "Username and password required" });
    }

//check student
    const student = await Student.findOne({ regNumber: username });
    if (student) {
      const ok = await argon2.verify(student.password, password); // assuming Student schema has hashed password
      if (!ok) {
        return res.status(401).json({ success: false, message: "Incorrect password" });
      }

      return res.json({
        success: true,
        role: "student",
        user: {
          id: student._id,
          username: student.regNumber,
          name: student.name,
          faculty: student.faculty,
          department: student.department,
          level: student.level,
        },
      });
    }

//check staff
    const staff = await Staff.findOne({ username });
    if (staff) {
      const ok = await argon2.verify(staff.password, password);
      if (!ok) {
        return res.status(401).json({ success: false, message: "Incorrect password" });
      }

      return res.json({
        success: true,
        role: "staff",
        user: {
          id: staff._id,
          username: staff.username,
          name: staff.name,
          faculty: staff.faculty || null,
          department: staff.department || null,
          role: staff.role,
        },
      });
    }

//check admin
    const admin = await Admin.findOne({ username });
    if (admin) {
      const ok = await argon2.verify(admin.password, password);
      if (!ok) {
        return res.status(401).json({ success: false, message: "Incorrect password" });
      }

      return res.json({
        success: true,
        role: "admin",
        user: {
          id: admin._id,
          username: admin.username,
          name: admin.username, 
          faculty: null,
          department: null,
          role: admin.role || "admin",
        },
      });
    }

    return res.status(404).json({ success: false, message: "User not found" });

  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;

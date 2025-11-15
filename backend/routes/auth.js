const express = require("express");
const router = express.Router();
const argon2 = require("argon2");
const Student = require("../models/Student");
const Staff = require("../models/Staff");
const Admin = require("../models/admin");

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

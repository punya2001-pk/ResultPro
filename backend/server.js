// ====== server.js ======
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");

// Models
const Student = require("./models/studentSchema");
const Staff = require("./models/staffSchema");
const Admin = require("./models/adminSchema"); // New admin model

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose
  .connect("mongodb://127.0.0.1:27017/universityDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("✅ MongoDB connected");

    // Ensure default admin exists
    const existingAdmin = await Admin.findOne({ username: "admin" });
    if (!existingAdmin) {
      const hashed = await bcrypt.hash("admin123", 10);
      await Admin.create({
        username: "admin",
        password: hashed,
        name: "System Administrator",
        email: "admin@university.com",
      });
      console.log("👑 Default admin created: username=admin, password=admin123");
    }
  })
  .catch((err) => console.log("❌ MongoDB connection error:", err));

// ===== Signup Routes =====
app.post("/api/students", async (req, res) => {
  try {
    const { username, password } = req.body;
    const existing = await Student.findOne({ username });
    if (existing) return res.json({ success: false, message: "Username already exists!" });

    const hashed = await bcrypt.hash(password, 10);
    const newStudent = new Student({ ...req.body, password: hashed });
    await newStudent.save();
    res.json({ success: true, message: "Student registered successfully!" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post("/api/staff", async (req, res) => {
  try {
    const { username, password } = req.body;
    const existing = await Staff.findOne({ username });
    if (existing) return res.json({ success: false, message: "Username already exists!" });

    const hashed = await bcrypt.hash(password, 10);
    const newStaff = new Staff({ ...req.body, password: hashed });
    await newStaff.save();
    res.json({ success: true, message: "Staff registered successfully!" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ===== Login Route =====
app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check Admin first
    const admin = await Admin.findOne({ username });
    if (admin) {
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) return res.json({ success: false, message: "Incorrect password!" });

      return res.json({
        success: true,
        message: "Admin login successful",
        role: "admin",
        user: { username: admin.username, name: admin.name, email: admin.email },
      });
    }

    // Check Student or Staff
    let user = await Student.findOne({ username });
    if (!user) user = await Staff.findOne({ username });
    if (!user) return res.json({ success: false, message: "User not found!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.json({ success: false, message: "Incorrect password!" });

    res.json({
      success: true,
      message: "Login successful",
      role: user.role,
      user: { username: user.username, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ===== Start Server =====
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));

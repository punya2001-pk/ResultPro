const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const Staff = require("../models/Staff");

// POST /api/staff  (signup)
router.post("/", async (req, res) => {
  try {
    const { username, password, name, faculty, department, role } = req.body;
    if (!username || !password || !name) return res.json({ success: false, message: "username, password and name required" });

    const exists = await Staff.findOne({ username });
    if (exists) return res.json({ success: false, message: "Username already taken" });

    const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS || 10));
    const hash = await bcrypt.hash(password, salt);

    const staff = new Staff({
      username,
      password: hash,
      name,
      faculty,
      department,
      role
    });

    await staff.save();
    res.json({ success: true, staff });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;

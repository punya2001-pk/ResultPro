const express = require("express");
const router = express.Router();
const Staff = require("../models/Staff");

//staff register
router.post("/register", async (req, res) => {
  try {
    const { username, password, name, faculty, department, role } = req.body;
    if (!username || !password || !name) return res.json({ success: false, message: "username, password and name required" });

    const exists = await Staff.findOne({ username });
    if (exists) return res.json({ success: false, message: "Username already taken" });

    const staff = new Staff({
      username,
      password,
      name,
      faculty,
      department,
      role : "staff"
    });

    await staff.save();
    res.json({ success: true, message: "Staff registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;

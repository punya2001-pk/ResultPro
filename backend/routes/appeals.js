const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
require("dotenv").config();

const faculties = ["science", "arts", "engineering"];
const connections = {};
faculties.forEach(f => {
  connections[f] = mongoose.createConnection(`${process.env.MONGO_URI}faculty_${f}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

// Submit appeal
router.post("/submit", async (req, res) => {
  const { regNumber, indexNumber, subjectCode, reason, faculty } = req.body;
  const db = connections[faculty];
  if (!db) return res.status(400).json({ message: "Invalid faculty" });

  const Appeal = db.model("Appeal", require("./models/appeal"));
  const appeal = new Appeal({ regNumber, indexNumber, subjectCode, reason, faculty });
  await appeal.save();
  res.json({ message: "Appeal submitted successfully" });
});

// Get appeals
router.get("/:faculty", async (req, res) => {
  const { faculty } = req.params;
  const db = connections[faculty];
  if (!db) return res.status(400).json({ message: "Invalid faculty" });

  const Appeal = db.model("Appeal", require("./models/appeal"));
  const appeals = await Appeal.find({});
  res.json(appeals);
});

module.exports = router;

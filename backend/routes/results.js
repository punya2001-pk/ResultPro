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

// Upload grades
router.post("/upload", async (req, res) => {
  const { regNumber, indexNumber, semester, subject, grade, uploadedBy, faculty } = req.body;
  const db = connections[faculty];
  if (!db) return res.status(400).json({ message: "Invalid faculty" });

  const Result = db.model("Result", require("./models/result"));
  const result = new Result({ regNumber, indexNumber, semester, subject, grade, uploadedBy, faculty });
  await result.save();
  res.json({ message: "Result uploaded successfully" });
});

// Get results per student
router.get("/:faculty/:indexNumber", async (req, res) => {
  const { faculty, indexNumber } = req.params;
  const db = connections[faculty];
  if (!db) return res.status(400).json({ message: "Invalid faculty" });

  const Result = db.model("Result", require("./models/result"));
  const results = await Result.find({ indexNumber });
  res.json(results);
});

module.exports = router;

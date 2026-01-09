const mongoose = require("mongoose");

const appealSchema = new mongoose.Schema({
  regNumber: String,
  indexNumber: String,
  subjectCode: String,
  reason: String,
  status: { type: String, default: "Pending" },
  submittedAt: { type: Date, default: Date.now },
  faculty: String,
});

module.exports = mongoose.model("Appeal", appealSchema);

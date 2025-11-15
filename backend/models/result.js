const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
  regNumber: String,
  indexNumber: String,
  semester: String,
  subject: String,
  grade: String,
  uploadedBy: String,
  uploadedAt: { type: Date, default: Date.now },
  faculty: String,
});

module.exports = mongoose.model("Result", resultSchema);

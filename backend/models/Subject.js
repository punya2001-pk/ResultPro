const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
  faculty: { type: String, required: true },
  department: { type: String, required: true },
  level: { type: String, required: true },
  subjectCode: { type: String, required: true, unique: true },
  subjectName: { type: String, required: true },
  credits: { type: Number, required: true },
});

module.exports = mongoose.model("Subject", subjectSchema);

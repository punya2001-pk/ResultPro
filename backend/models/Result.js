const mongoose = require("mongoose");

const singleResultSchema = new mongoose.Schema({
  indexNumber: { type: String, required: true },
  courseCode: { type: String, required: true }, // same as courseId
  marks: { type: Number, required: true },
  grade: { type: String, required: true }
});

const resultSchema = new mongoose.Schema({
  courseId: { type: String, required: true },  // courseCode, but used for queries
  faculty: String,
  department: String,
  level: String,
  semester: String,
  released: { type: Boolean, default: false },

  // Array of student results for this course
  results: [singleResultSchema],

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Result", resultSchema);

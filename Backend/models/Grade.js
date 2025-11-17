// models/Grade.js
const mongoose = require("mongoose");

const gradeSchema = new mongoose.Schema(
  {
    registrationNumber: { type: String, required: true, index: true },
    subjectCode: { type: String, required: true },
    grade: { type: String, default: "" },
    faculty: { type: String, required: true },
    department: { type: String, required: true },
    level: { type: String, required: true },
    semester: { type: String, required: true },
    type: { type: String, required: true }, // ICA or Exams
  },
  { timestamps: true }
);

// Compound unique index to prevent duplicates of the same exam record
gradeSchema.index(
  {
    registrationNumber: 1,
    subjectCode: 1,
    type: 1,
    faculty: 1,
    department: 1,
    level: 1,
    semester: 1,
  },
  { unique: true, name: "unique_grade_record" }
);

module.exports = mongoose.model("Grade", gradeSchema);

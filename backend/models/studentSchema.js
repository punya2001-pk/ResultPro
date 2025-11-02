// models/studentSchema.js
const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    regNumber: {
      type: String,
      required: true,
      trim: true,
    },
    indexNumber: {
      type: String,
      trim: true,
    },
    nic: {
      type: String,
      trim: true,
    },
    enrollmentDate: {
      type: String,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    faculty: {
      type: String,
      required: true,
      enum: ["Applied", "Business Studies", "Technology Studies"],
    },
    department: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    role: {
      type: String,
      default: "student",
    },
  },
  { timestamps: true } // optional: adds createdAt & updatedAt
);

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;

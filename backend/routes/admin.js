const express = require("express");
const router = express.Router();
const Course = require("../models/Course");
const Student = require("../models/Student");
const Result = require("../models/Result");
const { Parser } = require("json2csv");

// ==========================
// GET /api/admin/students
// ==========================
router.get("/students", async (req, res) => {
  try {
    const { faculty, department, level } = req.query;

    const filter = {};
    if (faculty) filter.faculty = faculty;
    if (department) filter.department = department;
    if (level) filter.level = level;

    const students = await Student.find(filter).select("-password");

    res.json({ success: true, students });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ==========================
// POST /api/admin/courses
// ==========================
router.post("/courses", async (req, res) => {
  try {
    const { code, name, faculty, department, level, credits } = req.body;

    if (!code || !name || !faculty || !department || !level)
      return res.json({ success: false, message: "Missing data" });

    const course = new Course({
      code,
      name,
      faculty,
      department,
      level,
      credits
    });

    await course.save();
    res.json({ success: true, course });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ==========================
// GET /api/admin/courses (fixed)
// ==========================
router.get("/courses", async (req, res) => {
  try {
    const { faculty, department, level } = req.query;

    if (!faculty || !department || !level) {
      return res.json({ success: false, message: "Missing parameters" });
    }

    const courses = await Course.find({
      faculty,
      department,
      level
    }).select("code name");

    res.json({ success: true, courses });

  } catch (error) {
    console.error(error);
    res.json({ success: false });
  }
});

// ==========================
// overview stats
// ==========================
router.get("/overview", async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalCourses = await Course.countDocuments();

    res.json({
      success: true,
      totalStudents,
      totalCourses,
    });
  } catch (error) {
    console.error("Error fetching overview stats:", error);
    res.json({ success: false, message: "Server error" });
  }
});

// ==========================
// (Optional) Add Result Route (indexNumber, courseCode, marks, grade)
// ==========================
router.post("/result", async (req, res) => {
  try {
    const { indexNumber, courseCode, marks, grade } = req.body;

    if (!indexNumber || !courseCode || !marks || !grade)
      return res.json({ success: false, message: "Missing fields" });

    const result = new Result({
      indexNumber,
      courseCode,
      marks,
      grade
    });

    await result.save();

    res.json({ success: true, result });
  } catch (error) {
    console.error("Result upload error:", error);
    res.json({ success: false, message: "Server error" });
  }
});

module.exports = router;

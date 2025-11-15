const express = require("express");
const router = express.Router();
const Course = require("../models/Course");
const Student = require("../models/Student");

// GET /api/admin/students?faculty=&department=&level=
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

// Courses
router.post("/courses", async (req, res) => {
  try {
    const { code, name, faculty, department, level, credits } = req.body;
    if (!code || !name || !faculty || !department || !level) return res.json({ success: false, message: "Missing data" });

    const course = new Course({ code, name, faculty, department, level, credits });
    await course.save();
    res.json({ success: true, course });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.get("/courses", async (req, res) => {
  try {
    const { faculty, department, level, semester } = req.query;

    const courses = await Course.find({
      faculty,
      department,
      level,
      semester,
    });

    res.json({ success: true, courses });
  } catch (error) {
    res.json({ success: false, message: "Server error" });
  }
});


// ===== Get Students by Faculty and Department =====
router.get("/students", async (req, res) => {
  try {
    const { faculty, department } = req.query;

    if (!faculty || !department) {
      return res.json({
        success: false,
        message: "Faculty and department are required",
      });
    }

    const students = await Student.find({ faculty, department });
    res.json({ success: true, students });
  } catch (error) {
    console.error("Error fetching students:", error);
    res.json({ success: false, message: "Server error" });
  }
});


// overview
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


module.exports = router;

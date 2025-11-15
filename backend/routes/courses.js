// routes/courses.js
const express = require("express");
const router = express.Router();
const Course = require("../models/Course");

// 📌 Add single course — POST /api/courses
router.post("/", async (req, res) => {
  try {
    const { faculty, department, level, semester, courseCode, courseName, credits } = req.body;

    if (!faculty || !department || !level || !semester || !courseCode || !courseName) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const newCourse = new Course({ faculty, department, level, semester, courseCode, courseName, credits });
    await newCourse.save();

    res.json({ success: true, course: newCourse });
  } catch (err) {
    console.error("❌ Error adding course:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// 📌 Get courses — GET /api/courses
router.get("/", async (req, res) => {
  try {
    const { faculty, department, level, semester } = req.query;
    const filter = {};
    if (faculty) filter.faculty = faculty;
    if (department) filter.department = department;
    if (level) filter.level = level;
    if (semester) filter.semester = semester;

    const courses = await Course.find(filter);
    res.json(courses); // directly return array for frontend
  } catch (err) {
    console.error("❌ Error fetching courses:", err);
    res.json([]); // return empty array on error
  }
});

// 📌 Bulk upload — POST /api/courses/bulk
router.post("/bulk", async (req, res) => {
  try {
    const { courses } = req.body;
    if (!Array.isArray(courses) || courses.length === 0) {
      return res.json({ success: false, message: "No courses provided" });
    }

    await Course.insertMany(courses, { ordered: false });
    res.json({ success: true, message: "Bulk courses uploaded successfully" });
  } catch (error) {
    console.error("❌ Bulk upload failed:", error);
    res.json({ success: false, message: "Bulk upload failed" });
  }
});

module.exports = router;

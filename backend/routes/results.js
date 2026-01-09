const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
require("dotenv").config();
const Student = require("../models/Student");
const Course = require("../models/Course");
const ResultSchema = require("../models/Result"); // single schema

const faculties = ["Science", "Arts", "Engineering"]; // example
const connections = {};
faculties.forEach(f => {
  connections[f] = mongoose.createConnection(`${process.env.MONGO_URI}faculty_${f}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

// -------- STAFF UPLOAD --------
router.post("/upload", async (req, res) => {
  try {
    const { faculty, courseId, level, semester, studentResults } = req.body;
    const db = connections[faculty];
    if (!db) return res.status(400).json({ message: "Invalid faculty" });

    const Result = db.model("Result", ResultSchema);

    let resultDoc = await Result.findOne({ courseId, level, semester });
    if (!resultDoc) {
      resultDoc = new Result({
        courseId,
        level,
        semester,
        faculty,
        results: studentResults,
        released: false
      });
    } else {
      studentResults.forEach(sr => {
        const existing = resultDoc.results.find(r => r.indexNumber === sr.indexNumber);
        if (existing) {
          existing.grade = sr.grade;
          existing.marks = sr.marks;
        } else {
          resultDoc.results.push(sr);
        }
      });
    }

    await resultDoc.save();
    res.json({ success: true, message: "Results uploaded successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// -------- ADMIN RELEASE --------
router.patch("/release", async (req, res) => {
  try {
    const { faculty, courseId, level, semester } = req.body;
    const db = connections[faculty];
    if (!db) return res.status(400).json({ message: "Invalid faculty" });

    const Result = db.model("Result", ResultSchema);

    const updated = await Result.updateOne({ courseId, level, semester }, { released: true });
    if (updated.modifiedCount === 0)
      return res.json({ success: false, message: "No result found to release" });

    res.json({ success: true, message: "Result released successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// -------- STUDENT FETCH --------
router.get("/", async (req, res) => {
  try {
    const { username, faculty, level, semester } = req.query;
    const db = connections[faculty];
    if (!db) return res.status(400).json({ message: "Invalid faculty" });

    const Result = db.model("Result", ResultSchema);
    const student = await Student.findOne({ regNumber: username });
    if (!student) return res.json({ success: false, message: "Student not found" });

    const resultDocs = await Result.find({ level, semester, released: true });

    const finalResults = [];
    for (const doc of resultDocs) {
      const studRes = doc.results.find(r => r.indexNumber === student.indexNumber);
      if (!studRes) continue;

      const course = await Course.findOne({ courseCode: doc.courseId });
      finalResults.push({
        code: doc.courseId,
        name: course?.courseName || "Unknown",
        grade: studRes.grade,
        gpa: convertGradeToGPA(studRes.grade),
        credits: course?.credits || 0
      });
    }

    res.json({ success: true, results: finalResults });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Server error" });
  }
});

// -------- STUDENT PDF --------
const PDFDocument = require("pdfkit");
router.get("/download-result", async (req, res) => {
  try {
    const { username, faculty, level, semester } = req.query;
    const db = connections[faculty];
    if (!db) return res.status(400).json({ message: "Invalid faculty" });

    const Result = db.model("Result", ResultSchema);
    const student = await Student.findOne({ regNumber: username });
    if (!student) return res.status(404).send("Student not found");

    const resultDocs = await Result.find({ level, semester, released: true });
    if (!resultDocs.length) return res.status(404).send("No results released yet");

    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${username}_${level}_${semester}_Result.pdf`
    );

    doc.pipe(res);
    doc.fontSize(20).text("University Result Sheet", { align: "center" });
    doc.moveDown();
    doc.fontSize(14).text(`Student: ${student.name} (${student.regNumber})`);
    doc.text(`Level: ${level}`);
    doc.text(`Semester: ${semester}`);
    doc.moveDown();

    for (const r of resultDocs) {
      const studRes = r.results.find(x => x.indexNumber === student.indexNumber);
      if (!studRes) continue;

      const course = await Course.findOne({ courseCode: r.courseId });
      doc.text(
        `${r.courseId} - ${course?.courseName || "Unknown"} | Grade: ${
          studRes.grade
        } | GPA: ${convertGradeToGPA(studRes.grade)} | Credits: ${course?.credits || 0}`
      );
    }

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

function convertGradeToGPA(grade) {
  const map = { A: 4, B: 3, C: 2, D: 1, E: 0, F: 0 };
  return map[grade] || 0;
}

module.exports = router;

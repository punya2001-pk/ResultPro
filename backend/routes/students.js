const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const Student = require("../models/Student");
const argon2 = require("argon2");
const DEFAULT_PASSWORD = "student123"; 
const mongoose = require("mongoose");

const sendCredentialsEmail = async (studentEmail, studentName, registrationNumber) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "resultprouov@gmail.com",
        pass: "uov@12345", 
      },
    });

    const mailOptions = {
      from: "resultprouov@gmail.com",
      to: studentEmail,
      subject: "Your Student Account Credentials",
      html: `
        <h3>Welcome to the University Result Management System</h3>
        <p>Dear ${studentName},</p>
        <p>Your account has been created successfully.</p>
        <p><b>Username:</b> ${registrationNumber}</p>
        <p><b>Password:</b> ${DEFAULT_PASSWORD}</p>
        <p>Please change your password after your first login.</p>
        <p>Best regards,<br/>University Admin</p>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

router.post("/register", async (req, res) => {
  try {
    const {
      name,
      regNumber,
      indexNumber,
      address,
      birthdate,
      gender,
      mobile,
      email,
      faculty,
      department,
      level,
    } = req.body;

    if (!name || !regNumber || !indexNumber || !faculty || !department || !level) {
      return res.status(400).json({ success: false, message: "Missing required fields." });
    }

    const existing = await Student.findOne({ regNumber });
    if (existing) {
      return res.status(400).json({ success: false, message: "Student already exists." });
    }

    const hashedPassword = await argon2.hash(DEFAULT_PASSWORD);

    const newStudent = new Student({
      name,
      regNumber,
      indexNumber,
      address,
      birthdate,
      gender,
      mobile,
      email,
      faculty,
      department,
      level,
      password: hashedPassword, 
    });

    await newStudent.save();

    if (email) await sendCredentialsEmail(email, name, regNumber);

    res.json({ success: true, student: newStudent });
  } catch (error) {
    console.error("Error adding student:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

router.post("/bulk", async (req, res) => {
  try {
    const { students } = req.body;

    if (!Array.isArray(students) || students.length === 0) {
      return res.status(400).json({ success: false, message: "No students provided." });
    }

    const studentsWithPassword = await Promise.all(
      students.map(async (s) => ({
        ...s,
        password: await argon2.hash(DEFAULT_PASSWORD), 
      }))
    );

    await Student.insertMany(studentsWithPassword, { ordered: false });

    for (const s of studentsWithPassword) {
      if (s.email) await sendCredentialsEmail(s.email, s.name, s.regNumber);
    }

    res.json({ success: true, message: "Bulk students uploaded successfully." });
  } catch (error) {
    console.error("Bulk upload failed:", error);
    res.status(500).json({ success: false, message: "Bulk upload failed." });
  }
});

router.get("/", async (req, res) => {
  try {
    const { faculty, department, level } = req.query;

    const filter = {};

    if (faculty) filter.faculty = faculty.trim();
    if (department) filter.department = department.trim();
    if (level) filter.level = level

    const students = await Student.find(filter);
    res.json({ success: true, students });
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Student.findByIdAndDelete(id);
    res.json({ success: true, message: "Student deleted." });
  } catch (error) {
    console.error("Error deleting student:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

module.exports = router;

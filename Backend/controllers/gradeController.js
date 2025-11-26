const Grade = require("../models/Grade");
const xlsx = require("xlsx");
const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");

// ===== Upload Grades (Excel or CSV) =====
exports.uploadGrades = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const filePath = path.join(__dirname, "../uploads", req.file.filename);
    const fileExt = path.extname(req.file.originalname).toLowerCase();

    let grades = [];

    if (fileExt === ".xlsx") {
      const workbook = xlsx.readFile(filePath);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = xlsx.utils.sheet_to_json(sheet);

      grades = data.map((row) => ({
        index: row.index || row.Index || row.StudentIndex || "",
        grade: row.grade || row.Grade || "",
      }));
    } else if (fileExt === ".csv") {
      const rows = [];
      fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", (row) => rows.push(row))
        .on("end", async () => {
          grades = rows.map((r) => ({
            index: r.index || r.Index || r.StudentIndex || "",
            grade: r.grade || r.Grade || "",
          }));

          await Grade.insertMany(grades);
          fs.unlinkSync(filePath);
          return res.json({ message: "CSV uploaded successfully", grades });
        });
      return;
    }

    if (grades.length === 0) {
      return res.status(400).json({ message: "No grades found in file" });
    }

    await Grade.insertMany(grades);
    fs.unlinkSync(filePath);

    res.json({ message: "File uploaded successfully", grades });
  } catch (err) {
    console.error("❌ Upload Error:", err);
    res.status(500).json({ message: "Server error during upload" });
  }
};

// ===== Update Grades =====
exports.updateGrades = async (req, res) => {
  try {
    const { grades } = req.body;

    if (!grades || !Array.isArray(grades)) {
      return res.status(400).json({ message: "Invalid grades data" });
    }

    await Grade.deleteMany({}); // clear old data
    await Grade.insertMany(grades);

    res.json({ message: "Grades updated successfully!" });
  } catch (err) {
    console.error("❌ Save Error:", err);
    res.status(500).json({ message: "Server error during update" });
  }
};

// ===== Get All Grades =====
exports.getResults = async (req, res) => {
  try {
    const grades = await Grade.find();
    res.json(grades);
  } catch (err) {
    console.error("❌ Fetch Error:", err);
    res.status(500).json({ message: "Error fetching results" });
  }
};


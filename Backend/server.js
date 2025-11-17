// server.js
const express = require("express");
const multer = require("multer");
const XLSX = require("xlsx");
const csv = require("csv-parser");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const Grade = require("./models/Grade");

const app = express();
app.use(cors());
app.use(express.json());

// ------------------- MongoDB Connection -------------------
mongoose
  .connect("mongodb://127.0.0.1:27017/gradesDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ------------------- Multer Setup -------------------
const upload = multer({ dest: "uploads/" });

// ------------------- Helpers -------------------
function normalizeHeader(str = "") {
  return String(str).trim().toLowerCase();
}

function normalizeRow(row) {
  const kLower = {};
  Object.keys(row).forEach((k) => (kLower[normalizeHeader(k)] = row[k]));

  const registrationNumber =
    kLower["registrationnumber"] ||
    kLower["registration_no"] ||
    kLower["index"] ||
    kLower["studentindex"] ||
    kLower["regno"] ||
    kLower["reg"] ||
    "";

  const subjectCode = kLower["subjectcode"] || kLower["subject"] || "";
  const grade = kLower["grade"] || kLower["marks"] || "";

  return {
    registrationNumber: String(registrationNumber).trim(),
    subjectCode: String(subjectCode).trim(),
    grade: String(grade).trim(),
  };
}

// ------------------- Upload Grades -------------------
app.post("/api/upload-grades/:type", upload.single("file"), async (req, res) => {
  try {
    const { type } = req.params;
    const { faculty, department, level, semester } = req.body;

    if (!req.file) return res.status(400).json({ message: "No file uploaded!" });
    if (!faculty || !department || !level || !semester) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: "Missing metadata" });
    }

    const filePath = path.join(__dirname, req.file.path);
    const ext = path.extname(req.file.originalname).toLowerCase();
    let rows = [];

    if (ext === ".xlsx" || ext === ".xls") {
      const workbook = XLSX.readFile(filePath);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      rows = XLSX.utils.sheet_to_json(sheet, { defval: "" }).map(normalizeRow);
    } else if (ext === ".csv") {
      const csvData = [];
      await new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
          .pipe(csv())
          .on("data", (row) => csvData.push(row))
          .on("end", () => resolve())
          .on("error", (err) => reject(err));
      });
      rows = csvData.map(normalizeRow);
    } else {
      fs.unlinkSync(filePath);
      return res.status(400).json({ message: "Unsupported file type" });
    }

    fs.unlinkSync(filePath);

    const validRows = rows
      .filter((r) => r.registrationNumber && r.subjectCode)
      .map((r) => ({
        registrationNumber: r.registrationNumber,
        subjectCode: r.subjectCode,
        grade: r.grade,
        faculty,
        department,
        level,
        semester,
        type,
      }));

    const operations = validRows.map((d) => {
      const filter = {
        registrationNumber: d.registrationNumber,
        subjectCode: d.subjectCode,
        type: d.type,
        faculty: d.faculty,
        department: d.department,
        level: d.level,
        semester: d.semester,
      };
      return { updateOne: { filter, update: { $set: d }, upsert: true } };
    });

    await Grade.bulkWrite(operations, { ordered: false });
    res.json({ message: `✅ ${type} grades uploaded!`, grades: validRows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error uploading grades" });
  }
});

// ------------------- Get Grades -------------------
app.get("/api/grades/:type", async (req, res) => {
  try {
    const { type } = req.params;
    const { faculty, department, level, semester } = req.query;
    const filter = { type };
    if (faculty) filter.faculty = faculty;
    if (department) filter.department = department;
    if (level) filter.level = level;
    if (semester) filter.semester = semester;

    const grades = await Grade.find(filter).lean();
    res.json(grades);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching grades" });
  }
});

// ------------------- Update Grades -------------------
app.post("/api/update-grades/:type", async (req, res) => {
  try {
    const { type } = req.params;
    const { grades } = req.body;
    if (!grades || !Array.isArray(grades)) return res.status(400).json({ message: "Invalid grades" });

    const ops = grades.map((g) => {
      const { registrationNumber, subjectCode, grade, faculty, department, level, semester } = g;
      return {
        updateOne: {
          filter: { registrationNumber, subjectCode, type, faculty, department, level, semester },
          update: { $set: { registrationNumber, subjectCode, grade, type, faculty, department, level, semester } },
          upsert: true,
        },
      };
    });

    await Grade.bulkWrite(ops, { ordered: false });
    res.json({ message: `✅ ${type} grades updated!` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating grades" });
  }
});

// ------------------- Delete Single Grade -------------------
app.delete("/api/delete-grade", async (req, res) => {
  try {
    const { registrationNumber, subjectCode, type, faculty, department, level, semester } = req.query;

    if (!registrationNumber || !subjectCode || !type || !faculty || !department || !level || !semester) {
      return res.status(400).json({ message: "Missing query parameters for delete" });
    }

    const deleted = await Grade.findOneAndDelete({
      registrationNumber,
      subjectCode,
      type,
      faculty,
      department,
      level,
      semester,
    });

    if (!deleted) return res.status(404).json({ message: "Grade not found" });

    res.json({ message: "✅ Grade deleted successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting grade" });
  }
});

// ------------------- Download Excel Template -------------------
app.get("/api/download-template/:type", (req, res) => {
  const { type } = req.params;
  const { faculty, department, level, semester } = req.query;

  if (!type || !faculty || !department || !level || !semester) {
    return res.status(400).json({ message: "Missing parameters" });
  }

  const ws_data = [["RegistrationNumber", "SubjectCode", "Grade"], ["", "", ""]];
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(ws_data);
  XLSX.utils.book_append_sheet(wb, ws, "Template");

  const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=${type}_${faculty}_${department}_${level}_${semester}.xlsx`
  );
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.send(buffer);
});

// ------------------- Start Server -------------------
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));

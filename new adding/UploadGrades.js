import React, { useState, useEffect } from "react";
import axios from "axios";
import "../CSS/UploadGrades.css";

// ===== Data =====
  const faculties = [
    "Faculty of Applied Science",
    "Faculty of Business Studies",
    "Faculty of Technological Studies",
  ];

  const facultyDepartments = {
    "Faculty of Applied Science": [
      "Department of Physical",
      "Department of Biological",
    ],
    "Faculty of Business Studies": [
      "Department of Management",
      "Department of Finance",
    ],
    "Faculty of Technological Studies": [
      "Department of Engineering",
      "Department of IT",
    ],
  };
const levels = ["Level 1", "Level 2", "Level 3", "Level 4"];
const semesters = ["Semester 1", "Semester 2"];

const UploadGrades = ({ initialType }) => {
  const [selectedType, setSelectedType] = useState(initialType || "");
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");

  const [file, setFile] = useState(null);
  const [grades, setGrades] = useState([]);
  const [message, setMessage] = useState("");
  const [showTable, setShowTable] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialType) setSelectedType(initialType);
  }, [initialType]);

  // ---------------- File Handling ----------------
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage("");
  };

  const handleUpload = async () => {
    setMessage("");
    if (!file) return setMessage("⚠️ Please select a file!");
    if (!selectedType || !selectedFaculty || !selectedDepartment || !selectedLevel || !selectedSemester) {
      return setMessage("⚠️ Please select all dropdowns before uploading!");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("faculty", selectedFaculty);
    formData.append("department", selectedDepartment);
    formData.append("level", selectedLevel);
    formData.append("semester", selectedSemester);

    try {
      setLoading(true);
      const res = await axios.post(
        `http://localhost:5000/api/upload-grades/${selectedType}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const returned = res.data.grades || [];
      const normalized = returned.map((r) => ({
        registrationNumber: r.registrationNumber || "",
        subjectCode: r.subjectCode || "",
        grade: r.grade || "",
        faculty: selectedFaculty,
        department: selectedDepartment,
        level: selectedLevel,
        semester: selectedSemester,
      }));

      setGrades(normalized);
      setShowTable(true);
      setMessage(res.data.message || "✅ Grades uploaded successfully!");
    } catch (err) {
      console.error(err?.response?.data || err);
      setMessage("❌ Error uploading file!");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- Save Grades ----------------
  const handleSave = async () => {
    setMessage("");
    if (!grades.length) return setMessage("⚠️ No grades to save!");

    try {
      setLoading(true);
      const res = await axios.post(
        `http://localhost:5000/api/update-grades/${selectedType}`,
        { grades }
      );
      setMessage(res.data.message || "✅ Grades saved successfully!");
    } catch (err) {
      console.error(err?.response?.data || err);
      setMessage("❌ Error saving grades!");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- Add Row ----------------
  const handleAddRow = () => {
    setGrades((g) => [
      ...g,
      {
        registrationNumber: "",
        subjectCode: "",
        grade: "",
        faculty: selectedFaculty,
        department: selectedDepartment,
        level: selectedLevel,
        semester: selectedSemester,
      },
    ]);
  };

  // ---------------- Delete Row (DB + Frontend) ----------------
  const handleDeleteRow = async (index) => {
    const row = grades[index];
    if (!row.registrationNumber || !row.subjectCode) {
      setMessage("⚠️ Cannot delete incomplete row");
      return;
    }

    try {
      setLoading(true);
      await axios.delete("http://localhost:5000/api/delete-grade", {
        params: {
          registrationNumber: row.registrationNumber,
          subjectCode: row.subjectCode,
          type: selectedType,
          faculty: selectedFaculty,
          department: selectedDepartment,
          level: selectedLevel,
          semester: selectedSemester,
        },
      });

      const updated = grades.filter((_, i) => i !== index);
      setGrades(updated);
      setMessage("✅ Grade deleted successfully!");
    } catch (err) {
      console.error(err?.response?.data || err);
      setMessage("❌ Error deleting grade!");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- Download Template ----------------
  const handleDownloadTemplate = async () => {
    if (!selectedType || !selectedFaculty || !selectedDepartment || !selectedLevel || !selectedSemester) {
      setMessage("⚠️ Please select all dropdowns first!");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:5000/api/download-template/${selectedType}`,
        {
          params: { faculty: selectedFaculty, department: selectedDepartment, level: selectedLevel, semester: selectedSemester },
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = `${selectedType}_${selectedFaculty}_${selectedDepartment}_${selectedLevel}_${selectedSemester}.xlsx`;
      link.click();
    } catch (err) {
      console.error(err);
      setMessage("❌ Error downloading template!");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- Render ----------------
  return (
    <div className="upload-container">
      <div className="upload-card">
        <h2>📘 Select Result Update Category</h2>

        {!selectedType ? (
          <div className="button-container">
            <button onClick={() => setSelectedType("ICA")}>ICA</button>
            <button onClick={() => setSelectedType("Exams")}>Final Exams</button>
          </div>
        ) : (
          <>
            <h3>Selected: {selectedType}</h3>

            <div className="dropdown">
              <label>Faculty:</label>
              <select value={selectedFaculty} onChange={(e) => setSelectedFaculty(e.target.value)}>
                <option value="">-- Select Faculty --</option>
                {faculties.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>

            {selectedFaculty && (
              <div className="dropdown">
                <label>Department:</label>
                <select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)}>
                  <option value="">-- Select Department --</option>
                  {facultyDepartments[selectedFaculty].map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            )}

            {selectedDepartment && (
              <div className="dropdown">
                <label>Level:</label>
                <select value={selectedLevel} onChange={(e) => setSelectedLevel(e.target.value)}>
                  <option value="">-- Select Level --</option>
                  {levels.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            )}

            {selectedLevel && (
              <div className="dropdown">
                <label>Semester:</label>
                <select value={selectedSemester} onChange={(e) => setSelectedSemester(e.target.value)}>
                  <option value="">-- Select Semester --</option>
                  {semesters.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            )}

            {selectedSemester && (
              <div className="button-container" style={{ marginTop: "15px" }}>
                <button onClick={handleDownloadTemplate}>📥 Download Template</button>
                <input type="file" accept=".xlsx,.csv" onChange={handleFileChange} style={{ marginLeft: "10px" }} />
                <button onClick={handleUpload} style={{ marginLeft: "10px" }}>{loading ? "Uploading..." : "Upload File"}</button>
              </div>
            )}

            {message && <p className={`message ${message.includes("❌") ? "error" : "success"}`}>{message}</p>}

            {showTable && (
              <div className="grades-table">
                <h3>📝 Edit Grades</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Registration Number</th>
                      <th>Subject Code</th>
                      <th>Grade</th>
                      <th>Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {grades.map((row, i) => (
                      <tr key={i}>
                        <td>
                          <input
                            value={row.registrationNumber}
                            onChange={(e) => {
                              const updated = [...grades];
                              updated[i].registrationNumber = e.target.value;
                              setGrades(updated);
                            }}
                          />
                        </td>
                        <td>
                          <input
                            value={row.subjectCode}
                            onChange={(e) => {
                              const updated = [...grades];
                              updated[i].subjectCode = e.target.value;
                              setGrades(updated);
                            }}
                          />
                        </td>
                        <td>
                          <input
                            value={row.grade}
                            onChange={(e) => {
                              const updated = [...grades];
                              updated[i].grade = e.target.value;
                              setGrades(updated);
                            }}
                          />
                        </td>
                        <td>
                          <button onClick={() => handleDeleteRow(i)}>🗑 Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="btn-group">
                  <button onClick={handleAddRow}>➕ Add Row</button>
                  <button onClick={handleSave}>{loading ? "Saving..." : "💾 Save Grades"}</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UploadGrades;
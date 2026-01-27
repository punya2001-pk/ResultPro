import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../CSS/EditGrades.css";

const EditGrades = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    type,
    faculty,
    department,
    level,
    semester,
    grades: initialGrades,
    courseId,
    courseName,
    courseCode
  } = location.state || {};

  const [grades, setGrades] = useState(initialGrades || []);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [subjectType, setSubjectType] = useState("Theory Only"); 

  const [course] = useState(
    courseId ? { _id: courseId, courseName, courseCode } : null
  );

  useEffect(() => {
    if (!type || !faculty || !department || !level || !semester || !course) {
      navigate("/staff-dashboard");
    }
  }, [type, faculty, department, level, semester, course, navigate]);

  useEffect(() => {
    const fetchStudentsAndInitialize = async () => {
      if (grades.length === 0 && course) {
        setLoading(true);
        try {
          const studentRes = await axios.get("http://localhost:5000/api/students", {
            params: { faculty, department, level }
          });
          const students = studentRes.data.students || [];

          let icaDataMap = {};
          if (type !== "ICA") {
            try {
              const icaRes = await axios.get(`http://localhost:5000/api/grades/get-grades/ICA`, {
                params: { faculty, department, level, semester, courseId: course._id }
              });

              if (icaRes.data.grades) {
                icaRes.data.grades.forEach(row => {
                  const tMarks = [row.ica1 || 0, row.ica2 || 0, row.ica3 || 0].map(Number).sort((a,b) => b-a);
                  const tAvg = (tMarks[0] + tMarks[1]) / 2;

                  const pMarks = [row.prac_ica1 || 0, row.prac_ica2 || 0, row.prac_ica3 || 0].map(Number).sort((a,b) => b-a);
                  const pAvg = (pMarks[0] + pMarks[1]) / 2;

                  const key = row.registrationNumber || row.regNumber; 
                  icaDataMap[key] = { theoryAvg: tAvg, pracAvg: pAvg }; 
                });
              }
            } catch (err) {
              console.warn("Could not fetch ICA marks:", err);
            }
          }

          const newRows = students.map(std => {
            const commonFields = {
              registrationNumber: std.regNumber, 
              indexNumber: std.indexNumber,
              faculty, department, level, semester,
              courseId: course._id,
              courseName: course.courseName,
              courseCode: course.courseCode
            };

            if (type === "ICA") {
              return { 
                ...commonFields, 
                ica1: 0, ica2: 0, ica3: 0, 
                additional1: 0, additional2: 0, 
                finalMarks: 0,
                prac_ica1: 0, prac_ica2: 0, prac_ica3: 0,
                prac_add1: 0, prac_add2: 0,
                prac_finalMarks: 0
              };
            } else {
              const icaData = icaDataMap[std.regNumber] || { theoryAvg: 0, pracAvg: 0 };
              return { 
                ...commonFields, 
                q1: 0, q2: 0, q3: 0, q4: 0, q5: 0, 
                icaMarks: icaData.theoryAvg, 
                prac_exam_marks: 0, 
                prac_icaMarks: icaData.pracAvg 
              };
            }
          });

          if (newRows.length > 0) {
            setGrades(newRows);
            setMessage(`✅ Successfully loaded ${newRows.length} students.`);
          } else {
            setMessage("ℹ️ No students found for this selection.");
          }
        } catch (err) {
          console.error("Error loading students:", err);
          setMessage("⚠️ Error fetching student list from server.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchStudentsAndInitialize();
  }, [faculty, department, level, semester, type, grades.length, course]);

  const handleSave = async () => {
    setMessage("");
    if (!grades.length) return setMessage("⚠️ No grades to save!");

    try {
      setLoading(true);
      const res = await axios.post(
        `http://localhost:5000/api/grades/update-grades/${type}`,
        { grades, subjectType } 
      );
      setMessage(res.data.message || "✅ Grades saved successfully!");
    } catch (err) {
      console.error(err?.response?.data || err);
      setMessage("❌ Error saving grades!");
    } finally {
      setLoading(false);
    }
  };

  const calculateGrade = (totalMarks) => {
    const total = Math.round(totalMarks);
    if (total >= 80) return "A+";
    if (total >= 75) return "A";
    if (total >= 70) return "A-";
    if (total >= 65) return "B+";
    if (total >= 60) return "B";
    if (total >= 55) return "B-";
    if (total >= 50) return "C+";
    if (total >= 45) return "C";
    if (total >= 40) return "C-";
    if (total >= 35) return "D+";
    if (total >= 30) return "D";
    return "E";
  };

  const handleAddRow = () => {
    const newRow = {
      registrationNumber: "", indexNumber: "",
      faculty, department, level, semester,
      courseId: course._id,
      courseName: course.courseName,
      courseCode: course.courseCode
    };

    const emptyGrades = type === "ICA" 
      ? { ica1: 0, ica2: 0, ica3: 0, additional1: 0, additional2: 0, finalMarks: 0, prac_ica1: 0, prac_ica2: 0, prac_ica3: 0, prac_add1: 0, prac_add2: 0, prac_finalMarks: 0 }
      : { q1: 0, q2: 0, q3: 0, q4: 0, q5: 0, icaMarks: 0, prac_exam_marks: 0, prac_icaMarks: 0 };

    setGrades([...grades, { ...newRow, ...emptyGrades }]);
  };

  const handleDeleteRow = (index) => {
    setGrades(grades.filter((_, i) => i !== index));
  };

  const updateRow = (index, field, value) => {
    const updated = [...grades];
    updated[index][field] = value;
    setGrades(updated);
  };

  const calcBest2Avg = (m1, m2, m3) => {
    const marks = [Number(m1)||0, Number(m2)||0, Number(m3)||0].sort((a,b)=>b-a);
    return (marks[0] + marks[1]) / 2;
  }

  return (
    <div className="upload-container">
      <div className="upload-card">
        <div className="card-header">
           <h2>📝 Edit {type} Grades</h2>
           <button className="back-btn" onClick={() => navigate(-1)}>⬅ Back</button>
        </div>

        <div className="info-bar">
          <span><strong>Course:</strong> {course?.courseName}</span>
          <span className="subject-type-selector">
            <strong>Type:</strong>
            <select value={subjectType} onChange={(e) => setSubjectType(e.target.value)}>
                <option value="Theory Only">Theory Only</option>
                <option value="Theory + Practical">Theory + Practical</option>
            </select>
          </span>
        </div>

        {message && <div className={`message ${message.includes("✅") ? "success" : "error"}`}>{message}</div>}

        <div className="grades-table-wrapper">
          <table>
            <thead>
                <tr>
                  <th>Reg No</th>
                  {type === "ICA" ? (
                    <><th>ICA 1</th><th>ICA 2</th><th>ICA 3</th><th>Total</th></>
                  ) : (
                    <><th>Q1</th><th>Q2</th><th>Q3</th><th>Q4</th><th>Q5</th><th>Grade</th></>
                  )}
                  <th>Action</th>
                </tr>
            </thead>
            <tbody>
              {grades.map((row, i) => {
                const total = type === "ICA" ? calcBest2Avg(row.ica1, row.ica2, row.ica3) : 0;
                return (
                  <tr key={i}>
                    <td><input value={row.registrationNumber} readOnly /></td>
                    {type === "ICA" ? (
                      <>
                        <td><input type="number" value={row.ica1} onChange={(e) => updateRow(i, 'ica1', e.target.value)} /></td>
                        <td><input type="number" value={row.ica2} onChange={(e) => updateRow(i, 'ica2', e.target.value)} /></td>
                        <td><input type="number" value={row.ica3} onChange={(e) => updateRow(i, 'ica3', e.target.value)} /></td>
                        <td>{total.toFixed(2)}</td>
                      </>
                    ) : (
                      <>
                        <td><input type="number" value={row.q1} onChange={(e) => updateRow(i, 'q1', e.target.value)} /></td>
                        <td><input type="number" value={row.q2} onChange={(e) => updateRow(i, 'q2', e.target.value)} /></td>
                        <td><input type="number" value={row.q3} onChange={(e) => updateRow(i, 'q3', e.target.value)} /></td>
                        <td><input type="number" value={row.q4} onChange={(e) => updateRow(i, 'q4', e.target.value)} /></td>
                        <td><input type="number" value={row.q5} onChange={(e) => updateRow(i, 'q5', e.target.value)} /></td>
                        <td>{calculateGrade((Number(row.q1)+Number(row.q2)+Number(row.q3)+Number(row.q4)+Number(row.q5))/5)}</td>
                      </>
                    )}
                    <td><button onClick={() => handleDeleteRow(i)}>🗑</button></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="btn-group">
          <button className="add-btn" onClick={handleAddRow}>➕ Add Row</button>
          <button className="save-btn" onClick={handleSave} disabled={loading}>{loading ? "Saving..." : "💾 Save"}</button>
        </div>
      </div>
    </div>
  );
};

export default EditGrades;
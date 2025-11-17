import React, { useState } from "react";
import "../CSS/StudentDashboard.css";

function StudentDashboard({ username, handleLogout }) {
  const [level, setLevel] = useState("Level 1");
  const [semester, setSemester] = useState("First Semester");

  const results = [
    { code: "ITI113", name: "Fundamentals of Information Technology", grade: "A", gpa: 4.0, credits: 1 },
    { code: "ITI122", name: "Foundation of Mathematics", grade: "B+", gpa: 3.3, credits: 2 },
    { code: "ITI134", name: "Fundamentals of Programming", grade: "A-", gpa: 3.7, credits: 4 },
    { code: "ITI144", name: "Fundamentals of Web Programming", grade: "A", gpa: 4.0, credits: 4 },
    { code: "ITI152", name: "Essentials of Statistics", grade: "B+", gpa: 3.3, credits: 2 },
    { code: "ACU113", name: "English Language I", grade: "A-", gpa: 3.7, credits: 3 },
  ];

  const totalCredits = results.reduce((sum, r) => sum + r.credits, 0);
  const gpa = (results.reduce((sum, r) => sum + r.gpa, 0) / results.length).toFixed(2);

  return (
    <div className="student-dashboard-container">
      <header className="student-header">
        <h1>🎓 University Result Management System</h1>
        <div className="header-right">
          <span>{username}</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <div className="student-info">
        <h2>Welcome, {username}</h2>
        <p>Registration: 2021ICT108 | Current Level: 2</p>
        <div className="gpa-box">Current CGPA: <strong>{gpa}</strong></div>
      </div>

      <div className="selectors">
        <div className="level-select">
          <span>Select Level:</span>
          <button
            className={level === "Level 1" ? "active" : ""}
            onClick={() => setLevel("Level 1")}
          >
            Level 1
          </button>
          <button
            className={level === "Level 2" ? "active" : ""}
            onClick={() => setLevel("Level 2")}
          >
            Level 2
          </button>
          <button
            className={level === "Level 3" ? "active" : ""}
            onClick={() => setLevel("Level 3")}
          >
            Level 3
          </button>
          <button
            className={level === "Level 4" ? "active" : ""}
            onClick={() => setLevel("Level ")}
          >
            Level 1
          </button>
        </div>

        <div className="semester-select">
          <span>Select Semester:</span>
          <button
            className={semester === "First Semester" ? "active" : ""}
            onClick={() => setSemester("First Semester")}
          >
            First Semester
          </button>
          <button
            className={semester === "Second Semester" ? "active" : ""}
            onClick={() => setSemester("Second Semester")}
          >
            Second Semester
          </button>
        </div>
      </div>

      <div className="results-section">
        <h3>{level} - {semester} Results</h3>
        <table className="results-table">
          <thead>
            <tr>
              <th>Course Code</th>
              <th>Course Name</th>
              <th>Grade</th>
              <th>GPA</th>
              <th>Credits</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, i) => (
              <tr key={i}>
                <td>{r.code}</td>
                <td>{r.name}</td>
                <td>{r.grade}</td>
                <td>{r.gpa}</td>
                <td>{r.credits}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="summary">
          <div>Total Courses: {results.length}</div>
          <div>{level} - {semester} GPA: {gpa}</div>
          <div>Total Credits: {totalCredits}</div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;

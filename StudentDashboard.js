import React, { useState, useEffect } from "react";
import "../CSS/StudentDashboard.css";

function StudentDashboard({ username, handleLogout }) {
  const [level, setLevel] = useState("Level 1");
  const [semester, setSemester] = useState("First Semester");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch results from MongoDB based on level and semester
  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/results?username=${username}&level=${level}&semester=${semester}`);
        const data = await response.json();
        
        if (data.success) {
          setResults(data.results || []);
        } else {
          setResults([]);
        }
      } catch (error) {
        console.error("Error fetching results:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [username, level, semester]);

  // Calculate GPA and totals
  const totalCredits = results.reduce((sum, r) => sum + (r.credits || 0), 0);
  const semesterGPA = results.length > 0 
    ? (results.reduce((sum, r) => sum + (r.gpa || 0), 0) / results.length).toFixed(2)
    : "0.00";

  const downloadPDF = async () => {
    try {
      const response = await fetch(`/api/download-result?username=${username}&level=${level}&semester=${semester}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${username}_${level}_${semester}_Result.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      alert("Error downloading result. Please try again.");
    }
  };

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
        <p>Registration: {username} | Current Level: 2</p>
        <div className="gpa-box">Current CGPA: <strong>3.45</strong></div>
      </div>

      <div className="selectors">
        <div className="level-select">
          <span>Select Level:</span>
          {["Level 1", "Level 2", "Level 3", "Level 4"].map((lvl) => (
            <button
              key={lvl}
              className={`level-btn ${level === lvl ? "active" : ""}`}
              onClick={() => setLevel(lvl)}
            >
              {lvl}
            </button>
          ))}
        </div>

        <div className="semester-select">
          <span>Select Semester:</span>
          {["First Semester", "Second Semester"].map((sem) => (
            <button
              key={sem}
              className={`semester-btn ${semester === sem ? "active" : ""}`}
              onClick={() => setSemester(sem)}
            >
              {sem}
            </button>
          ))}
        </div>
      </div>

      <div className="results-section">
        <div className="section-header">
          <h3>{level} - {semester} Results</h3>
          <button className="download-btn" onClick={downloadPDF}>
            📄 Download Result (PDF)
          </button>
        </div>

        {loading ? (
          <div className="loading">Loading results...</div>
        ) : (
          <>
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
                {results.length > 0 ? (
                  results.map((r, i) => (
                    <tr key={i}>
                      <td>{r.code || "-"}</td>
                      <td>{r.name || "-"}</td>
                      <td>{r.grade || "-"}</td>
                      <td>{r.gpa || "-"}</td>
                      <td>{r.credits || "-"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="no-data">No results available</td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="summary">
              <div>Total Courses: {results.length}</div>
              <div>{level} - {semester} GPA: {semesterGPA}</div>
              <div>Total Credits: {totalCredits}</div>
              <div className="total-gpa">Total GPA: {semesterGPA}</div>
              <div className="cgpa">CGPA: 3.45</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default StudentDashboard;
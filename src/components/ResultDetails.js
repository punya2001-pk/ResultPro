import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../CSS/ResultDetails.css";
import jsPDF from "jspdf";
import "jspdf-autotable";

function ResultDetails() {
  const location = useLocation();
  const navigate = useNavigate();

  const { faculty, department, level, courseId } = location.state || {};

  const [results] = useState([
    { indexNo: "IT17201", result: "A+" },
    { indexNo: "IT17202", result: "A" },
    { indexNo: "IT17203", result: "B+" },
  ]);

  useEffect(() => {
    if (!faculty || !department || !level || !courseId) {
      navigate("/admin");
    }
  }, [faculty, department, level, courseId, navigate]);

  // ===== Download PDF Handler =====
  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text(`Results for ${courseId}`, 14, 22);
    doc.setFontSize(12);
    doc.text(`${faculty} → ${department} → ${level}`, 14, 30);

    const tableColumn = ["#", "Index Number", "Result"];
    const tableRows = [];

    results.forEach((r, index) => {
      const row = [index + 1, r.indexNo, r.result];
      tableRows.push(row);
    });

    doc.autoTable({
      startY: 40,
      head: [tableColumn],
      body: tableRows,
      theme: "grid",
    });

    doc.save(`${courseId}_Results.pdf`);
  };

  return (
    <div className="result-details-page">
      <header className="result-header">
        <h2>📄 Results</h2>
        <p>
          {faculty} → {department} → {level} → {courseId}
        </p>
      </header>

      <table className="result-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Index Number</th>
            <th>Result</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r, idx) => (
            <tr key={r.indexNo}>
              <td>{idx + 1}</td>
              <td>{r.indexNo}</td>
              <td>{r.result}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="bottom-buttons">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <button
          className="download-btn"
          onClick={downloadPDF}
          style={{
            marginLeft: "10px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            padding: "10px 18px",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          📥 Download PDF
        </button>
      </div>
    </div>
  );
}

export default ResultDetails;

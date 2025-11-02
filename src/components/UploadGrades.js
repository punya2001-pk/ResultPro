import React, { useState } from "react";
import "../CSS/uploadGrades.css";

function UploadGrades({ onBack }) {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file) return alert("Please select an Excel or CSV file!");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:5000/api/upload-grades", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setMessage(data.message || "✅ File uploaded successfully!");
    } catch (err) {
      console.error(err);
      setMessage("❌ Error uploading file!");
    }
  };

  return (
    <div className="upload-container">
      <h2>📘 Upload Subject Results</h2>
      <p>Upload an Excel or CSV file with student index numbers and grades.</p>

      <div className="upload-box">
        <input type="file" accept=".xlsx,.csv" onChange={handleFileChange} />
        <button className="upload-btn" onClick={handleUpload}>
          Upload File
        </button>
      </div>

      {message && <p className="status">{message}</p>}

      <button className="back-btn" onClick={onBack}>
        ⬅ Back to Dashboard
      </button>
    </div>
  );
}

export default UploadGrades;

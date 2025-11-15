import React, { useState } from "react";
import axios from "axios";
import "../CSS/uploadGrades.css";

function UploadGrades() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage("");
  };

  const handleUpload = async () => {
    if (!file) return setMessage("⚠️ Please select a file first!");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("http://localhost:5000/api/upload-grades", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage(`✅ ${res.data.message} (${res.data.count} records saved)`);
    } catch (error) {
      console.error("❌ Upload Error:", error);
      setMessage("❌ Error uploading file!");
    }
  };

  return (
    <div className="upload-container">
      <div className="upload-card">
        <h2>📘 Upload Student Results</h2>
        <p>Upload a CSV file with student index, subject, and grade.</p>

        <input type="file" accept=".csv" onChange={handleFileChange} />
        <button onClick={handleUpload}>📤 Upload File</button>

        {message && (
          <p className={`message ${message.includes("Error") ? "error" : "success"}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default UploadGrades;

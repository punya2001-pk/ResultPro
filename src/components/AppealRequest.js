import React, { useState } from "react";
import "../CSS/AppealRequest.css";

function AppealRequest({ onBack }) {
  const [registrationNo, setRegistrationNo] = useState("");
  const [studentName, setStudentName] = useState("");
  const [indexNo, setIndexNo] = useState("");
  const [subjectCode, setSubjectCode] = useState("");
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!registrationNo || !studentName || !indexNo || !subjectCode || !reason) {
      return alert("Please fill all fields!");
    }

    // Submit appeal logic (API call can be added here)
    setMessage("✅ Appeal submitted successfully!");

    // Reset form
    setRegistrationNo("");
    setStudentName("");
    setIndexNo("");
    setSubjectCode("");
    setReason("");
  };

  return (
    <div className="appeal-container">
      <h2>📝 Request Result Appeal</h2>
      <form className="appeal-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Student Registration Number"
          value={registrationNo}
          onChange={(e) => setRegistrationNo(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Student Name"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Index Number"
          value={indexNo}
          onChange={(e) => setIndexNo(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Subject Code"
          value={subjectCode}
          onChange={(e) => setSubjectCode(e.target.value)}
          required
        />
        <textarea
          placeholder="Reason for appeal..."
          rows="4"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
        ></textarea>
        <button type="submit" className="submit-btn">
          Submit Appeal
        </button>
      </form>

      {message && <p className="status">{message}</p>}

      <button className="back-btn" onClick={onBack}>
        ⬅ Back to Dashboard
      </button>
    </div>
  );
}

export default AppealRequest;

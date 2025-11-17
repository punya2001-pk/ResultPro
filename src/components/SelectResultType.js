import React from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/SelectResultType.css";

const SelectResultType = () => {
  const navigate = useNavigate();

  const handleSelect = (type) => {
    navigate(`/upload-grades/${type}`); // redirect to upload page with type param
  };

  return (
    <div className="select-container">
      <div className="select-card">
        <h2>📘 Choose Result Type</h2>
        <p>Select which results you want to upload.</p>
        <div className="button-group">
          <button className="ica-btn" onClick={() => handleSelect("ICA")}>
            🧮 ICA Results
          </button>
          <button className="exam-btn" onClick={() => handleSelect("Exams")}>
            🧾 Final Exam Results
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectResultType;

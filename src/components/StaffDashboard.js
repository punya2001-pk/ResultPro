import React, { useState } from "react";
import "../CSS/StaffDashboard.css";
import UploadGrades from "./UploadGrades";
import ViewResults from "./ViewResults";

function StaffDashboard({ username, handleLogout }) {
  const [page, setPage] = useState("home");
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  // Navigation
  const goHome = () => setPage("home");
  const openUploadPage = () => setPage("upload");
  const openViewPage = () => setPage("view");

  // Trigger refresh after new grades uploaded
  const handleGradesUpdated = () => {
    setRefreshTrigger((prev) => !prev);
    setPage("view"); // After upload, go directly to View page
  };

  // ----------- Upload Page -----------
  if (page === "upload") {
    return (
      <div className="staff-dashboard-full">
        <div className="top-bar">
          <button className="back-btn" onClick={goHome}>⬅️ Back</button>
          <h2>📤 Upload Results</h2>
        </div>

        {/* Pass callback to trigger View refresh */}
        <UploadGrades onGradesUpdated={handleGradesUpdated} />
      </div>
    );
  }

  // ----------- View Page -----------
  if (page === "view") {
    return (
      <div className="staff-dashboard-full">
        <div className="top-bar">
          <button className="back-btn" onClick={goHome}>⬅️ Back</button>
          <h2>📋 Uploaded Results</h2>
        </div>

        <ViewResults refreshTrigger={refreshTrigger} />
      </div>
    );
  }

  // ----------- Home Page -----------
  return (
    <div className="staff-dashboard">
      <h2>👩‍🏫 Staff Dashboard</h2>
      <p>Welcome, <strong>{username}</strong>!</p>

      <div className="staff-buttons">
        <button className="upload-btn" onClick={openUploadPage}>
          📤 Upload Results
        </button>

        <button className="view-btn" onClick={openViewPage}>
          📋 View Uploaded Results
        </button>

        <button className="logout-btn" onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>
    </div>
  );
}

export default StaffDashboard;

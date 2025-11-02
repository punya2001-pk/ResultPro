import React, { useState } from "react";
import "../CSS/StaffDashboard.css";
import UploadGrades from "./UploadGrades";
import ViewResults from "./ViewResults"; // optional, if you have it

function StaffDashboard({ username, handleLogout }) {
  // page: "home" | "upload" | "view"
  const [page, setPage] = useState("home");

  // show upload page inside this component
  const openUploadPage = () => setPage("upload");
  const openViewPage = () => setPage("view");
  const goHome = () => setPage("home");

  // Render the dashboard header + nav only on "home"
  if (page === "upload") {
    // show UploadGrades full-screen inside this component
    return (
      <div className="staff-dashboard-full">
        <UploadGrades onBack={goHome} />
      </div>
    );
  }

  if (page === "view") {
    return (
      <div className="staff-dashboard-full">
        <ViewResults onBack={goHome} />
      </div>
    );
  }

  // default home dashboard
  return (
    <div className="staff-dashboard">
      <h2>👩‍🏫 Staff Dashboard</h2>
      <p>Welcome, {username}!</p>

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

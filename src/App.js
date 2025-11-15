// ===== App.js =====
import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

// ===== COMPONENT IMPORTS =====
import FrontPage from "./components/frontpage";
import Login from "./components/login";
import StudentDashboard from "./components/StudentDashboard";
import AdminDashboard from "./components/AdminDashboard";
import StaffDashboard from "./components/StaffDashboard";
import StudentDetails from "./components/StudentDetails";
import CourseDetails from './components/CourseDetails';

import "./index.css";

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

function App() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  // ===== LOGIN FUNCTION =====
  const handleLogin = (username, password) => {
    const uname = username.toLowerCase();

    // ROLE BASED LOGIN (NO PASSWORD VALIDATION)
    if (uname.startsWith("admin")) {
      const user = { username, role: "admin" };
      setCurrentUser(user);
      navigate("/admin");
      return;
    }

    if (uname.startsWith("student")) {
      const user = { username, role: "student" };
      setCurrentUser(user);
      navigate("/student");
      return;
    }

    if (uname.startsWith("staff")) {
      const user = { username, role: "staff" };
      setCurrentUser(user);
      navigate("/staff");
      return;
    }

    alert("Invalid username. Must start with admin / student / staff");
  };

  // ===== LOGOUT FUNCTION =====
  const handleLogout = () => {
    setCurrentUser(null);
    navigate("/login");
  };

  // ===== ROUTES =====
  return (
    <Routes>
      {/* FRONT PAGE */}
      <Route path="/" element={<FrontPage />} />

      {/* LOGIN PAGE */}
      <Route
        path="/login"
        element={<Login handleLogin={handleLogin} />}
      />

      {/* ===== DASHBOARDS ===== */}
      <Route
        path="/student"
        element={
          currentUser && currentUser.role === "student" ? (
            <StudentDashboard
              username={currentUser.username}
              handleLogout={handleLogout}
            />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/staff"
        element={
          currentUser && currentUser.role === "staff" ? (
            <StaffDashboard
              username={currentUser.username}
              handleLogout={handleLogout}
            />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/admin"
        element={
          currentUser && currentUser.role === "admin" ? (
            <AdminDashboard
              username={currentUser.username}
              handleLogout={handleLogout}
            />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* STUDENT DETAILS PAGE */}
      <Route path="/studentDetails" element={<StudentDetails />} />

      {/* ===== CATCH-ALL ===== */}
      <Route path="*" element={<Navigate to="/" replace />} />

      <Route path="/courseDetails" element={<CourseDetails/>}></Route>
    </Routes>
  );
}

export default AppWrapper;

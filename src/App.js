// ===== App.js =====
import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

import FrontPage from "./components/frontpage";
import Login from "./components/login";
import SignupPage from "./components/SignupPage";
import StudentSignup from "./components/StudentSignup";
import StaffSignup from "./components/StaffSignup";
import StudentDashboard from "./components/StudentDashboard";
import AdminDashboard from "./components/AdminDashboard";
import StaffDashboard from "./components/StaffDashboard";
import StudentDetails from "./components/StudentDetails";
import CourseDetails from "./components/CourseDetails";
import ResultDetails from "./components/ResultDetails";

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

  // ===== LOGIN =====
  const handleLogin = async (username, password) => {
    try {
      // If default admin credentials
      if (username === "admin" && password === "admin123") {
        setCurrentUser({
          username: "admin",
          name: "System Administrator",
          role: "admin",
        });
        navigate("/admin");
        return;
      }

      // Otherwise check server
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (data.success) {
        setCurrentUser({
          username: data.user.username,
          name: data.user.name,
          role: data.role,
        });

        if (data.role === "student") navigate("/student");
        else if (data.role === "staff") navigate("/staff");
        else if (data.role === "admin") navigate("/admin");
      } else {
        alert(data.message || "Invalid username or password");
      }
    } catch (err) {
      alert("Server error: " + err.message);
    }
  };

  // ===== SIGNUP =====
  const handleSignup = async (formData, role = "student") => {
    try {
      const endpoint =
        role === "staff"
          ? "http://localhost:5000/api/staff"
          : "http://localhost:5000/api/students";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success) {
        alert("✅ Signup successful! Please login.");
        navigate("/login");
      } else {
        alert(data.message || "Signup failed.");
      }
    } catch (err) {
      alert("Server error: " + err.message);
    }
  };

  // ===== LOGOUT =====
  const handleLogout = () => {
    setCurrentUser(null);
    navigate("/login");
  };

  return (
    <Routes>
      <Route path="/" element={<FrontPage />} />
      <Route
        path="/login"
        element={
          <Login
            handleLogin={handleLogin}
            username={currentUser?.username || ""}
          />
        }
      />
      <Route path="/signup" element={<SignupPage />} />
      <Route
        path="/signup/student"
        element={<StudentSignup handleSignup={handleSignup} />}
      />
      <Route
        path="/signup/staff"
        element={<StaffSignup handleSignup={handleSignup} />}
      />

      <Route
        path="/student"
        element={
          currentUser && currentUser.role === "student" ? (
            <StudentDashboard
              username={currentUser.username}
              handleLogout={handleLogout}
            />
          ) : (
            <Navigate to="/login" />
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
            <Navigate to="/login" />
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
            <Navigate to="/login" />
          )
        }
      />

      <Route path="/studentDetails" element={<StudentDetails />} />
      <Route path="/courseDetails" element={<CourseDetails />} />
      <Route path="/resultDetails" element={<ResultDetails />} />
    </Routes>
  );
}

export default AppWrapper;

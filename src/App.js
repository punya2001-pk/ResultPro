import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

import FrontPage from "./components/frontpage";
import Login from "./components/login";
import StudentDashboard from "./components/StudentDashboard";
import AdminDashboard from "./components/AdminDashboard";
import StaffDashboard from "./components/StaffDashboard";
import EditGrades from "./components/EditGrades";
import StudentDetails from "./components/StudentDetails";
import CourseDetails from "./components/CourseDetails";
import ResultDetails from "./components/ResultDetails";
import ForgotPassword from "./components/ForgotPassword";
import AdminVerifyResults from './components/AdminVerifyResults';

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
//restore 
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

//login
  const handleLogin = async (username, password) => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const res = await response.json();

      if (res.success) {
        const user = { ...res.user, role: res.role };
        setCurrentUser(user);
        localStorage.setItem("user", JSON.stringify(user));

//redirect
        if (res.role === "student") navigate("/student-dashboard");
        else if (res.role === "staff") navigate("/staff-dashboard");
        else if (res.role === "admin") navigate("/admin-dashboard");

        return res;
      } else {
        alert(res.message || "Invalid username or password");
        return res;
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Server error");
      throw err;
    }
  };

//logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    setCurrentUser(null);
    navigate("/login");
  };

  return (
    <Routes>
      <Route path="/" element={<FrontPage />} />
      <Route path="/login" element={<Login handleLogin={handleLogin} />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />      
     <Route
        path="/student-dashboard"
        element={
          currentUser?.role === "student" ? (
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
        path="/staff-dashboard"
        element={
          currentUser?.role === "staff" ? (
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
        path="/admin-dashboard"
        element={
          currentUser?.role === "admin" ? (
            <AdminDashboard
              username={currentUser.username}
              handleLogout={handleLogout}
            />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/resultDetails"
        element={
          currentUser?.role === "admin" ? (
            <ResultDetails />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route path="/studentDetails" element={<StudentDetails />} />
      <Route path="/courseDetails" element={<CourseDetails />} />

      <Route
        path="/edit-grades"
        element={
          currentUser?.role === "staff" ? (
            <EditGrades />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route path="/admin-verify" element={<AdminVerifyResults />} />
    </Routes>
  );
}

export default AppWrapper;

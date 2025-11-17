import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useParams,
} from "react-router-dom";

// ===== COMPONENT IMPORTS =====
import FrontPage from "./components/frontpage";
import Login from "./components/login";
import Signup from "./components/Signup";
import StudentDashboard from "./components/StudentDashboard";
import AdminDashboard from "./components/AdminDashboard";
import StaffDashboard from "./components/StaffDashboard";
import StudentDetails from "./components/StudentDetails";
import CourseDetails from "./components/CourseDetails";
import ResultDetails from "./components/ResultDetails";
import SelectResultType from "./components/SelectResultType";
import UploadGrades from "./components/UploadGrades";

import "./index.css";

// ===== WRAPPER (Router + useNavigate Support) =====
function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

function App() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const [users, setUsers] = useState([
    { username: "student1", password: "12345", role: "student" },
    { username: "admin1", password: "admin123", role: "admin" },
    { username: "staff1", password: "staff123", role: "staff" },
  ]);

  // ===== LOGIN HANDLER =====
  const handleLogin = (username, password) => {
    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      setUsername(user.username);
      setRole(user.role);
      setPassword("");

      if (user.role === "student") navigate("/student");
      else if (user.role === "admin") navigate("/admin");
      else if (user.role === "staff") navigate("/staff/select-result-type");
      return user;
    } else {
      alert("❌ Invalid username or password!");
      return null;
    }
  };

  // ===== SIGNUP =====
  const handleSignup = (username, password) => {
    const exists = users.some((u) => u.username === username);
    if (exists) return { success: false, message: "Username already exists!" };

    const newUser = { username, password, role: "student" };
    setUsers([...users, newUser]);
    return { success: true, user: newUser };
  };

  // ===== LOGOUT =====
  const handleLogout = () => {
    setUsername("");
    setPassword("");
    setRole("");
    navigate("/login");
  };

  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<FrontPage />} />
      <Route
        path="/login"
        element={
          <Login
            username={username}
            password={password}
            setUsername={setUsername}
            setPassword={setPassword}
            handleLogin={handleLogin}
          />
        }
      />
      <Route path="/signup" element={<Signup handleSignup={handleSignup} />} />

      {/* Student Dashboard */}
      <Route
        path="/student"
        element={
          username && role === "student" ? (
            <StudentDashboard username={username} handleLogout={handleLogout} />
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      {/* Admin */}
      <Route
        path="/admin"
        element={
          username && role === "admin" ? (
            <AdminDashboard username={username} handleLogout={handleLogout} />
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      {/* Staff */}
      <Route
        path="/staff"
        element={
          username && role === "staff" ? (
            <StaffDashboard username={username} handleLogout={handleLogout} />
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      {/* Select Result Type */}
      <Route
        path="/staff/select-result-type"
        element={
          username && role === "staff" ? (
            <SelectResultType />
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      {/* Upload Grades (Auto Reload Enabled) */}
      <Route
        path="/staff/upload-grades/:type"
        element={
          username && role === "staff" ? (
            <UploadGradesWrapper />
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      {/* Extra Pages */}
      <Route path="/studentDetails" element={<StudentDetails />} />
      <Route path="/courseDetails" element={<CourseDetails />} />
      <Route path="/resultDetails" element={<ResultDetails />} />

      {/* Default Redirect */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

// ===== WRAPPER TO FORCE PAGE RELOAD =====
function UploadGradesWrapper() {
  const { type } = useParams();
  const reloadKey = Date.now(); // <-- Forces page reload

  return <UploadGrades key={reloadKey} initialType={type} />;
}

export default AppWrapper;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/Login.css";
import axios from "axios"; 

function Login({ handleLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("savedUsername");
    if (saved) setUsername(saved);
  }, []);

  const handleForgotPassword = () => {
    navigate("/forgot-password"); 
  };

  const handleLoginClick = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      alert("Please enter both username and password.");
      return;
    }

    setLoading(true);
    try {
      let res;
      if (handleLogin) {
        res = await handleLogin(username, password);
      } else {
        const response = await axios.post("http://localhost:5000/api/auth/login", {
          username,
          password,
        });
        res = response.data;
      }

      if (res.success) {
        localStorage.setItem("user", JSON.stringify(res.user)); 

        if (rememberMe) localStorage.setItem("savedUsername", username);
        else localStorage.removeItem("savedUsername");

        if (!handleLogin) {
          switch (res.role) {
            case "student":
              navigate("/student-dashboard");
              break;
            case "staff":
              navigate("/staff-dashboard");
              break;
            case "admin":
              navigate("/admin-dashboard");
              break;
            default:
              navigate("/");
          }
        }
      } else {
        alert(res.message || "Invalid username or password");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Server error: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <nav className="navbar">
        <h1>🎓 University Result Management System</h1>
      </nav>

      <div className="login-container">
        <h2>User Login</h2>
        <form onSubmit={handleLoginClick}>
          <div className="form-row">
            <label>Username</label>
            <input
              type="text"
              placeholder="Username "
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-row">
            <label>Password</label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="remember-forgot">
            <label>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />{" "}
              Remember Me
            </label>
            <button type="button" onClick={handleForgotPassword}>
              Forgot Password?
            </button>
          </div>
          <div className="button-group">
            <button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
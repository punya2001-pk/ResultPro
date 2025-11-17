import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/Login.css";

function Login({ handleLogin, username, password, setUsername, setPassword }) {
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("savedUsername");
    if (saved) setUsername(saved);
  }, [setUsername]);

  const handleForgotPassword = () => {
    alert("🔑 Password reset feature coming soon!");
  };

  const handleLoginClick = (e) => {
    e.preventDefault();
    const result = handleLogin(username, password);

    if (result?.role === "student") navigate("/student");
    else if (result?.role === "admin") navigate("/admin");
    else if (result?.role === "staff") navigate("/staff");
    else alert("Invalid username or password!");

    if (rememberMe) localStorage.setItem("savedUsername", username);
    else localStorage.removeItem("savedUsername");
  };

  return (
    <div className="login-page">
      <nav className="navbar">
        <div className="logo">🎓</div>
        <h1>University Result Management System</h1>
      </nav>

      <div className="login-container">
        <h2>Login Page</h2>
        <form onSubmit={handleLoginClick}>
          <div className="form-row">
            <label>Username</label>
            <br />
            <input
              type="text"
              placeholder="Enter Your Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <label>Password</label>
            <br />
            <input
              type="password"
              placeholder="Enter Your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="remember-forgot">
            <label className="remember-me">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember Me
            </label>

            <button type="button" className="forgot-btn" onClick={handleForgotPassword}>
              Forgot Password?
            </button>
          </div>

          <div className="button-group">
            <button type="submit">Login</button>
          </div>
        </form>

        <div className="signup-redirect">
          <p>
            Don't have an account?{" "}
            <button className="signup-btn" onClick={() => navigate("/signup")}>
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;

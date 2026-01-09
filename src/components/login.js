import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/Login.css";

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
    alert("🔑 Password reset feature coming soon!");
  };

  const handleLoginClick = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      alert("Please enter username and password.");
      return;
    }

    setLoading(true);
    try {
      await handleLogin(username, password);

      if (rememberMe) localStorage.setItem("savedUsername", username);
      else localStorage.removeItem("savedUsername");
    } catch (err) {
      alert("Server error: " + err.message);
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
              placeholder="Enter Your Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter Your Password"
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

            <button type="button" onClick={() => navigate("/forgot-password")}>
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

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/Login.css";

function Signup({ handleSignup }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSignupClick = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    const result = handleSignup(username, password); // Your signup logic
    if (result?.success) {
      alert("Account created successfully!");
      navigate("/login");
    } else {
      alert("Signup failed. Try again!");
    }
  };

  return (
    <div className="login-page">
      <nav className="navbar">
        <div className="logo">🎓</div>
        <h1>University Result Management System</h1>
      </nav>

      <div className="login-container">
        <h2>Sign Up</h2>
        <form onSubmit={handleSignupClick}>
          <div className="form-row">
            <label>Username</label>
            <br />
            <input
              type="text"
              placeholder="Enter Username"
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
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <label>Confirm Password</label>
            <br />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <div className="button-group">
            <button type="submit">Sign Up</button>
          </div>
        </form>

        <div className="signup-redirect">
          <p>
            Already have an account?{" "}
            <button className="signup-btn" onClick={() => navigate("/login")}>
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/Signup.css";

function StaffSignup({ handleSignup }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = handleSignup(username, password, "staff");
    if (result.success) {
      alert("✅ Staff signup successful!");
      navigate("/login");
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="signup-form">
      <h2>Staff Signup</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter Staff Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign Up</button>
        <button type="button" onClick={() => navigate("/signup")}>
          Back
        </button>
      </form>
    </div>
  );
}

export default StaffSignup;

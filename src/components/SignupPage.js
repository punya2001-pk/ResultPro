import React from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/Signup.css";

function SignupPage() {
  const navigate = useNavigate();

  return (
    <div className="signup-select-page">
      <nav className="navbar">
        <h1>🎓 University Result Management System</h1>
      </nav>

      <div className="signup-selection">
        <h2>Choose Your Registration Type</h2>
        <p>Please select your role to continue registration.</p>

        <div className="signup-type-buttons">
          <button onClick={() => navigate("/signup/student")}>Student Signup</button><br/><br/>
          <button onClick={() => navigate("/signup/staff")}>Staff Signup</button>
        </div>

        <p className="back-login">
          Already have an account?{" "}
          <button onClick={() => navigate("/login")}>Back to Login</button>
        </p>
      </div>
    </div>
  );
}

export default SignupPage;

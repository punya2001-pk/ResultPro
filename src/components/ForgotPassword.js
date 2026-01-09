import React, { useState } from "react";
import axios from "axios";
import "../CSS/ForgotPassword.css";

function ForgotPassword() {
  const [form, setForm] = useState({
    regNo: "",
    role: "",
    faculty: "",
    department: "",
    email: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();

    if (form.newPassword !== form.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/send-otp", {
  regNo: form.regNo,
  role: form.role,
  faculty: form.faculty,
  department: form.department,
  email: form.email,
      });

      alert("OTP sent to university email!");
      setOtpSent(true);
    } catch (err) {
        alert("Error sending OTP: " + (err.response?.data?.message || err.message));
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/verify-otp", {
        email: form.email,
        otp,
        newPassword: form.newPassword,
      });

      alert("Password changed successfully!");
    } catch (err) {
      alert("OTP verification failed: " + err.message);
    }
  };

  return (
    <div className="forgot-container">
      <h2>Reset Password</h2>

      {!otpSent ? (
        <form onSubmit={handleSendOtp} className="forgot-form">
          <input
            type="text"
            name="regNo"
            placeholder="Registration Number"
            value={form.regNo}
            onChange={handleChange}
            required
          />

          <select name="role" value={form.role} onChange={handleChange} required>
            <option value="">Select Role</option>
            <option value="student">Student</option>
            <option value="admin">Admin</option>
            <option value="staff">Staff</option>
          </select>

          <input
            type="text"
            name="faculty"
            placeholder="Faculty"
            value={form.faculty}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="department"
            placeholder="Department"
            value={form.department}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="University Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="newPassword"
            placeholder="New Password"
            value={form.newPassword}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />

          <button type="submit">Send OTP</button>
        </form>
      ) : (
        <div className="otp-section">
          <h3>Enter OTP</h3>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />

          <button onClick={handleVerifyOtp}>Verify & Change Password</button>
        </div>
      )}
    </div>
  );
}

export default ForgotPassword;

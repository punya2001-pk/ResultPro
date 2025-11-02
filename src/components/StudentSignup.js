import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/Signup.css";

function StudentSignup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    regNumber: "",
    indexNumber: "",
    nic: "",
    enrollmentDate: "",
    username: "",
    password: "",
    confirmPassword: "",
    otp: "",
    faculty: "",
    department: "",
    email: "",
  });

  const [generatedOTP, setGeneratedOTP] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpExpiry, setOtpExpiry] = useState(null);
  const [otpExpired, setOtpExpired] = useState(false);
  const [regError, setRegError] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    let value = e.target.value;

    // Only convert certain text inputs to uppercase
    if (
      e.target.type === "text" &&
      !["faculty", "department", "email"].includes(e.target.name)
    ) {
      value = value.toUpperCase();
    }

    setFormData((prev) => {
      let updated = { ...prev, [e.target.name]: value };

      // Reset department if faculty changes
      if (e.target.name === "faculty") updated.department = "";

      // Auto-fill email if regNumber changes and email is empty
      if (e.target.name === "regNumber" && !prev.email) {
        updated.email = `${value}@vau.ac.gmail.com`;
      }

      return updated;
    });

    // Registration number validation
    if (e.target.name === "regNumber") {
      const regRegex = /^\d{4}\/[A-Z]{2,5}\/\d{1,3}$/;
      setRegError(!regRegex.test(value) ? "Format: YYYY/DEGREE/NNN" : "");
    }
  };

  // Send OTP function
  const sendOTP = () => {
    const emailToSend = formData.email || `${formData.regNumber}@vau.ac.gmail.com`;

    if (!formData.regNumber || regError) {
      alert("❌ Enter valid registration number!");
      return;
    }

    if (!emailToSend) {
      alert("❌ Please enter your email!");
      return;
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOTP(otp);
    setOtpSent(true);
    setOtpExpiry(Date.now() + 5 * 60 * 1000);
    setOtpExpired(false);

    alert(`📩 OTP sent to: ${emailToSend}\n(For demo: OTP is ${otp})`);
  };

  // OTP expiry check
  useEffect(() => {
    if (!otpExpiry) return;
    const interval = setInterval(() => {
      if (Date.now() > otpExpiry) setOtpExpired(true);
    }, 1000);
    return () => clearInterval(interval);
  }, [otpExpiry]);

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword)
      return alert("Passwords do not match!");
    if (!otpSent) return alert("Get OTP first!");
    if (otpExpired) return alert("OTP expired!");
    if (formData.otp !== generatedOTP) return alert("Invalid OTP!");

    try {
      const res = await fetch("http://localhost:5000/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        alert("✅ Student registered successfully!");
        navigate("/login");
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Server error: " + err.message);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2 className="signup-title">🎓 Student Registration Form</h2>
        <form onSubmit={handleSubmit}>
          {/* Personal Details */}
          <div className="form-section">
            <h3>👤 Personal Details</h3>

            <div className="form-row">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <label>Registration Number</label>
              <input
                type="text"
                name="regNumber"
                value={formData.regNumber}
                onChange={handleChange}
                required
              />
              {regError && <small className="reg-error">{regError}</small>}
            </div>

            <div className="form-row">
              <label>Faculty</label>
              <select
                name="faculty"
                value={formData.faculty}
                onChange={handleChange}
                required
              >
                <option value="">Select Faculty</option>
                <option value="Applied">Applied</option>
                <option value="Business Studies">Business Studies</option>
                <option value="Technological Studies">Technological Studies</option>
              </select>
            </div>

            <div className="form-row">
              <label>Department</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
              >
                <option value="">Select Department</option>
                {formData.faculty === "Applied" && (
                  <>
                    <option value="Physical">Physical</option>
                    <option value="Bio Science">Bio Science</option>
                  </>
                )}
                {formData.faculty === "Business Studies" && (
                  <>
                    <option value="Management">Management</option>
                    <option value="Accounting">Accounting</option>
                  </>
                )}
                {formData.faculty === "Technological Studies" && (
                  <>
                    <option value="ICT">ICT</option>
                    <option value="Engineering">Engineering</option>
                  </>
                )}
              </select>
            </div>

            <div className="form-row">
              <label>Index Number</label>
              <input
                type="text"
                name="indexNumber"
                value={formData.indexNumber}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <label>NIC Number</label>
              <input
                type="text"
                name="nic"
                value={formData.nic}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <label>Enrollment Date</label>
              <input
                type="date"
                name="enrollmentDate"
                value={formData.enrollmentDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Account Details */}
          <div className="form-section">
            <h3>🔐 Account Details</h3>
            <div className="form-row">
              <label>Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-row">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-row">
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* OTP Section */}
          <div className="form-section">
            <h3>📩 OTP Verification</h3>
            {!otpSent ? (
              <button type="button" className="otp-btn" onClick={sendOTP}>
                Get OTP
              </button>
            ) : (
              <div className="otp-inline">
                <input
                  type="text"
                  name="otp"
                  value={formData.otp}
                  onChange={handleChange}
                  required
                />
                <button type="submit" className="register-btn">
                  Register
                </button>
              </div>
            )}
            {otpExpired && <p className="otp-expired-text">⚠️ OTP expired!</p>}
          </div>

          <button
            type="button"
            className="back-btn"
            onClick={() => navigate("/signup")}
          >
            ⬅ Back
          </button>
        </form>
      </div>
    </div>
  );
}

export default StudentSignup;

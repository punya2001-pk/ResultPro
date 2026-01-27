import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Papa from "papaparse";
import "../CSS/StudentDetails.css";

function StudentDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const { faculty, department, level } = location.state || {};

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newStudent, setNewStudent] = useState({
    name: "",
    regNumber: "",
    indexNumber: "",
    address: "",
    birthdate: "",
    gender: "",
    mobile: "",
    email: "",
  });

  useEffect(() => {
    if (!faculty || !department || !level) return;

    const fetchStudents = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5000/api/students", {
          params: { faculty, department, level },
        });
        setStudents(res.data.students || []);
        console.log("Fetched students:", res.data);

      } catch (err) {
        console.error(err);
        alert("❌ Failed to fetch students.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [faculty, department, level]);

  const handleAddStudent = async () => {
    const { name, regNumber, indexNumber } = newStudent;
    if (!name || !regNumber || !indexNumber) {
      alert("⚠️ Name, RegNumber, and IndexNumber are required.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/students/register", {
        ...newStudent,
        faculty,
        department,
        level,
      });

      if (res.data.success) {
        setStudents((prev) => [...prev, res.data.student]);
        setNewStudent({
          name: "",
          regNumber: "",
          indexNumber: "",
          address: "",
          birthdate: "",
          gender: "",
          mobile: "",
          email: "",
        });
        alert("✅ Student added successfully!");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Failed to add student. Check for duplicate Reg/Index numbers.");
    }
  };

  const handleCSVUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          let csvStudents = results.data.map((row, index) => {
            if (!row.name || !row.regNumber || !row.indexNumber) {
              throw new Error(
                `Row ${index + 2} is missing required fields (name, regNumber, indexNumber)`
              );
            }
            return {
              name: row.name.trim(),
              regNumber: row.regNumber.trim(),
              indexNumber: row.indexNumber.trim(),
              address: row.address?.trim() || "",
              birthdate: row.birthdate || "",
              gender: row.gender || "",
              mobile: row.mobile || "",
              email: row.email || "",
              faculty,
              department,
              level,
            };
          });

          csvStudents = csvStudents.filter(
            (v, i, a) =>
              a.findIndex(
                (t) => t.regNumber === v.regNumber || t.indexNumber === v.indexNumber
              ) === i
          );

          if (csvStudents.length === 0) {
            alert("❌ No valid students to upload.");
            return;
          }

          const res = await axios.post("http://localhost:5000/api/students/bulk", {
            students: csvStudents,
          });
          alert("✅ CSV uploaded successfully!");
          
          if (res.data.success) {
            const updated = await axios.get("http://localhost:5000/api/students", {
              params: { faculty, department, level },
            });
            setStudents(updated.data.students || []);
            alert("✅ CSV uploaded successfully!");
          } else {
            alert("❌ CSV upload failed. Check server logs or duplicates.");
          }
        } catch (err) {
          console.error("CSV upload error:", err);
          alert("❌ CSV upload failed: " + err.message);
        }
      },
      error: (err) => {
        console.error("CSV parse error:", err);
        alert("❌ Error parsing CSV file.");
      },
    });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString();
  };

  return (
    <div className="student-details-page">

      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <h2>Students - {faculty} → {department} → {level}</h2>

      <div className="add-course-form">
        <h3>📤 Upload Students CSV</h3>
        <input type="file" accept=".csv" onChange={handleCSVUpload} />
      </div>

      <div className="add-course-form">
        <h3>➕ Add New Student</h3>
        <div className="form-grid">
          <input type="text" placeholder="Name" value={newStudent.name} onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })} />
          <input type="text" placeholder="Registration Number" value={newStudent.regNumber} onChange={(e) => setNewStudent({ ...newStudent, regNumber: e.target.value })} />
          <input type="text" placeholder="Index Number" value={newStudent.indexNumber} onChange={(e) => setNewStudent({ ...newStudent, indexNumber: e.target.value })} />
          <input type="text" placeholder="Address" value={newStudent.address} onChange={(e) => setNewStudent({ ...newStudent, address: e.target.value })} />
          <input type="date" placeholder="Birthdate" value={newStudent.birthdate} onChange={(e) => setNewStudent({ ...newStudent, birthdate: e.target.value })} />
          <select value={newStudent.gender} onChange={(e) => setNewStudent({ ...newStudent, gender: e.target.value })}>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <input type="text" placeholder="Mobile" value={newStudent.mobile} onChange={(e) => setNewStudent({ ...newStudent, mobile: e.target.value })} />
          <input type="email" placeholder="Email" value={newStudent.email} onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })} />
        </div>
        <button className="add-btn" onClick={handleAddStudent}>Add Student</button>
      </div>

      {loading ? (
        <p>Loading students...</p>
      ) : students.length === 0 ? (
        <p>No students found.</p>
      ) : (
        <table className="details-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Reg. Number</th>
              <th>Index Number</th>
              <th>Address</th>
              <th>Birthdate</th>
              <th>Gender</th>
              <th>Mobile</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s, i) => (
              <tr key={i}>
                <td>{s.name}</td>
                <td>{s.regNumber}</td>
                <td>{s.indexNumber}</td>
                <td>{s.address}</td>
                <td>{formatDate(s.birthdate)}</td>
                <td>{s.gender}</td>
                <td>{s.mobile}</td>
                <td>{s.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}


export default StudentDetails;

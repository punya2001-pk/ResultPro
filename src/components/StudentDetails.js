import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../CSS/StudentDetails.css";

function StudentDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const { faculty, department, level, isAdmin } = location.state || {}; // 👈 added isAdmin for role-based control

  const [students, setStudents] = useState([
    { id: 1, regNo: "2021/ICT/101", name: "Alice Perera", indexNo: "IT17201", email: "alice@vau.ac.lk" },
    { id: 2, regNo: "2021/ICT/102", name: "Bob Silva", indexNo: "IT17202", email: "bob@vau.ac.lk" },
    { id: 3, regNo: "2021/ICT/103", name: "Chathura Nimal", indexNo: "IT17203", email: "chathura@vau.ac.lk" },
  ]);

  const [editIndex, setEditIndex] = useState(null);
  const [editedStudent, setEditedStudent] = useState({});
  const [isAdding, setIsAdding] = useState(false);

  // ✏️ Edit handler
  const handleEdit = (index) => {
    setEditIndex(index);
    setEditedStudent(students[index]);
    setIsAdding(false);
  };

  // 💾 Save handler
  const handleSave = () => {
    const updated = [...students];
    if (isAdding) {
      updated.push({ ...editedStudent, id: students.length + 1 });
      alert("✅ New student added successfully!");
      setIsAdding(false);
    } else {
      updated[editIndex] = editedStudent;
      alert("✅ Student details updated successfully!");
      setEditIndex(null);
    }
    setStudents(updated);
  };

  // ➕ Add new student
  const handleAddStudent = () => {
    setEditedStudent({ regNo: "", name: "", indexNo: "", email: "" });
    setIsAdding(true);
    setEditIndex(null);
  };

 

  const handleChange = (e) => {
    setEditedStudent({ ...editedStudent, [e.target.name]: e.target.value });
  };

  return (
    <div className="student-details-page">
      <header className="details-header">
        <h2>🎓 Student Details</h2>
        <p>
          {faculty} → {department} → {level}
        </p>
      </header>

      <table className="details-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Registration No</th>
            <th>Name</th>
            <th>Index No</th>
            <th>Email</th>
            <th colSpan={isAdmin ? 2 : 1}>Actions</th> {/* 👈 Adjust column if admin */}
          </tr>
        </thead>

        <tbody>
          {students.map((student, index) => (
            <tr key={student.id}>
              <td>{index + 1}</td>
              <td>
                {editIndex === index ? (
                  <input type="text" name="regNo" value={editedStudent.regNo} onChange={handleChange} required />
                ) : (
                  student.regNo
                )}
              </td>
              <td>
                {editIndex === index ? (
                  <input type="text" name="name" value={editedStudent.name} onChange={handleChange} required />
                ) : (
                  student.name
                )}
              </td>
              <td>
                {editIndex === index ? (
                  <input type="text" name="indexNo" value={editedStudent.indexNo} onChange={handleChange} required />
                ) : (
                  student.indexNo
                )}
              </td>
              <td>
                {editIndex === index ? (
                  <input type="email" name="email" value={editedStudent.email} onChange={handleChange} required />
                ) : (
                  student.email
                )}
              </td>
              <td>
                {editIndex === index ? (
                  <button className="save-btn" onClick={handleSave}>
                    Save
                  </button>
                ) : (
                  <button className="edit-btn" onClick={() => handleEdit(index)}>
                    Edit
                  </button>
                )}
              </td>
            </tr>
          ))}

          {isAdding && (
            <tr className="new-row">
              <td>{students.length + 1}</td>
              <td>
                <input type="text" name="regNo" value={editedStudent.regNo} onChange={handleChange} required />
              </td>
              <td>
                <input type="text" name="name" value={editedStudent.name} onChange={handleChange} required />
              </td>
              <td>
                <input type="text" name="indexNo" value={editedStudent.indexNo} onChange={handleChange} required />
              </td>
              <td>
                <input type="email" name="email" value={editedStudent.email} onChange={handleChange} required />
              </td>
              <td colSpan={isAdmin ? 2 : 1}>
                <button className="save-btn" onClick={handleSave}>
                  Save
                </button>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* 🌟 Bottom Buttons */}
      <div className="bottom-buttons">
        <button className="add-btn" onClick={handleAddStudent}>
          ➕ Add New Student
        </button>
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
      </div>
    </div>
  );
}

export default StudentDetails;

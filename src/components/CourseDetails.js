import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../CSS/CourseDetails.css";

function CourseDetails() {
  const location = useLocation();
  const navigate = useNavigate();

  const { faculty, department, level } = location.state || {};

  const [courses, setCourses] = useState([
    { id: "CSE101", name: "Introduction to Programming", credits: 3 },
    { id: "CSE202", name: "Data Structures", credits: 4 },
  ]);

  const [newCourse, setNewCourse] = useState({ id: "", name: "", credits: "" });
  const [editIndex, setEditIndex] = useState(null);

  const handleAddCourse = () => {
    if (!newCourse.id || !newCourse.name || !newCourse.credits) {
      alert("Please fill in all fields!");
      return;
    }
    setCourses([...courses, newCourse]);
    setNewCourse({ id: "", name: "", credits: "" });
  };

  const handleSaveEdit = (index) => {
    setEditIndex(null);
  };

  const handleEditChange = (index, field, value) => {
    const updated = [...courses];
    updated[index][field] = value;
    setCourses(updated);
  };

  return (
    <div className="course-details-page">
      <div className="details-header">
        <h2>📚 Course Details</h2>
        <p>
          {faculty && `${faculty} → ${department} → ${level}`}
        </p>
      </div>

      <table className="details-table">
        <thead>
          <tr>
            <th>Course ID</th>
            <th>Course Name</th>
            <th>Credits</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course, index) => (
            <tr key={index}>
              <td>
                {editIndex === index ? (
                  <input
                    value={course.id}
                    onChange={(e) =>
                      handleEditChange(index, "id", e.target.value)
                    }
                  />
                ) : (
                  course.id
                )}
              </td>
              <td>
                {editIndex === index ? (
                  <input
                    value={course.name}
                    onChange={(e) =>
                      handleEditChange(index, "name", e.target.value)
                    }
                  />
                ) : (
                  course.name
                )}
              </td>
              <td>
                {editIndex === index ? (
                  <input
                    value={course.credits}
                    onChange={(e) =>
                      handleEditChange(index, "credits", e.target.value)
                    }
                  />
                ) : (
                  course.credits
                )}
              </td>
              <td>
                {editIndex === index ? (
                  <button
                    className="save-btn"
                    onClick={() => handleSaveEdit(index)}
                  >
                    Save
                  </button>
                ) : (
                  <button
                    className="edit-btn"
                    onClick={() => setEditIndex(index)}
                  >
                    Edit
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="add-course-form">
        <h3>Add New Course</h3>
        <input
          type="text"
          placeholder="Course ID"
          value={newCourse.id}
          onChange={(e) => setNewCourse({ ...newCourse, id: e.target.value })}
        />
        <input
          type="text"
          placeholder="Course Name"
          value={newCourse.name}
          onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Credits"
          value={newCourse.credits}
          onChange={(e) =>
            setNewCourse({ ...newCourse, credits: e.target.value })
          }
        />
        <button className="add-btn" onClick={handleAddCourse}>
          ➕ Add Course
        </button>
      </div>

      <div className="bottom-buttons">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
      </div>
    </div>
  );
}

export default CourseDetails;

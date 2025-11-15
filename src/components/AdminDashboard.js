import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/AdminDashboard.css";

function AdminDashboard({ username, handleLogout }) {
  const [activeTab, setActiveTab] = useState("Overview");
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [studentsList, setStudentsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ===== Data =====
  const faculties = [
    "Faculty of Applied Science",
    "Faculty of Business Studies",
    "Faculty of Technological Studies",
  ];

  const facultyDepartments = {
    "Faculty of Applied Science": [
      "Department of Physical",
      "Department of Biological",
    ],
    "Faculty of Business Studies": [
      "Department of Management",
      "Department of Finance",
    ],
    "Faculty of Technological Studies": [
      "Department of Engineering",
      "Department of IT",
    ],
  };

  const levels = ["Level 1", "Level 2", "Level 3", "Level 4"];
  const semesters = ["Semester 1", "Semester 2"];

  const courses = {
    "Department of Physical": ["PHY101", "PHY102"],
    "Department of Biological": ["BIO101", "BIO102"],
    "Department of Management": ["MGT101", "MGT102"],
    "Department of Finance": ["FIN101", "FIN102"],
    "Department of Engineering": ["ENG101", "ENG102"],
    "Department of IT": ["IT101", "IT102"],
  };

  const [overviewStats, setOverviewStats] = useState({
  totalStudents: 0,
  totalCourses: 0,
  totalResults: 0,
  averageCGPA: 0,
  });

  // overview
  useEffect(() => {
  fetch("http://localhost:5000/api/admin/overview")
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        setOverviewStats({
          totalStudents: data.totalStudents,
          totalCourses: data.totalCourses,
          totalResults: data.totalResults,
          averageCGPA: data.averageCGPA,
        });
      }
    })
    .catch((err) => console.error("Error fetching overview stats:", err));
}, []);


  // ===== Fetch students =====
  useEffect(() => {
    if (activeTab === "Students" && selectedDepartment) {
      setLoading(true);
      fetch(
        `http://localhost:5000/api/admin/students?faculty=${encodeURIComponent(
          selectedFaculty
        )}&department=${encodeURIComponent(selectedDepartment)}`
      )
        .then((r) => r.json())
        .then((data) => {
          if (data.success) setStudentsList(data.students);
          else setStudentsList([]);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching students:", err);
          setLoading(false);
        });
    }
  }, [activeTab, selectedFaculty, selectedDepartment]);

  // ===== Handlers =====
  const resetSelections = () => {
    setSelectedFaculty("");
    setSelectedDepartment("");
    setSelectedLevel("");
    setSelectedSemester("");
    setSelectedCourse("");
    setStudentsList([]);
  };

  const handleCourseSelect = (courseId) => {
    setSelectedCourse(courseId);
    navigate("/resultDetails", {
      state: {
        faculty: selectedFaculty,
        department: selectedDepartment,
        level: selectedLevel,
        semester: selectedSemester,
        courseId,
      },
    });
  };

  const handleLevelSelectCourses = (level) => {
    setSelectedLevel(level);
  };

  const handleSemesterSelect = (semester) => {
    setSelectedSemester(semester);
    navigate("/courseDetails", {
      state: {
        faculty: selectedFaculty,
        department: selectedDepartment,
        level: selectedLevel,
        semester,
      },
    });
  };

  return (
    <div className="admin-container">
      {/* ===== Navbar ===== */}
      <header className="admin-navbar">
        <div className="navbar-left">
          <div className="logo">🎓</div>
          <h1>University Result Management System</h1>
        </div>
        <div className="navbar-right">
          <span className="user-role">
            👤 System Administrator ({username || "Admin"})
          </span>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <div className="admin-dashboard">
        <h2>Admin Dashboard</h2>
        <p>Manage students, courses, and results</p>

        {/* ===== Tabs ===== */}
        <div className="dashboard-tabs">
          {["Overview", "Students", "Courses", "Results"].map((tab) => (
            <button
              key={tab}
              className={activeTab === tab ? "active" : ""}
              onClick={() => {
                setActiveTab(tab);
                resetSelections();
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ===== Overview Tab ===== */}
        {activeTab === "Overview" && (
          <div className="stats-grid">
            <div className="card blue">
              <div className="icon">🎓</div>
              <div>
                <h3>Total Students</h3>
                <p>{overviewStats.totalStudents}</p>
              </div>
            </div>
            <div className="card green">
              <div className="icon">📚</div>
              <div>
                <h3>Total Courses</h3>
                <p>{overviewStats.totalCourses}</p>
              </div>
            </div>
            <div className="card purple">
              <div className="icon">📊</div>
              <div>
                <h3>Total Results</h3>
                <p>38</p>
              </div>
            </div>
            <div className="card orange">
              <div className="icon">📄</div>
              <div>
                <h3>Average CGPA</h3>
                <p>1.49</p>
              </div>
            </div>
          </div>
        )}

        {/* ===== Students Tab ===== */}
{activeTab === "Students" && (
  <div className="dropdown-section">
    <div className="dropdown">
      <label>Select Faculty:</label>
      <select
        value={selectedFaculty}
        onChange={(e) => {
          setSelectedFaculty(e.target.value);
          setSelectedDepartment("");
          setSelectedLevel("");
        }}
      >
        <option value="">-- Select Faculty --</option>
        {faculties.map((f) => (
          <option key={f} value={f}>
            {f}
          </option>
        ))}
      </select>
    </div>

    {selectedFaculty && (
      <div className="dropdown" style={{ marginTop: "20px" }}>
        <label>Select Department:</label>
        <select
          value={selectedDepartment}
          onChange={(e) => {
            setSelectedDepartment(e.target.value);
            setSelectedLevel("");
          }}
        >
          <option value="">-- Select Department --</option>
          {facultyDepartments[selectedFaculty].map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>
    )}

    {selectedDepartment && (
      <div className="dropdown" style={{ marginTop: "20px" }}>
        <label>Select Level:</label>
        <select
          value={selectedLevel}
          onChange={(e) => {
            const level = e.target.value;
            setSelectedLevel(level);
            // Navigate to StudentDetails page
            if (level) {
              navigate("/studentDetails", {
                state: {
                  faculty: selectedFaculty,
                  department: selectedDepartment,
                  level,
                },
              });
            }
          }}
        >
          <option value="">-- Select Level --</option>
          {levels.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      </div>
    )}
  </div>
)}


        {/* ===== Courses Tab ===== */}
        {activeTab === "Courses" && (
          <div className="dropdown-section">
            <div className="dropdown">
              <label>Select Faculty:</label>
              <select
                value={selectedFaculty}
                onChange={(e) => {
                  setSelectedFaculty(e.target.value);
                  setSelectedDepartment("");
                  setSelectedLevel("");
                  setSelectedSemester("");
                }}
              >
                <option value="">-- Select Faculty --</option>
                {faculties.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>

            {selectedFaculty && (
              <div className="dropdown" style={{ marginTop: "20px" }}>
                <label>Select Department:</label>
                <select
                  value={selectedDepartment}
                  onChange={(e) => {
                    setSelectedDepartment(e.target.value);
                    setSelectedLevel("");
                    setSelectedSemester("");
                  }}
                >
                  <option value="">-- Select Department --</option>
                  {facultyDepartments[selectedFaculty].map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {selectedDepartment && (
              <div className="dropdown" style={{ marginTop: "20px" }}>
                <label>Select Level:</label>
                <select
                  value={selectedLevel}
                  onChange={(e) => handleLevelSelectCourses(e.target.value)}
                >
                  <option value="">-- Select Level --</option>
                  {levels.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {selectedLevel && (
              <div className="dropdown" style={{ marginTop: "20px" }}>
                <label>Select Semester:</label>
                <select
                  value={selectedSemester}
                  onChange={(e) => handleSemesterSelect(e.target.value)}
                >
                  <option value="">-- Select Semester --</option>
                  {semesters.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}

        {/* ===== Results Tab ===== */}
        {activeTab === "Results" && (
          <div className="dropdown-section">
            <div className="dropdown">
              <label>Select Faculty:</label>
              <select
                value={selectedFaculty}
                onChange={(e) => {
                  setSelectedFaculty(e.target.value);
                  setSelectedDepartment("");
                  setSelectedLevel("");
                  setSelectedCourse("");
                }}
              >
                <option value="">-- Select Faculty --</option>
                {faculties.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>

            {selectedFaculty && (
              <div className="dropdown" style={{ marginTop: "20px" }}>
                <label>Select Department:</label>
                <select
                  value={selectedDepartment}
                  onChange={(e) => {
                    setSelectedDepartment(e.target.value);
                    setSelectedLevel("");
                    setSelectedCourse("");
                  }}
                >
                  <option value="">-- Select Department --</option>
                  {facultyDepartments[selectedFaculty].map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {selectedDepartment && (
              <div className="dropdown" style={{ marginTop: "20px" }}>
                <label>Select Level:</label>
                <select
                  value={selectedLevel}
                  onChange={(e) => {
                    setSelectedLevel(e.target.value);
                    setSelectedCourse("");
                  }}
                >
                  <option value="">-- Select Level --</option>
                  {levels.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {selectedLevel && (
              <div className="dropdown" style={{ marginTop: "20px" }}>
                <label>Select Course ID:</label>
                <select
                  value={selectedCourse}
                  onChange={(e) => handleCourseSelect(e.target.value)}
                >
                  <option value="">-- Select Course --</option>
                  {courses[selectedDepartment]?.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;

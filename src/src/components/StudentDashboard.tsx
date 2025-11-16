import React, { useState } from "react";
import { Download, FileText, TrendingUp, Award, Calendar } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { mockResults, mockCourses, mockStudents } from "../data/mockData";
import { getGradeColor } from "../utils/gradeUtils";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const [selectedSemester, setSelectedSemester] = useState<number>(1);

  const student = mockStudents.find(
    (s) => s.registrationNumber === user?.registrationNumber
  );
  const studentResults = mockResults.filter((result) => result.studentId === user?.id);

  const filteredResults = studentResults.filter(
    (result) => result.level === selectedLevel && result.semester === selectedSemester
  );

  const levelResults = {
    1: {
      1: studentResults.filter((r) => r.level === 1 && r.semester === 1),
      2: studentResults.filter((r) => r.level === 1 && r.semester === 2),
    },
    2: {
      1: studentResults.filter((r) => r.level === 2 && r.semester === 1),
      2: studentResults.filter((r) => r.level === 2 && r.semester === 2),
    },
  };

  const getSemesterName = (semester: number) => {
    return semester === 1 ? "First Semester" : "Second Semester";
  };

  const downloadResultSheet = (level: number, semester: number) => {
    const results =
      levelResults[level as keyof typeof levelResults][
        semester as keyof typeof levelResults[1]
      ];
    if (results.length === 0) return;

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(
      `Level ${level} - ${getSemesterName(semester)} Result Sheet`,
      14,
      20
    );

    const tableData = results.map((result) => {
      const course = mockCourses.find((c) => c.code === result.courseCode);
      return [
        result.courseCode,
        result.courseName,
        result.grade,
        result.gpa.toFixed(1),
        course?.credits || 0,
      ];
    });

    autoTable(doc, {
      head: [["Course Code", "Course Name", "Grade", "GPA", "Credits"]],
      body: tableData,
      startY: 30,
    });

    doc.save(
      `${user?.registrationNumber}_Level${level}_Semester${semester}_Results.pdf`
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Student Info Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome, {user?.name}
            </h1>
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>Registration: {user?.registrationNumber}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Current Level: {student?.level}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-gray-600">Current CGPA</span>
            </div>
            <div className="text-3xl font-bold text-green-600">
              {student?.cgpa.toFixed(2) || "0.00"}
            </div>
          </div>
        </div>
      </div>

      {/* Level and Semester Selector */}
      <div className="mb-6 space-y-4">
        {/* Level Selector */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Select Level:</h3>
          <div className="flex space-x-4">
            {[1, 2].map((level) => (
              <button
                key={level}
                onClick={() => setSelectedLevel(level)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  selectedLevel === level
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                Level {level}
              </button>
            ))}
          </div>
        </div>

        {/* Semester Selector */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Select Semester:</h3>
          <div className="flex space-x-4">
            {[1, 2].map((semester) => {
              const resultsCount =
                levelResults[selectedLevel as keyof typeof levelResults][
                  semester as keyof typeof levelResults[1]
                ].length;
              return (
                <button
                  key={semester}
                  onClick={() => setSelectedSemester(semester)}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    selectedSemester === semester
                      ? "bg-green-600 text-white shadow-md"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {getSemesterName(semester)}
                  {resultsCount > 0 && (
                    <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                      {resultsCount} courses
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Level {selectedLevel} - {getSemesterName(selectedSemester)} Results
          </h2>
          {filteredResults.length > 0 && (
            <button
              onClick={() => downloadResultSheet(selectedLevel, selectedSemester)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
          )}
        </div>

        {filteredResults.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course Name
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Grade
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    GPA
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Credits
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredResults.map((result) => {
                  const course = mockCourses.find((c) => c.code === result.courseCode);
                  return (
                    <tr
                      key={result.id}
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {result.courseCode}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{result.courseName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`text-sm font-bold ${getGradeColor(result.grade)}`}>
                          {result.grade}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="text-sm font-medium text-gray-900">
                          {result.gpa.toFixed(1)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="text-sm text-gray-900">{course?.credits || 0}</div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Results Available</h3>
            <p className="text-gray-600">
              Results for Level {selectedLevel} - {getSemesterName(selectedSemester)} have
              not been published yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;

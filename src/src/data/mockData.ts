import { User, Course, Result, Student } from '../types';

export const mockUsers: User[] = [
  // Students
  { id: '1', name: 'Fathima Nuzha', registrationNumber: '2021ICT108', role: 'student', level: 2 },
  { id: '2', name: 'Atheek Ahamed', registrationNumber: '2021ICT50', role: 'student', level: 2 },
  { id: '3', name: 'Mohammed Sajath', registrationNumber: '2021ICT56', role: 'student', level: 2 },
  { id: '4', name: 'Atheeq Ahamed', registrationNumber: '2021ICT83', role: 'student', level: 2 },
  { id: '5', name: 'Fathima Hima', registrationNumber: '2021ICT84', role: 'student', level: 2 },

  // Admin
  { id: 'admin1', name: 'System Administrator', username: 'admin', role: 'admin' },

  // Staff
  { id: 'staff1', name: 'John Doe', username: 'jdoe', role: 'staff' },
  { id: 'staff2', name: 'Jane Smith', username: 'jsmith', role: 'staff' }
];

export const mockCourses: Course[] = [
  // Level 1 - First Semester
  { id: '1', code: 'IT1113', name: 'Fundamentals of Information Technology', level: 1, semester: 1, credits: 3 },
  { id: '2', code: 'IT1122', name: 'Foundation of Mathematics', level: 1, semester: 1, credits: 2 },
  { id: '3', code: 'IT1134', name: 'Fundamentals of Programming', level: 1, semester: 1, credits: 4 },
  { id: '4', code: 'IT1144', name: 'Fundamentals of Web Programming', level: 1, semester: 1, credits: 4 },
  { id: '5', code: 'IT1152', name: 'Essentials of Statistics', level: 1, semester: 1, credits: 2 },
  { id: '6', code: 'ACU1113', name: 'English Language I', level: 1, semester: 1, credits: 3 },

  // Level 1 - Second Semester
  { id: '7', code: 'IT1214', name: 'Object Oriented Design and Programming', level: 1, semester: 2, credits: 4 },
  { id: '8', code: 'IT1223', name: 'Database Management Systems', level: 1, semester: 2, credits: 3 },
  { id: '9', code: 'IT1232', name: 'Project Management', level: 1, semester: 2, credits: 2 },
  { id: '10', code: 'IT1242', name: 'Principles of Computer Networks', level: 1, semester: 2, credits: 2 },
  { id: '11', code: 'IT1252', name: 'Electronics and Device Interfacing', level: 1, semester: 2, credits: 2 },
  { id: '12', code: 'IT1262', name: 'Mathematics for Computing', level: 1, semester: 2, credits: 2 },
  { id: '13', code: 'ACU1212', name: 'Social Harmony and Active Citizenship', level: 1, semester: 2, credits: 2 },

  // Level 2 - First Semester
  { id: '14', code: 'IT2114', name: 'Data Structures', level: 2, semester: 1, credits: 4 },
  { id: '15', code: 'IT2122', name: 'Software Engineering', level: 2, semester: 1, credits: 2 },
  { id: '16', code: 'IT2133', name: 'Advanced Web Programming', level: 2, semester: 1, credits: 3 },
  { id: '17', code: 'IT2143', name: 'Visual Programming', level: 2, semester: 1, credits: 3 },
  { id: '18', code: 'IT2153', name: 'Computer Graphics', level: 2, semester: 1, credits: 3 },
  { id: '19', code: 'ACU2113', name: 'English Language II', level: 2, semester: 1, credits: 3 },

  // Level 2 - Second Semester
  { id: '20', code: 'IT2212', name: 'Management Information Systems', level: 2, semester: 2, credits: 2 },
  { id: '21', code: 'IT2223', name: 'Design and Analysis of Algorithms', level: 2, semester: 2, credits: 3 },
  { id: '22', code: 'IT2234', name: 'Web Services and Server Technologies', level: 2, semester: 2, credits: 4 },
  { id: '23', code: 'IT2244', name: 'Operating Systems', level: 2, semester: 2, credits: 4 },
  { id: '24', code: 'IT2252', name: 'Social and Professional Issues in IT', level: 2, semester: 2, credits: 2 },
  { id: '25', code: 'ACU2212', name: 'Communication and Soft Skills', level: 2, semester: 2, credits: 2 }
];

export const mockStudents: Student[] = mockUsers
  .filter(u => u.role === 'student')
  .map(u => ({
    id: u.id,
    name: u.name,
    registrationNumber: u.registrationNumber!,
    level: u.level!,
    currentSemester: 1,
    cgpa: 0
  }));

// Generate mock results for Level 1 and Level 2 (both semesters)
export const mockResults: Result[] = [
  // Results for Fathima Nuzha (2021ICT108) - Level 1 First Semester
  { id: '1', studentId: '1', courseId: '1', courseCode: 'IT1113', courseName: 'Fundamentals of Information Technology', grade: 'A', marks: 85, gpa: 4.0, semester: 1, level: 1 },
  { id: '2', studentId: '1', courseId: '2', courseCode: 'IT1122', courseName: 'Foundation of Mathematics', grade: 'B+', marks: 78, gpa: 3.3, semester: 1, level: 1 },
  { id: '3', studentId: '1', courseId: '3', courseCode: 'IT1134', courseName: 'Fundamentals of Programming', grade: 'A-', marks: 82, gpa: 3.7, semester: 1, level: 1 },
  { id: '4', studentId: '1', courseId: '4', courseCode: 'IT1144', courseName: 'Fundamentals of Web Programming', grade: 'A', marks: 88, gpa: 4.0, semester: 1, level: 1 },
  { id: '5', studentId: '1', courseId: '5', courseCode: 'IT1152', courseName: 'Essentials of Statistics', grade: 'B+', marks: 76, gpa: 3.3, semester: 1, level: 1 },
  { id: '6', studentId: '1', courseId: '6', courseCode: 'ACU1113', courseName: 'English Language I', grade: 'A-', marks: 80, gpa: 3.7, semester: 1, level: 1 },
  
  // Results for Fathima Nuzha (2021ICT108) - Level 1 Second Semester
  { id: '101', studentId: '1', courseId: '7', courseCode: 'IT1214', courseName: 'Object Oriented Design and Programming', grade: 'A', marks: 89, gpa: 4.0, semester: 2, level: 1 },
  { id: '102', studentId: '1', courseId: '8', courseCode: 'IT1223', courseName: 'Database Management Systems', grade: 'A-', marks: 84, gpa: 3.7, semester: 2, level: 1 },
  { id: '103', studentId: '1', courseId: '9', courseCode: 'IT1232', courseName: 'Project Management', grade: 'B+', marks: 77, gpa: 3.3, semester: 2, level: 1 },
  { id: '104', studentId: '1', courseId: '10', courseCode: 'IT1242', courseName: 'Principles of Computer Networks', grade: 'A', marks: 86, gpa: 4.0, semester: 2, level: 1 },
  { id: '105', studentId: '1', courseId: '11', courseCode: 'IT1252', courseName: 'Electronics and Device Interfacing', grade: 'B+', marks: 75, gpa: 3.3, semester: 2, level: 1 },
  { id: '106', studentId: '1', courseId: '12', courseCode: 'IT1262', courseName: 'Mathematics for Computing', grade: 'A-', marks: 81, gpa: 3.7, semester: 2, level: 1 },
  { id: '107', studentId: '1', courseId: '13', courseCode: 'ACU1212', courseName: 'Social Harmony and Active Citizenship', grade: 'A', marks: 87, gpa: 4.0, semester: 2, level: 1 },
  
  // Results for Fathima Nuzha (2021ICT108) - Level 2 First Semester
  { id: '7', studentId: '1', courseId: '14', courseCode: 'IT2114', courseName: 'Data Structures', grade: 'A', marks: 90, gpa: 4.0, semester: 1, level: 2 },
  { id: '8', studentId: '1', courseId: '15', courseCode: 'IT2122', courseName: 'Software Engineering', grade: 'A-', marks: 83, gpa: 3.7, semester: 1, level: 2 },
  { id: '9', studentId: '1', courseId: '16', courseCode: 'IT2133', courseName: 'Advanced Web Programming', grade: 'A', marks: 87, gpa: 4.0, semester: 1, level: 2 },
  { id: '10', studentId: '1', courseId: '17', courseCode: 'IT2143', courseName: 'Visual Programming', grade: 'B+', marks: 79, gpa: 3.3, semester: 1, level: 2 },
  { id: '11', studentId: '1', courseId: '18', courseCode: 'IT2153', courseName: 'Computer Graphics', grade: 'A-', marks: 81, gpa: 3.7, semester: 1, level: 2 },
  { id: '12', studentId: '1', courseId: '19', courseCode: 'ACU2113', courseName: 'English Language II', grade: 'A', marks: 85, gpa: 4.0, semester: 1, level: 2 },
  
  // Results for Atheek Ahamed (2021ICT50) - Level 1 First Semester
  { id: '13', studentId: '2', courseId: '1', courseCode: 'IT1113', courseName: 'Fundamentals of Information Technology', grade: 'B+', marks: 77, gpa: 3.3, semester: 1, level: 1 },
  { id: '14', studentId: '2', courseId: '2', courseCode: 'IT1122', courseName: 'Foundation of Mathematics', grade: 'A-', marks: 81, gpa: 3.7, semester: 1, level: 1 },
  { id: '15', studentId: '2', courseId: '3', courseCode: 'IT1134', courseName: 'Fundamentals of Programming', grade: 'A', marks: 89, gpa: 4.0, semester: 1, level: 1 },
  { id: '16', studentId: '2', courseId: '4', courseCode: 'IT1144', courseName: 'Fundamentals of Web Programming', grade: 'A-', marks: 83, gpa: 3.7, semester: 1, level: 1 },
  { id: '17', studentId: '2', courseId: '5', courseCode: 'IT1152', courseName: 'Essentials of Statistics', grade: 'B+', marks: 75, gpa: 3.3, semester: 1, level: 1 },
  { id: '18', studentId: '2', courseId: '6', courseCode: 'ACU1113', courseName: 'English Language I', grade: 'A', marks: 86, gpa: 4.0, semester: 1, level: 1 },
  
  // Results for Atheek Ahamed (2021ICT50) - Level 1 Second Semester
  { id: '201', studentId: '2', courseId: '7', courseCode: 'IT1214', courseName: 'Object Oriented Design and Programming', grade: 'A-', marks: 82, gpa: 3.7, semester: 2, level: 1 },
  { id: '202', studentId: '2', courseId: '8', courseCode: 'IT1223', courseName: 'Database Management Systems', grade: 'A', marks: 88, gpa: 4.0, semester: 2, level: 1 },
  { id: '203', studentId: '2', courseId: '9', courseCode: 'IT1232', courseName: 'Project Management', grade: 'B+', marks: 76, gpa: 3.3, semester: 2, level: 1 },
  { id: '204', studentId: '2', courseId: '10', courseCode: 'IT1242', courseName: 'Principles of Computer Networks', grade: 'A-', marks: 80, gpa: 3.7, semester: 2, level: 1 },
  { id: '205', studentId: '2', courseId: '11', courseCode: 'IT1252', courseName: 'Electronics and Device Interfacing', grade: 'B+', marks: 78, gpa: 3.3, semester: 2, level: 1 },
  { id: '206', studentId: '2', courseId: '12', courseCode: 'IT1262', courseName: 'Mathematics for Computing', grade: 'A', marks: 85, gpa: 4.0, semester: 2, level: 1 },
  { id: '207', studentId: '2', courseId: '13', courseCode: 'ACU1212', courseName: 'Social Harmony and Active Citizenship', grade: 'A-', marks: 83, gpa: 3.7, semester: 2, level: 1 },
  
  // Results for Atheek Ahamed (2021ICT50) - Level 2 First Semester
  { id: '19', studentId: '2', courseId: '14', courseCode: 'IT2114', courseName: 'Data Structures', grade: 'A-', marks: 84, gpa: 3.7, semester: 1, level: 2 },
  { id: '20', studentId: '2', courseId: '15', courseCode: 'IT2122', courseName: 'Software Engineering', grade: 'A', marks: 88, gpa: 4.0, semester: 1, level: 2 },
  { id: '21', studentId: '2', courseId: '16', courseCode: 'IT2133', courseName: 'Advanced Web Programming', grade: 'A-', marks: 82, gpa: 3.7, semester: 1, level: 2 },
  { id: '22', studentId: '2', courseId: '17', courseCode: 'IT2143', courseName: 'Visual Programming', grade: 'B+', marks: 78, gpa: 3.3, semester: 1, level: 2 },
  { id: '23', studentId: '2', courseId: '18', courseCode: 'IT2153', courseName: 'Computer Graphics', grade: 'A', marks: 87, gpa: 4.0, semester: 1, level: 2 },
  { id: '24', studentId: '2', courseId: '19', courseCode: 'ACU2113', courseName: 'English Language II', grade: 'A-', marks: 83, gpa: 3.7, semester: 1, level: 2 }
];

// Calculate CGPA for students
mockStudents.forEach(student => {
  const studentResults = mockResults.filter(result => result.studentId === student.id);
  if (studentResults.length > 0) {
    const totalCredits = studentResults.reduce((sum, result) => {
      const course = mockCourses.find(c => c.id === result.courseId);
      return sum + (course?.credits || 0);
    }, 0);
    const totalGradePoints = studentResults.reduce((sum, result) => {
      const course = mockCourses.find(c => c.id === result.courseId);
      return sum + (result.gpa * (course?.credits || 0));
    }, 0);
    student.cgpa = parseFloat((totalGradePoints / totalCredits).toFixed(2));
  }
});
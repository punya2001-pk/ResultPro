export interface User {
  id: string;
  name: string;
  registrationNumber?: string;
  username?: string;
  role: 'student' | 'admin' | 'staff';
  level?: number;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  level: number;
  semester: number;
  credits: number;
}

export interface Result {
  id: string;
  studentId: string;
  courseId: string;
  courseCode: string;
  courseName: string;
  grade: string;
  marks: number;
  gpa: number;
  semester: number;
  level: number;
}

export interface Student {
  id: string;
  registrationNumber: string;
  name: string;
  level: number;
  currentSemester: number;
  cgpa: number;
}


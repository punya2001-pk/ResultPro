export const calculateGPA = (marks: number): number => {
  if (marks >= 85) return 4.0;
  if (marks >= 80) return 3.7;
  if (marks >= 75) return 3.3;
  if (marks >= 70) return 3.0;
  if (marks >= 65) return 2.7;
  if (marks >= 60) return 2.3;
  if (marks >= 55) return 2.0;
  if (marks >= 50) return 1.7;
  if (marks >= 45) return 1.3;
  if (marks >= 40) return 1.0;
  return 0.0;
};

export const getGradeFromMarks = (marks: number): string => {
  if (marks >= 85) return 'A';
  if (marks >= 80) return 'A-';
  if (marks >= 75) return 'B+';
  if (marks >= 70) return 'B';
  if (marks >= 65) return 'B-';
  if (marks >= 60) return 'C+';
  if (marks >= 55) return 'C';
  if (marks >= 50) return 'C-';
  if (marks >= 45) return 'D+';
  if (marks >= 40) return 'D';
  return 'F';
};

export const getGradeColor = (grade: string): string => {
  switch (grade) {
    case 'A':
    case 'A-':
      return 'text-green-600';
    case 'B+':
    case 'B':
    case 'B-':
      return 'text-blue-600';
    case 'C+':
    case 'C':
    case 'C-':
      return 'text-yellow-600';
    case 'D+':
    case 'D':
      return 'text-orange-600';
    case 'F':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
};
import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/Header';
import LoginPage from './components/LoginPage';
import StudentDashboard from './components/StudentDashboard';
import AdminDashboard from './components/AdminDashboard';
import StaffDashboard from './components/StaffDashboard';

const AppContent: React.FC = () => {
  const { user } = useAuth();

  if (!user) return <LoginPage />;

  switch (user.role) {
    case 'student':
      return (
        <div className="min-h-screen bg-gray-50">
          <Header />
          <StudentDashboard />
        </div>
      );
    case 'admin':
      return (
        <div className="min-h-screen bg-gray-50">
          <Header />
          <AdminDashboard />
        </div>
      );
    case 'staff':
      return (
        <div className="min-h-screen bg-gray-50">
          <Header />
          <StaffDashboard />
        </div>
      );
    default:
      return <LoginPage />;
  }
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

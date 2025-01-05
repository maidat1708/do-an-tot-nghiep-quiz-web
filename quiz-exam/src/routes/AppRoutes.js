import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import ExamPage from '../pages/Student/ExamPage';
import ExamDoingPage from '../pages/Student/ExamDoingPage';
import ResultsPage from '../pages/Student/ResultsPage';
import UserManagementPage from '../pages/Admin/UserManagement';
import SubjectManagementPage from '../pages/Admin/SubjectManagement';
import QuestionManagementPage from '../pages/Admin/QuestionManagement';
import ExamManagementPage from '../pages/Admin/ExamManagement';
import ResultsManagementPage from '../pages/Admin/ResultsManagement';
import TemplateManagementPage from '../pages/Admin/TemplateManagementPage';
import { useAuth } from '../hooks/useAuth';
import ExamSessionResults from '../pages/Teacher/ExamSessionResults';
import ExamSessionDetail from '../pages/Teacher/ExamSessionDetail';
import TeacherExamSessions from '../pages/Teacher/TeacherExamSessions';

const AppRoutes = () => {
  const { isLoggedIn, user } = useAuth(); // Lấy isLoggedIn và user từ useAuth
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn && user) {
      if (user.role === 'ADMIN') {
        navigate('/manage-users');
      } else if (user.role === 'STUDENT') {
        navigate('/exam');
      } else if ((user.role === 'TEACHER')){
        navigate('/exam-sessions')
      }
    }
  }, [isLoggedIn, user]);

  // HOC để bảo vệ route admin
  const AdminRoute = ({ children }) => {
    if (!isLoggedIn || !user) return <Navigate to="/" replace />;
    if (user.role !== 'ADMIN') return <Navigate to="/" replace />;
    return children;
  };

  // HOC để bảo vệ route student
  const StudentRoute = ({ children }) => {
    if (!isLoggedIn || !user) return <Navigate to="/" replace />;
    if (user.role !== 'STUDENT') return <Navigate to="/" replace />;
    return children;
  };

  // HOC để bảo vệ route teacher
  const TeacherRoute = ({ children }) => {
    if (!isLoggedIn || !user) return <Navigate to="/" replace />;
    if (user.role !== 'TEACHER') return <Navigate to="/" replace />;
    return children;
  };

  return (
    <Routes>
      {/* Route công khai */}
      <Route path="/" element={<HomePage />} />

      {/* Route cho Student */}
      <Route
        path="/exam"
        element={
          <StudentRoute>
            <ExamPage />
          </StudentRoute>
        }
      />
      <Route
        path="/exam/doing/:quizId"
        element={
          <StudentRoute>
            <ExamDoingPage />
          </StudentRoute>
        }
      />
      <Route
        path="/results"
        element={
          <StudentRoute>
            <ResultsPage />
          </StudentRoute>
        }
      />

      {/* Route cho Admin */}
      <Route
        path="/manage-users"
        element={
          <AdminRoute>
            <UserManagementPage />
          </AdminRoute>
        }
      />
      <Route
        path="/manage-subjects"
        element={
          <AdminRoute>
            <SubjectManagementPage />
          </AdminRoute>
        }
      />
      <Route
        path="/manage-questions"
        element={
          <AdminRoute>
            <QuestionManagementPage />
          </AdminRoute>
        }
      />
      <Route
        path="/manage-exams"
        element={
          <AdminRoute>
            <ExamManagementPage />
          </AdminRoute>
        }
      />
      <Route
        path="/manage-results"
        element={
          <AdminRoute>
            <ResultsManagementPage />
          </AdminRoute>
        }
      />
      <Route 
        path="/manage-templates" 
        element={
          <AdminRoute>
          <TemplateManagementPage />
          </AdminRoute>
        }
       />

      {/* Route cho Teacher */}
      <Route
        path="/exam-sessions"
        element={
          <TeacherRoute>
            <TeacherExamSessions />
          </TeacherRoute>
        }
      />
      <Route
        path="/manage-questions/teacher"
        element={
          <TeacherRoute>
            <QuestionManagementPage />
          </TeacherRoute>
        }
      />
      <Route
        path="/manage-exams/teacher"
        element={
          <TeacherRoute>
            <ExamManagementPage />
          </TeacherRoute>
        }
      />
      <Route
        path="/exam-sessions/:examSessionId"
        element={
          <TeacherRoute>
            <ExamSessionDetail />
          </TeacherRoute>
        }
      />
      <Route
        path="/exam-session/results/:examSessionId"
        element={
          <TeacherRoute>
            <ExamSessionResults />
          </TeacherRoute>
        }
      />

      {/* Điều hướng về trang chủ nếu đường dẫn không tồn tại */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;

import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import HomePage from '../pages/HomePage';  // Trang chủ
import ExamPage from '../pages/Student/ExamPage';  // Trang bài thi
import ExamDoingPage from '../pages/Student/ExamDoingPage';
import ResultsPage from '../pages/Student/ResultsPage';
import UserManagementPage from '../pages/Admin/UserManagement';
import SubjectManagementPage from '../pages/Admin/SubjectManagement';
import QuestionManagementPage from '../pages/Admin/QuestionManagement';
import ExamManagementPage from '../pages/Admin/ExamManagement';
import ResultsManagementPage from '../pages/Admin/ResultsManagement';
import { useAuth } from '../hooks/useAuth'; // Giả sử đây là hook để kiểm tra trạng thái đăng nhập

const AppRoutes = () => {
  const { isLoggedIn, role } = useAuth(); // Sử dụng hook để kiểm tra trạng thái đăng nhập
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      if (role === 'ADMIN') {
        navigate('/manage-users'); // Điều hướng đến trang admin mặc định
      } else if (role === 'STUDENT') {
        navigate('/'); // Điều hướng đến trang home cho student
      }
    }
  }, [isLoggedIn, role, navigate]);

  return (
    <Routes>
      {/* Route cho trang chủ */}
      <Route path="/" element={<HomePage />} />

      {/* Điều hướng về trang role student */}
      <Route
        path="/exam" 
        element={isLoggedIn ? <ExamPage /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/exam/doing" 
        element={isLoggedIn ? <ExamDoingPage /> : <Navigate to="/login" replace />}
      />
      <Route 
        path="/results" 
        element={isLoggedIn ? <ResultsPage /> : <Navigate to="/login" replace />} 
      />

       {/* Điều hướng về trang role admin */}
      <Route
        path="/manage-users" 
        element={isLoggedIn ? <UserManagementPage /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/manage-subjects" 
        element={isLoggedIn ? <SubjectManagementPage /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/manage-questions" 
        element={isLoggedIn ? <QuestionManagementPage /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/manage-exams" 
        element={isLoggedIn ? <ExamManagementPage /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/manage-results" 
        element={isLoggedIn ? <ResultsManagementPage /> : <Navigate to="/login" replace />}
      />

      {/* Điều hướng về trang chủ nếu đường dẫn không tồn tại */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;

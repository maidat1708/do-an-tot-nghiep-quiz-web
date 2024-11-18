import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '../pages/HomePage';  // Trang chủ
import ExamPage from '../pages/ExamPage';  // Trang bài thi
import ExamDoingPage from '../pages/ExamDoingPage';
import ResultsPage from '../pages/ResultsPage';
import { useAuth } from '../hooks/useAuth'; // Giả sử đây là hook để kiểm tra trạng thái đăng nhập

const AppRoutes = () => {
  const { isLoggedIn } = useAuth(); // Sử dụng hook để kiểm tra trạng thái đăng nhập

  return (
    <Routes>
      {/* Route cho trang chủ */}
      <Route path="/" element={<HomePage />} />

      {/* Route cho trang bài thi, chỉ hiển thị khi đã đăng nhập */}
      <Route
        path="/exam" 
        element={isLoggedIn ? <ExamPage /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/exam/doing" 
        element={isLoggedIn ? <ExamDoingPage /> : <Navigate to="/login" replace />}
      />
      {/* Route cho trang kết quả thi, chỉ hiển thị khi đã đăng nhập */}
      <Route 
        path="/results" 
        element={isLoggedIn ? <ResultsPage /> : <Navigate to="/login" replace />} 
      />

      {/* Điều hướng về trang chủ nếu đường dẫn không tồn tại */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;

// hooks/useAuth.js
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { user } = useContext(AuthContext); // Lấy user từ AuthContext

  useEffect(() => {
    // Kiểm tra token và user từ context
    const token = localStorage.getItem('token');
    
    if (token && user) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [user]); // Dependency array thêm user để useEffect chạy lại khi user thay đổi

  return { isLoggedIn, user };
}; 
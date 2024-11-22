// hooks/useAuth.js
import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null); // Lưu vai trò của người dùng

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setIsLoggedIn(true);
      setRole(user.role); // Lấy vai trò từ thông tin người dùng
    } else {
      setIsLoggedIn(false);
      setRole(null);
    }
  }, []);

  return { isLoggedIn, role };
}; 
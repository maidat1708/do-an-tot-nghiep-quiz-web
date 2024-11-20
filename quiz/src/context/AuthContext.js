// src/context/AuthContext.js
import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

    // Hàm đăng ký
  const registerUser = async (firstName, lastName, username, email, password) => {
    const newUser = { 
      firstName, 
      lastName, 
      username, 
      email, 
      password, 
      role: "ADMIN" // Thêm role mặc định
    };
    localStorage.setItem('user', JSON.stringify(newUser));
    return true;
  };

  // Hàm đăng nhập
  const loginUser = async (username, password) => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser && storedUser.username === username && storedUser.password === password) {
      setUser(storedUser);
      return true;
    }
    return false;
  };

  // Hàm đăng xuất
  const logoutUser = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, registerUser, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

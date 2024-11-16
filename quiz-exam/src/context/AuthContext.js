// src/context/AuthContext.js
import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Hàm đăng ký
  const registerUser = async (firstname, lastname, username, email, password) => {
    try {
      console.log("Registering user with data:", { firstname, lastname, username, email, password });
      const response = await fetch('http://26.184.129.66:8080/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          firstname, 
          lastname, 
          username, 
          email, 
          password,
          role: "STUDENT" 
        })
      });
      console.log("API response status:", response.status);

      if (response.ok) {
        const newUser = await response.json();
        setUser(newUser);
        return true;
      } else {
        // const errorText = await response.text();
        // throw new Error(`HTTP error! Status: ${response.status}. Details: ${errorText}`);
        console.error('Đăng ký thất bại');
        return false;
      }
    } catch (error) {
      // console.error('Lỗi khi đăng ký:', error);
      // throw error;
      return false;
    }
  };

  // Hàm đăng nhập
  const loginUser = async (username, password) => {
    try {
      const response = await fetch('http://26.184.129.66:8080/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        return true;
      } else {
        console.error('Đăng nhập thất bại');
        return false;
      }
    } catch (error) {
      console.error('Lỗi khi đăng nhập:', error);
      return false;
    }
  };

  // Hàm đăng xuất
  const logoutUser = async () => {
    try {
      // Gửi yêu cầu POST đến API để đăng xuất
      const response = await fetch('http://26.184.129.66:8080/api/v1/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Thêm token nếu cần, ví dụ trong header Authorization
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      });

      if (response.ok) {
        console.log('Đăng xuất thành công');

        // Xóa dữ liệu người dùng và token khỏi localStorage hoặc sessionStorage
        setUser(null);
        localStorage.removeItem('token');
      } else {
        console.error('Đăng xuất thất bại');
      }
    } catch (error) {
      console.error('Lỗi khi đăng xuất:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, registerUser, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};
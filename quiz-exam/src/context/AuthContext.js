// src/context/AuthContext.js
import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Hàm đăng ký
  const registerUser = async (firstName, lastName, username, email, password) => {
    try {
      // console.log("Registering user with data:", { firstName, lastName, username, email, password });
      const response = await fetch('http://26.184.129.66:8080/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          firstName, 
          lastName, 
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
        console.error('Đăng ký thất bại');
        return false;
      }
    } catch (error) {
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
  const logoutUser = () => {
    localStorage.removeItem('user');
    setUser(null);
  };
  
  // Hàm cập nhật thông tin người dùng
  const updateUser = async (updatedInfo, newPassword = null) => {
    const updatedUser = { ...user, profile: { ...user.profile, ...updatedInfo } };

    // Nếu có mật khẩu mới, thay đổi mật khẩu
    if (newPassword) {
      updatedUser.password = newPassword;
    }

    // Gửi thông tin cập nhật lên API (hoặc xử lý localStorage nếu không có API)
    const apiUrl = `http://26.184.129.66:8080/api/v1/users/${user.id}`; // Thay đổi API đúng của bạn
    fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedUser),
    })
    .then((response) => response.json())
    .then((data) => {
      setUser(data); // Cập nhật user trong context sau khi lưu thành công
      localStorage.setItem('user', JSON.stringify(data)); // Lưu lại vào localStorage
    })
    .catch((error) => {
      console.error('Error updating user data:', error);
    });
  };

  return (
    <AuthContext.Provider value={{ user, setUser, registerUser, loginUser, logoutUser, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
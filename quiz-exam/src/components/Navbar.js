import React, { useState, useContext, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Avatar, Menu, MenuItem } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import LoginModal from './LoginModal'; // Component cho popup đăng nhập
import RegisterModal from './RegisterModal'; // Component cho popup đăng ký
import logo from '../assets/logo-PTIT.png'; // Đường dẫn tới logo
import userAvatar from '../assets/user-avatar.jpg'; // Đường dẫn tới ảnh đại diện người dùng
import { AuthContext } from '../context/AuthContext';  // Sử dụng default import
import { toast } from 'react-toastify';
import EditProfileModal from './EditProfileModal';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const { user, setUser } = useContext(AuthContext);
  const { isLoggedIn, setIsLoggedIn } = useAuth(); // Sử dụng hook useAuth
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const navigate = useNavigate();

  const handleLoginOpen = () => {
    setShowLogin(true);
    setShowRegister(false);
  };

  const handleLoginClose = () => {
    setShowLogin(false);
  };

  const handleRegisterOpen = () => {
    setShowRegister(true);
    setShowLogin(false);
  };

  const handleRegisterClose = () => {
    setShowRegister(false);
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    // Không cần setIsLoggedIn vì đã có useAuth
  };

  // Mở menu khi nhấn vào avatar
  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Đóng menu
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  // Xử lý khi đăng xuất
  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.success('Đã đăng xuất thành công');
    navigate('/');
    handleCloseMenu();
  };

  const handleEditProfile = () => {
    console.log('handleEditProfile called');
    setShowEditProfile(true); 
    console.log(showEditProfile); // Mở popup chỉnh sửa thông tin
    handleCloseMenu();  // Đóng menu sau khi chọn "Trang cá nhân"
  };

  useEffect(() => {
    setAnchorEl(null); // Chỉ để đóng menu khi trạng thái đăng nhập thay đổi
  }, [isLoggedIn]);    

  // Kiểm tra role ADMIN
  const isAdmin = user && user.role === 'ADMIN';

  return (
    <>
      <AppBar position="static" style={{ backgroundColor: '#d30000' }}>
        <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
          <img src={logo} alt="logo" style={{ width: 50, height: 50, marginRight: '10px' }} />
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            My Exam System
          </Typography>
          <Box sx={{ flexGrow: 1, display: 'flex', marginRight: '150px' }}>
            {isLoggedIn && user ? (
              isAdmin ? (
                <>
                  <Button color="inherit" component={Link} to="/manage-users" sx={{ mx: 2 }}>Người dùng</Button>
                  <Button color="inherit" component={Link} to="/manage-subjects" sx={{ mx: 2 }}>Môn học</Button>
                  <Button color="inherit" component={Link} to="/manage-questions" sx={{ mx: 2 }}>Câu hỏi</Button>
                  <Button color="inherit" component={Link} to="/manage-exams" sx={{ mx: 2 }}>Đề thi</Button>
                  <Button color="inherit" component={Link} to="/manage-results" sx={{ mx: 2 }}>Điểm thi</Button>
                  <Button color="inherit" component={Link} to="/manage-templates" sx={{ mx: 2 }}>Template</Button>
                </>
              ) : (
                <>
                  <Button color="inherit" component={Link} to="/" sx={{ mx: 4 }}>Trang chủ</Button>
                  <Button color="inherit" component={Link} to="/exam" sx={{ mx: 4 }}>Bài thi</Button>
                  <Button color="inherit" component={Link} to="/results" sx={{ mx: 4 }}>Kết quả</Button>
                </>
              )
            ) : (
              <Button color="inherit" component={Link} to="/" sx={{ mx: 4 }}>Trang chủ</Button>
            )}
          </Box>

          {isLoggedIn && user ? (
            <>
              <Avatar alt="User Avatar" src={userAvatar} style={{ marginLeft: '10px', cursor: 'pointer' }} onClick={handleAvatarClick} />
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
              >
                <MenuItem onClick={handleEditProfile}>Trang cá nhân</MenuItem>
                <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={handleLoginOpen}>Đăng nhập</Button>
              <Button color="inherit" onClick={handleRegisterOpen}>Đăng ký</Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      {/* Popup đăng nhập */}
      {showLogin && <LoginModal onClose={handleLoginClose} onSwitchToRegister={handleRegisterOpen} onSuccess={handleLoginSuccess} />}

      {/* Popup đăng ký */}
      {showRegister && <RegisterModal onClose={handleRegisterClose} onSwitchToLogin={handleLoginOpen} />}
      
      {/* Popup chỉnh sửa thông tin người dùng */}
      {showEditProfile && <EditProfileModal open={showEditProfile} onClose={() => setShowEditProfile(false)} />}
    </>
  );
};

export default Navbar;

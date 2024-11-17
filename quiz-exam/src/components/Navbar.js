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

const Navbar = () => {
  const { setUser } = useContext(AuthContext);  // Lấy dữ liệu từ AuthContext
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('user') !== null); // Kiểm tra trạng thái đăng nhập
  const [showLogin, setShowLogin] = useState(false); // Trạng thái hiển thị popup đăng nhập
  const [showRegister, setShowRegister] = useState(false); // Trạng thái hiển thị popup đăng ký
  const [anchorEl, setAnchorEl] = useState(null); // Trạng thái menu
  const [showEditProfile, setShowEditProfile] = useState(false);
  const navigate = useNavigate(); // Điều hướng giữa các trang

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
    setUser(JSON.parse(localStorage.getItem('user')));
    setShowLogin(false); // Đóng popup sau khi đăng nhập thành công
    navigate('/'); // Chuyển hướng đến trang chủ
  };

  const handleExamClick = () => {
    if (!isLoggedIn) {
      setShowLogin(true); // Hiển thị popup đăng nhập nếu chưa đăng nhập
    } else {
      navigate('/exam'); // Chuyển đến trang làm bài thi
    }
  };

  const handleResultsClick = () => {
    if (!isLoggedIn) {
      setShowLogin(true); // Hiển thị popup đăng nhập nếu chưa đăng nhập
    } else {
      navigate('/results'); // Chuyển đến trang kết quả thi
    }
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
    // localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null); // Xoá thông tin user trong context
    toast.success('Đã đăng xuất thành công');
    navigate('/'); // Chuyển về trang chủ sau khi đăng xuất
  };

  const handleEditProfile = () => {
    console.log('handleEditProfile called');
    setShowEditProfile(true); 
    console.log(showEditProfile); // Mở popup chỉnh sửa thông tin
    handleCloseMenu();  // Đóng menu sau khi chọn "Trang cá nhân"
  };

  useEffect(() => {
    setAnchorEl(null);
  }, [isLoggedIn]);

  return (
    <>
      <AppBar position="static" style={{ backgroundColor: '#d30000' }}>
        <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
          <img src={logo} alt="logo" style={{ width: 50, height: 50, marginRight: '10px' }} />
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            My Exam System
          </Typography>
          <Box sx={{ flexGrow: 1, display: 'flex', marginRight: '150px' }}>
            <Button color="inherit" component={Link} to="/" sx={{ mx: 4 }}>Trang chủ</Button>
            {/* Chuyển đổi thành Link để điều hướng */}
            <Button color="inherit" onClick={handleExamClick} sx={{ mx: 4 }}>Bài thi</Button>
            <Button color="inherit" onClick={handleResultsClick} sx={{ mx: 4 }}>Kết quả</Button>
          </Box>

          {isLoggedIn ? (
            <>
              <Avatar alt="User Avatar" src={userAvatar} style={{ marginLeft: '10px' }} onClick={handleAvatarClick} />
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

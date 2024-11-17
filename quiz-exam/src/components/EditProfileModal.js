import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, MenuItem, Select, InputLabel, FormControl, Grid } from '@mui/material';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'; // Dùng để điều hướng

const EditProfileModal = ({ open, onClose }) => {
  const { user, updateUser } = useContext(AuthContext); // Lấy user và updateUser từ context
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    address: '',
    birthDay: '',
    gender: 0,
    password: '',
    newPassword: '',
  });
  const navigate = useNavigate(); // Dùng để điều hướng về trang chủ

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email,
        firstName: user.profile.firstName,
        lastName: user.profile.lastName,
        phoneNumber: user.profile.phoneNumber,
        address: user.profile.address,
        birthDay: user.profile.birthDay,
        gender: user.profile.gender,
        password: '',
        newPassword: '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    const { password, newPassword } = formData;
    const updatedInfo = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      address: formData.address,
      birthDay: formData.birthDay,
      gender: formData.gender,
    };

    // Nếu có thay đổi mật khẩu, thêm mật khẩu mới vào thông tin cập nhật
    const passwordUpdate = newPassword ? newPassword : password;

    // Gọi updateUser từ context để cập nhật thông tin người dùng
    updateUser(updatedInfo, passwordUpdate);

    toast.success('Thông tin đã được cập nhật');
    onClose(); // Đóng popup
    navigate('/'); // Chuyển về trang chủ sau khi lưu thành công
  };

  const handleCancel = () => {
    onClose(); // Đóng popup
    navigate('/'); // Chuyển về trang chủ khi hủy
  };

  return (
    <Modal open={open} onClose={handleCancel}>
      <Box sx={{ width: 'auto', maxWidth: 500, padding: 2, backgroundColor: 'white', margin: 'auto', marginTop: '10px', maxHeight: '90vh', overflowY: 'auto' }}>
      <h2 style={{ textAlign: 'center' }}>Chỉnh sửa thông tin</h2>

        <Grid container spacing={1}>
          <Grid item xs={6}>
            <TextField
              label="Họ"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              fullWidth
              margin="normal"
              sx={{ fontSize: '10px', padding: '0px' }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Tên"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              fullWidth
              margin="normal"
              sx={{ fontSize: '10px', padding: '0px' }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              margin="normal"
              sx={{ fontSize: '10px', padding: '0px' }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Số điện thoại"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              fullWidth
              margin="normal"
              sx={{ fontSize: '10px', padding: '0px' }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Địa chỉ"
              name="address"
              value={formData.address}
              onChange={handleChange}
              fullWidth
              margin="normal"
              sx={{ fontSize: '10px', padding: '0px' }}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              label="Ngày sinh"
              name="birthDay"
              value={formData.birthDay}
              onChange={handleChange}
              fullWidth
              margin="normal"
              type="date"
              InputLabelProps={{ shrink: true }} // Đẩy label lên trên
              sx={{ fontSize: '10px', padding: '0px' }}
            />
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Giới tính</InputLabel>
              <Select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                sx={{ fontSize: '10px', padding: '4px' }}
              >
                <MenuItem value={0}>Nam</MenuItem>
                <MenuItem value={1}>Nữ</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Mật khẩu cũ"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              fullWidth
              margin="normal"
              sx={{ fontSize: '10px', padding: '0px' }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Mật khẩu mới"
              name="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={handleChange}
              fullWidth
              margin="normal"
              sx={{ fontSize: '10px', padding: '0px' }}
            />
          </Grid>
        </Grid>

        <Grid container spacing={1} justifyContent="space-evenly" style={{ marginTop: '20px' }}>
          <Grid item xs={2}>
            <Button variant="contained" color="primary" onClick={handleSave} fullWidth>
              Lưu
            </Button>
          </Grid>
          <Grid item xs={2}>
            <Button variant="outlined" onClick={handleCancel} fullWidth>
              Hủy
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export default EditProfileModal;

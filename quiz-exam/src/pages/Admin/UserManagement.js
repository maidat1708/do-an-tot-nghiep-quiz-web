import React from 'react';
import { Container, Typography } from '@mui/material';

const UserManagementPage = () => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Quản lý người dùng
      </Typography>
      <Typography variant="body1">
        Trang này dùng để quản lý tài khoản người dùng.
      </Typography>
    </Container>
  );
};

export default UserManagementPage;

import React from 'react';
import { Typography, Container } from '@mui/material';

const HomePage = () => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Chào mừng đến với Hệ thống Thi trắc nghiệm
      </Typography>
      <Typography variant="body1">
        Bạn có thể đăng nhập để tham gia các bài thi và quản lý thông tin của mình.
      </Typography>
    </Container>
  );
};

export default HomePage;

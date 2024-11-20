import React from 'react';
import { Container, Typography } from '@mui/material';

const ExamManagementPage = () => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Quản lý Kho đề
      </Typography>
      <Typography variant="body1">
        Trang này dùng để quản lý và trộn đề thi cho các kỳ thi.
      </Typography>
    </Container>
  );
};

export default ExamManagementPage;

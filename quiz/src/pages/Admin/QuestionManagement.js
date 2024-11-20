import React from 'react';
import { Container, Typography } from '@mui/material';

const QuestionManagementPage = () => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Quản lý Câu hỏi
      </Typography>
      <Typography variant="body1">
        Trang này dùng để thêm, sửa, xóa các câu hỏi trong kho câu hỏi.
      </Typography>
    </Container>
  );
};

export default QuestionManagementPage;

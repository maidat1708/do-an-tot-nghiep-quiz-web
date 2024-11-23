import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Box, Paper, Grid } from '@mui/material';

const ExamPage = () => {
  const navigate = useNavigate();

  // Giả sử đây là thông tin bài thi
  const examDetails = {
    subject: 'Toán học 12', // Tên môn học
    duration: '60 phút', // Thời gian làm bài
    description: 'Bài thi trắc nghiệm môn Toán, bao gồm 30 câu hỏi với thời gian làm bài là 60 phút.',
  };

  // Hàm xử lý khi bấm nút "Bắt đầu làm bài"
  const handleStartExam = () => {
    navigate('/exam/doing'); // Chuyển hướng sang trang làm bài
  };

  return (
    <Box sx={{ padding: '20px' }}>
      {/* Nội dung thông tin bài thi */}
      <Typography variant="h4" gutterBottom>
        Thông tin bài thi
      </Typography>
      <Paper sx={{ padding: '20px' }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6">Môn học:</Typography>
            <Typography variant="body1">{examDetails.subject}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6">Thời gian làm bài:</Typography>
            <Typography variant="body1">{examDetails.duration}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Mô tả bài thi:</Typography>
            <Typography variant="body1">{examDetails.description}</Typography>
          </Grid>
        </Grid>

        {/* Nút bắt đầu làm bài */}
        <Box sx={{ textAlign: 'center', marginTop: '20px' }}>
          <Button variant="contained" onClick={handleStartExam}>
            Bắt đầu làm bài
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ExamPage;

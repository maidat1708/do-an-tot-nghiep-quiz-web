import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Box, Paper, Grid, Container, List, ListItem, ListItemText, Radio, RadioGroup, FormControlLabel, FormControl, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import ResultsModal from '../components/ResultsModal'; 

const questions = [
  { id: 1, section: 'Phần I', question: 'Câu hỏi 1 : Nội dung câu hỏi...', options: ['A', 'B', 'C', 'D'] },
  { id: 2, section: 'Phần I', question: 'Câu hỏi 2 : Nội dung câu hỏi...', options: ['A', 'B', 'C', 'D'] },
  { id: 3, section: 'Phần II', question: 'Câu hỏi 3 : Nội dung câu hỏi...', options: ['A', 'B', 'C', 'D'] },
  // Thêm các câu hỏi khác
];

const ExamDoingPage = () => {
  const navigate = useNavigate();
  
  const [answers, setAnswers] = useState({});
  const [selectedQuestion, setSelectedQuestion] = useState(questions[0]);
  const [timeLeft, setTimeLeft] = useState(60 * 60); // 60 minutes (in seconds)
  const [openDialog, setOpenDialog] = useState(false); // Trạng thái mở popup
  const [examResult, setExamResult] = useState(null); // Kết quả thi
  const [showResultsModal, setShowResultsModal] = useState(false); // Trạng thái mở modal kết quả

  useEffect(() => {
    if (timeLeft <= 0) {
      alert('Hết thời gian làm bài');
      navigate('/results');
    }
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer); // Dọn dẹp interval khi component bị unmount
  }, [timeLeft, navigate]);

  const handleSelectQuestion = (question) => {
    setSelectedQuestion(question);
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const handlePauseExam = () => {
    console.log('Bài thi đã tạm dừng');
    navigate('/exam');
  };

  const handleSubmitExam = () => {
    setOpenDialog(true); // Mở popup xác nhận nộp bài
  };

  const handleConfirmSubmit = () => {
    const examResult = {
      quizName: 'Bài thi Toán', // Tên bài thi, có thể lấy từ API hoặc trang hiện tại
      score: calculateScore(), // Hàm tính điểm (ví dụ)
      totalQuestion: questions.length,
      correctAnswer: calculateCorrectAnswers(), // Hàm tính số câu đúng
      examDuration: 60, // Thời gian làm bài (tính bằng phút)
      timeStart: new Date().toLocaleString(), // Thời gian bắt đầu
    };

    // Lưu kết quả vào localStorage
    const history = JSON.parse(localStorage.getItem('examHistory')) || [];
    history.push(examResult);
    localStorage.setItem('examHistory', JSON.stringify(history));

    // Cập nhật kết quả thi đã nộp và mở modal kết quả
    setExamResult(examResult);
    setShowResultsModal(true);
    setOpenDialog(false); // Đóng dialog xác nhận nộp bài
    console.log('Đã nộp bài thi, câu trả lời:', answers);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false); // Đóng popup nếu người dùng chọn Hủy
    navigate('/exam/doing');
  };

  const handleCloseResultsModal = () => {
    setShowResultsModal(false); // Đóng modal kết quả và chuyển hướng về trang kết quả
    navigate('/exam');
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const calculateScore = () => {
    // Hàm tính điểm số (Ví dụ: điểm số là số câu trả lời đúng)
    return Object.values(answers).filter(answer => answer === 'B').length;
  };

  const calculateCorrectAnswers = () => {
    // Hàm tính số câu trả lời đúng
    return Object.values(answers).filter(answer => answer === 'B').length;
  };

  return (
    <Box sx={{ padding: 1 }}>
      {/* Thời gian còn lại */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <Typography variant="h6" color="primary">
          Thời gian còn lại: {formatTime(timeLeft)}
        </Typography>
      </Box>

      <Container sx={{ marginTop: '50px' }}>
        <Grid container spacing={2}>
          {/* Phần nội dung câu hỏi */}
          <Grid item xs={9}>
            <Paper sx={{ padding: 1 }}>
              <Typography variant="h5" gutterBottom>
                Nội dung câu hỏi
              </Typography>
              <Typography variant="subtitle1">{selectedQuestion.question}</Typography>
              <FormControl component="fieldset">
                <RadioGroup
                  value={answers[selectedQuestion.id] || ''}
                  onChange={(e) => handleAnswerChange(selectedQuestion.id, e.target.value)}
                >
                  {selectedQuestion.options.map((option, index) => (
                    <FormControlLabel
                      key={index}
                      value={option}
                      control={<Radio />}
                      label={option}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </Paper>

            {/* Nút Tạm dừng và Nộp bài */}
            <Box sx={{ textAlign: 'center', marginTop: 2 }}>
              <Button
                variant="contained"
                color="error"
                onClick={handlePauseExam}
                sx={{ marginRight: 2 }}
              >
                Tạm dừng
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmitExam}
                sx={{ marginRight: 2 }}
              >
                Nộp bài
              </Button>
            </Box>
          </Grid>

          {/* Phần danh sách câu hỏi */}
          <Grid item xs={3}>
            <Typography variant="h6" gutterBottom>
              Danh sách câu hỏi
            </Typography>
            <List>
              {questions.map((question) => (
                <ListItem
                  key={question.id}
                  button
                  selected={selectedQuestion.id === question.id}
                  onClick={() => handleSelectQuestion(question)}
                  sx={{ backgroundColor: selectedQuestion.id === question.id ? '#dde' : 'transparent', marginBottom: 1 }}
                >
                  <ListItemText primary={`Câu ${question.id}`} />
                  {/* Hiển thị dấu tích khi câu hỏi đã được chọn đáp án */}
                  {answers[question.id] && (
                    <Typography variant="body2" color="green" sx={{ fontWeight: 'bold', marginLeft: '8px' }}>
                      ✔
                    </Typography>
                  )}
                </ListItem>
              ))}
            </List>
          </Grid>
        </Grid>
      </Container>

      {/* Popup xác nhận nộp bài */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Bạn chắc chắn muốn nộp bài?</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Bạn sẽ không thể thay đổi câu trả lời sau khi nộp bài.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Hủy
          </Button>
          <Button onClick={handleConfirmSubmit} color="success">
            Đồng ý
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal kết quả thi */}
      {showResultsModal && (
        <ResultsModal examResult={examResult} onClose={handleCloseResultsModal} />
      )}
    </Box>
  );
};

export default ExamDoingPage;

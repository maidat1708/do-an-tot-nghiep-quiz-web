import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Box, Paper, Grid, Container, List, ListItem, ListItemText, Radio, RadioGroup, FormControlLabel, FormControl, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import ResultsModal from '../../components/ResultsModal'; 

const questions = [
  { id: 1, question: 'Câu hỏi 1 : Nội dung câu hỏi...', options: ['A', 'B', 'C', 'D'] },
  { id: 2, question: 'Câu hỏi 2 : Nội dung câu hỏi...', options: ['A', 'B', 'C', 'D'] },
  { id: 3, question: 'Câu hỏi 3 : Nội dung câu hỏi...', options: ['A', 'B', 'C', 'D'] },
  { id: 4, question: 'Câu hỏi 4 : Nội dung câu hỏi...', options: ['A', 'B', 'C', 'D'] },
  { id: 5, question: 'Câu hỏi 5 : Nội dung câu hỏi...', options: ['A', 'B', 'C', 'D'] },
  { id: 6, question: 'Câu hỏi 6 : Nội dung câu hỏi...', options: ['A', 'B', 'C', 'D'] },
  { id: 7, question: 'Câu hỏi 7 : Nội dung câu hỏi...', options: ['A', 'B', 'C', 'D'] },
  { id: 8, question: 'Câu hỏi 8 : Nội dung câu hỏi...', options: ['A', 'B', 'C', 'D'] },
  { id: 9, question: 'Câu hỏi 9 : Nội dung câu hỏi...', options: ['A', 'B', 'C', 'D'] },
  { id: 10, question: 'Câu hỏi 10 : Nội dung câu hỏi...', options: ['A', 'B', 'C', 'D'] },
  // Thêm các câu hỏi khác
];

const ExamDoingPage = () => {
  const navigate = useNavigate();
  const timer = useRef(null);
  const questionRefs = useRef([]); // Tham chiếu cho các câu hỏi để cuộn đến câu hỏi tiếp theo

  const duration = 60; // Tổng thời gian bài thi (phút)
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
    // Chỉ tạo interval nếu modal không mở
    if (!showResultsModal) {
      timer.current = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    }

    return () => {
      // Clear interval when component unmounts or when modal is opened
      if (timer.current) {
        clearInterval(timer.current);
      }
    };
  }, [timeLeft, navigate, showResultsModal]);

  const handleSelectQuestion = (questionId) => {
    const question = questions.find((q) => q.id === questionId);
    setSelectedQuestion(question);
    // Cuộn đến câu hỏi khi người dùng chọn câu hỏi
    questionRefs.current[questionId - 1]?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const handlePauseExam = () => {
    console.log('Bài thi đã tạm dừng');
    navigate('/exam');
  };

  const handleSubmit = () => {
    setOpenDialog(true); // Mở popup xác nhận nộp bài
  };

  const formatExamDuration = (examDuration) => {
    const minutes = Math.floor(examDuration); // Lấy phần nguyên là phút
    const seconds = Math.round((examDuration - minutes) * 60); // Phần dư là giây
    return `${minutes} phút ${seconds < 10 ? '0' : ''}${seconds} giây`;
  };

  const ConfirmSubmit = () => {
    const formattedDuration = formatExamDuration(((duration * 60 - timeLeft) / 60).toFixed(2)); // Chuyển đổi thành phút và giây
    const examResult = {
      quizName: 'Bài thi Toán', // Tên bài thi, có thể lấy từ API hoặc trang hiện tại
      score: calculateScore(), // Hàm tính điểm (ví dụ)
      totalQuestion: questions.length,
      correctAnswer: calculateCorrectAnswers(), // Hàm tính số câu đúng
      examDuration: formattedDuration, 
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
    if (timer.current) clearInterval(timer.current); // Dừng đếm thời gian khi nộp bài
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
    return (calculateCorrectAnswers() / questions.length) * 10;
  };

  const calculateCorrectAnswers = () => {
    // Hàm tính số câu trả lời đúng
    return Object.values(answers).filter(answer => answer === 'B').length;
  };

  const handleBack = () => {
    const currentIndex = questions.findIndex(q => q.id === selectedQuestion.id);
    if (currentIndex > 0) {
      setSelectedQuestion(questions[currentIndex - 1]);
      questionRefs.current[currentIndex - 1]?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  const handleNext = () => {
    const currentIndex = questions.findIndex(q => q.id === selectedQuestion.id);
    if (currentIndex < questions.length - 1) {
      setSelectedQuestion(questions[currentIndex + 1]);
      questionRefs.current[currentIndex + 1]?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
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
              {/* Nút Back và Next */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                <Button variant="contained" color="primary" disabled={selectedQuestion.id === 1} onClick={handleBack}>
                  &lt; Quay lại
                </Button>
                <Button variant="contained" color="primary" disabled={selectedQuestion.id === questions.length} onClick={handleNext}>
                  Tiếp theo &gt;
                </Button>
              </Box>
            </Paper>

            {/* Nút Tạm dừng và Nộp bài */}
            <Box sx={{ textAlign: 'center', marginTop: 2 }}>
              <Button variant="contained" color="error" onClick={handlePauseExam}sx={{ marginRight: 2 }}>
                Tạm dừng
              </Button>
              <Button variant="contained" color="success" onClick={handleSubmit} sx={{ marginRight: 2 }}>
                Nộp bài
              </Button>
            </Box>
          </Grid>

          {/* Phần danh sách câu hỏi */}
          <Grid item xs={3} sx={{ height: '500px', overflowY: 'auto' }}>
            <Paper sx={{ padding: 1 }}>
              <Typography variant="h5" gutterBottom>
                Danh sách câu hỏi
              </Typography>
                <Box sx={{ maxHeight: '100%', overflowY: 'auto' }}>
                  <List>
                    {questions.map((question, index) => (
                      <ListItem
                        key={question.id}
                        button
                        onClick={() => handleSelectQuestion(question.id)}
                        ref={(el) => questionRefs.current[index] = el}
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
              </Box>
            </Paper>
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
          <Button onClick={ConfirmSubmit} color="success">
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

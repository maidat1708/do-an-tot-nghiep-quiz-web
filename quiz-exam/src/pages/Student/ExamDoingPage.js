import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Typography, Box, Paper, Grid, Container, List, ListItem, ListItemText, Radio, RadioGroup, FormControlLabel, FormControl, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import ResultsModal from '../../components/ResultsModal';
import { toast } from 'react-toastify';

const ExamDoingPage = () => {
  const navigate = useNavigate();
  const { quizId } = useParams();
  
  const timer = useRef(null);
  const questionRefs = useRef([]);
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [examResult, setExamResult] = useState(null);
  const [showResultsModal, setShowResultsModal] = useState(false);

  const fetchQuizData = async () => {
    try {
      const response = await fetch(`http://26.184.129.66:8080/api/v1/quizzes/${quizId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.code === 200) {
        setQuiz(data.result);
        setQuestions(data.result.questionHistories);
        setSelectedQuestion(data.result.questionHistories[0]);
        setTimeLeft(data.result.duration * 60);
      }
    } catch (error) {
      toast.error('Lỗi khi tải thông tin bài thi');
    }
  };

  useEffect(() => {
    fetchQuizData();
  }, [quizId]);

  useEffect(() => {
    if (quiz && !showResultsModal && timeLeft > 0) {
      timer.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer.current);
            toast.warning('Hết thời gian làm bài');
            handleSubmit(); // Nộp bài khi hết giờ
            return 0; // Đảm bảo không giảm xuống âm
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer.current) {
        clearInterval(timer.current);
      }
    };
  }, [timeLeft, showResultsModal]);

  const handleSelectQuestion = (questionId) => {
    const question = questions.find((q) => q.id === questionId);
    setSelectedQuestion(question);
    questionRefs.current[questionId]?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const handleAnswerChange = (questionId, answerId) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: {
        questionId: parseInt(questionId),
        answerId: parseInt(answerId),
        isChoose: true
      }
    }));
  };

  
  const handlePauseExam = () => {
    console.log('Bài thi đã tạm dừng');
    navigate('/exam');
  };

  const handleSubmit = async () => {
    try {
      const submitData = {
        quizId: parseInt(quizId),
        answers: Object.values(answers)
      };

      const response = await fetch('http://26.184.129.66:8080/api/v1/quiz-histories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(submitData)
      });

      if (response.ok) {
        const result = await response.json();
        setExamResult(result.result);
        setShowResultsModal(true);
        if (timer.current) clearInterval(timer.current);
      } else {
        toast.error('Lỗi khi nộp bài thi');
      }
    } catch (error) {
      toast.error('Lỗi khi nộp bài thi');
    }
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
    
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <Typography variant="h6" color="primary">
          Thời gian còn lại: {formatTime(timeLeft)}
        </Typography>
      </Box>

      {quiz && (
        <Container>
          <Typography variant="h4" gutterBottom align="center">
            {quiz.quizName}
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={9}>
              <Paper sx={{ padding: 2 }}>
                {selectedQuestion && (
                  <>
                    <Typography variant="h6" gutterBottom>
                      Câu {questions.indexOf(selectedQuestion) + 1}: {selectedQuestion.questionText}
                    </Typography>
                    <FormControl component="fieldset">
                      <RadioGroup
                        value={answers[selectedQuestion.id]?.answerId || ''}
                        onChange={(e) => handleAnswerChange(selectedQuestion.id, e.target.value)}
                      >
                        {selectedQuestion.answerHistories.map((answer) => (
                          <FormControlLabel
                            key={answer.id}
                            value={answer.id}
                            control={<Radio />}
                            label={answer.answerText}
                          />
                        ))}
                      </RadioGroup>
                    </FormControl>
                  </>
                )}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                <Button variant="contained" color="primary" disabled={questions.findIndex(q => q.id === selectedQuestion?.id) === 0} onClick={handleBack}>
                  &lt; Quay lại
                </Button>
                <Button variant="contained" color="primary" disabled={questions.findIndex(q => q.id === selectedQuestion?.id) === questions.length - 1} onClick={handleNext}>
                  Tiếp theo &gt;
                </Button>
              </Box>
              </Paper>
              {/* Nút Tạm dừng và Nộp bài */}
            <Box sx={{ textAlign: 'center', marginTop: 2 }}>
              <Button variant="contained" color="error" onClick={handlePauseExam}sx={{ marginRight: 2 }}>
                Tạm dừng
              </Button>
              <Button
              variant="contained"
              color="success"
              onClick={() => setOpenDialog(true)}
            >
              Nộp bài
            </Button>
            </Box>
            </Grid>

            <Grid item xs={3}>
              <Paper sx={{ padding: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Danh sách câu hỏi
                </Typography>
                <List>
                  {questions.map((question, index) => (
                    <ListItem
                      key={question.id}
                      button
                      onClick={() => handleSelectQuestion(question.id)}
                      ref={(el) => questionRefs.current[question.id] = el}
                      sx={{
                        backgroundColor: selectedQuestion?.id === question.id ? '#e3f2fd' : 'transparent',
                        marginBottom: 1
                      }}
                    >
                      <ListItemText primary={`Câu ${index + 1}`} />
                      {answers[question.id] && (
                        <Typography variant="body2" color="success.main" sx={{ fontWeight: 'bold', marginLeft: '8px'}}>✔</Typography>
                      )}
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
          </Grid>

        </Container>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Bạn chắc chắn muốn nộp bài?</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Bạn sẽ không thể thay đổi câu trả lời sau khi nộp bài.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}  color="primary">Hủy</Button>
          <Button onClick={handleSubmit} color="success">
            Đồng ý
          </Button>
        </DialogActions>
      </Dialog>

      {showResultsModal && examResult && (
        <ResultsModal
          open={showResultsModal}
          onClose={() => {
            setShowResultsModal(false);
            navigate('/exam');
          }}
          result={examResult}
        />
      )}
    </Box>
  );
};

export default ExamDoingPage;

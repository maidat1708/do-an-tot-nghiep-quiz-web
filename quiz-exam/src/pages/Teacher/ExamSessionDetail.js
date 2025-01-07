import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Radio,
  FormControlLabel,
  RadioGroup,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress
} from '@mui/material';
import { toast } from 'react-toastify';
import { ExpandMore } from '@mui/icons-material';
import ExamSessionStats from '../../components/ExamSessionStats';

const ExamSessionDetail = () => {
  const { examSessionId } = useParams();
  const navigate = useNavigate();
  const [examSession, setExamSession] = useState(null);
  const [results, setResults] = useState([]);
  const [openStats, setOpenStats] = useState(false);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch thông tin chi tiết ca thi
  useEffect(() => {
    const fetchExamSessionDetail = async () => {
      try {
        const response = await fetch(
          `http://26.184.129.66:8080/api/v1/exam-sessions/${examSessionId}`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        const data = await response.json();
        if (data.code === 200) {
          setExamSession(data.result);
        } else {
          toast.error('Không thể tải thông tin ca thi');
        }
      } catch (error) {
        toast.error('Lỗi kết nối server');
      }
    };

    fetchExamSessionDetail();
  }, [examSessionId]);

  // Thêm hàm fetch kết quả thi
  useEffect(() => {
    const fetchExamSessionResults = async () => {
      try {
        const response = await fetch(
          `http://26.184.129.66:8080/api/v1/results/exam-session/${examSessionId}`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        const data = await response.json();
        if (data.code === 200) {
          setResults(data.result);
        } else {
          toast.error('Lỗi khi tải kết quả thi');
        }
      } catch (error) {
        toast.error('Lỗi kết nối server');
      }
    };

    fetchExamSessionResults();
  }, [examSessionId]);

  // Thêm hàm combine data
  const combineStudentsAndResults = () => {
    return examSession.students.map(student => {
      const result = results.find(r => r.user.id === student.id);
      return {
        id: student.id,
        username: student.username,
        fullName: student.profile.firstName + ' ' + student.profile.lastName,
        email: student.profile.email,
        status: result ? 'Đã thi' : 'Chưa thi'
      };
    });
  };

  // Format datetime
  const formatDateTime = (dateTimeStr) => {
    return new Date(dateTimeStr).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const fetchResults = async () => {
    try {
      const response = await fetch(
        `http://26.184.129.66:8080/api/v1/exam-sessions/${examSessionId}/results`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      const data = await response.json();
      if (data.code === 200) {
        setResults(data.result);
      }
    } catch (error) {
      toast.error('Lỗi khi tải kết quả');
    }
  };

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://26.184.129.66:8080/api/v1/exam-sessions/${examSessionId}/stats`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      const data = await response.json();
      if (data.code === 200) {
        setStats(data.result);
        setOpenStats(true);
      } else {
        toast.error(data.message || 'Lỗi khi tải thống kê');
      }
    } catch (error) {
      toast.error('Lỗi khi tải thống kê');
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenStats = () => {
    if (!stats) {
      fetchStats();
    } else {
      setOpenStats(true);
    }
  };

  if (!examSession) {
    return <Typography>Đang tải...</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Typography variant="h4" gutterBottom>
        Chi tiết ca thi
      </Typography>

      {/* Thông tin cơ bản */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>
              <strong>Tên ca thi:</strong> {examSession.name}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              <strong>Bài thi:</strong> {examSession.quiz.quizName}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              <strong>Thời gian bắt đầu:</strong> {formatDateTime(examSession.startTime)}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              <strong>Thời gian kết thúc:</strong> {formatDateTime(examSession.endTime)}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>
              <strong>Số câu hỏi:</strong> {examSession.quiz.totalQuestion}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              <strong>Thời gian làm bài:</strong> {examSession.quiz.duration} phút
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              <strong>Số học sinh:</strong> {examSession.students.length}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Thêm phần hiển thị đề thi */}
      <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
        Nội dung đề thi
      </Typography>
      <Paper sx={{ p: 3, mb: 3 }}>
        {examSession.quiz.questionHistories.map((question, qIndex) => (
          <Accordion key={question.id} sx={{ mb: 1 }}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography>
                <strong>Câu {qIndex + 1}:</strong> {question.questionText}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <RadioGroup>
                {question.answerHistories.map((answer) => (
                  <FormControlLabel
                    key={answer.id}
                    value={answer.id.toString()}
                    control={
                      <Radio 
                        checked={answer.isCorrect === 1}
                        color="success"
                        disabled
                      />
                    }
                    label={
                      <Typography 
                        sx={{ 
                          color: answer.isCorrect === 1 ? 'success.main' : 'inherit',
                          fontWeight: answer.isCorrect === 1 ? 'bold' : 'normal'
                        }}
                      >
                        {answer.answerText}
                      </Typography>
                    }
                  />
                ))}
              </RadioGroup>
              {question.explanation && (
                <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    <strong>Giải thích:</strong> {question.explanation}
                  </Typography>
                </Box>
              )}
            </AccordionDetails>
          </Accordion>
        ))}
      </Paper>

      {/* Danh sách giáo viên */}
      <Typography variant="h6" gutterBottom>
        Giáo viên phụ trách
      </Typography>
      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>STT</TableCell>
              <TableCell>Tên đăng nhập</TableCell>
              <TableCell>Họ và tên</TableCell>
              <TableCell>Email</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {examSession.teachers.map((teacher, index) => (
              <TableRow key={teacher.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{teacher.username}</TableCell>
                <TableCell>{teacher.profile.firstName} {teacher.profile.lastName}</TableCell>
                <TableCell>{teacher.profile.email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Danh sách học sinh */}
      <Typography variant="h6" gutterBottom>
        Danh sách học sinh
      </Typography>
      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>STT</TableCell>
              <TableCell>Tên đăng nhập</TableCell>
              <TableCell>Họ và tên</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Trạng thái</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {combineStudentsAndResults().map((student, index) => (
              <TableRow 
                key={student.id}
                sx={{ 
                  backgroundColor: student.status === 'Chưa thi' ? '#fff3e0' : 'inherit'
                }}
              >
                <TableCell>{index + 1}</TableCell>
                <TableCell>{student.username}</TableCell>
                <TableCell>{student.fullName}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>
                  <Chip 
                    label={student.status}
                    color={student.status === 'Đã thi' ? 'success' : 'warning'}
                    size="small"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Nút điều hướng */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => navigate('/exam-sessions')}
        >
          Quay lại
        </Button>
        <Button 
          variant="contained" 
          color="success"
          onClick={() => navigate(`/exam-session/results/${examSessionId}`)}
        >
          Xem kết quả
        </Button>
      </Box>

      <Button
        variant="contained"
        color="primary"
        onClick={handleOpenStats}
        disabled={loading}
        startIcon={loading && <CircularProgress size={20} color="inherit" />}
      >
        {loading ? 'Đang tải...' : 'Xem Thống Kê'}
      </Button>

      <Dialog
        open={openStats}
        onClose={() => setOpenStats(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          Thống Kê Kết Quả Ca Thi
        </DialogTitle>
        <DialogContent>
          {stats && <ExamSessionStats stats={stats} />}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenStats(false)}>
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ExamSessionDetail; 
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Typography, Button, Chip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Tooltip
} from "@mui/material";
import ResultsModal from "../../components/ResultsModal";
import { toast } from 'react-toastify';
import { Visibility, Assessment as AssessmentIcon } from '@mui/icons-material';
import ExamSessionStats from '../../components/ExamSessionStats';

const ExamSessionResults = () => {
  const { examSessionId } = useParams();
  const [results, setResults] = useState([]);
  const [examSession, setExamSession] = useState(null);
  const [selectedResult, setSelectedResult] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [allStudents, setAllStudents] = useState([]);
  const [openStats, setOpenStats] = useState(false);
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchExamSessionResults();
    fetchExamSessionDetails();
  }, [examSessionId]);

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

  const fetchExamSessionDetails = async () => {
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
        setAllStudents(data.result.students);
      }
    } catch (error) {
      toast.error('Lỗi khi tải thông tin ca thi');
    }
  };

  const formatDateTime = (dateTimeStr) => {
    return new Date(dateTimeStr).toLocaleString('vi-VN');
  };

  const handleStudentClick = (result) => {
    setSelectedResult(result);
    setShowPopup(true);
  };

  const combineStudentsAndResults = () => {
    return allStudents.map(student => {
      const result = results.find(r => r.user.id === student.id);
      return {
        id: student.id,
        username: student.username,
        fullName: student.profile.firstName + ' ' + student.profile.lastName,
        status: result ? 'Đã thi' : 'Chưa thi',
        score: result ? result.score : '-',
        correctAnswer: result ? result.correctAnswer : '-',
        totalQuestion: result ? result.totalQuestion : '-',
        examDuration: result ? result.examDuration : '-',
        result: result
      };
    });
  };

  const fetchStats = async () => {
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
        toast.error('Lỗi khi tải thống kê');
      }
    } catch (error) {
      toast.error('Lỗi kết nối server');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {examSession && (
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h4" gutterBottom>
              Kết quả ca thi: {examSession.name}
            </Typography>
            <Tooltip title="Xem thống kê">
              <Button
                variant="contained"
                color="primary"
                startIcon={<AssessmentIcon />}
                onClick={fetchStats}
                sx={{ mb: 2 }}
              >
                Thống kê
              </Button>
            </Tooltip>
          </Box>
          <Typography variant="subtitle1">
            Bài thi: {examSession.quiz.quizName}
          </Typography>
          <Typography variant="subtitle1">
            Thời gian: {formatDateTime(examSession.startTime)} - {formatDateTime(examSession.endTime)}
          </Typography>
        </Box>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>STT</TableCell>
              <TableCell>Tên đăng nhập</TableCell>
              <TableCell>Họ và tên</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Điểm</TableCell>
              <TableCell>Số câu đúng</TableCell>
              <TableCell>Tổng số câu</TableCell>
              <TableCell>Thời gian làm bài</TableCell>
              <TableCell>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {combineStudentsAndResults().map((row, index) => (
              <TableRow 
                key={row.id}
                sx={{ 
                  backgroundColor: row.status === 'Chưa thi' ? '#fff3e0' : 'inherit'
                }}
              >
                <TableCell>{index + 1}</TableCell>
                <TableCell>{row.username}</TableCell>
                <TableCell>{row.fullName}</TableCell>
                <TableCell>
                  <Chip 
                    label={row.status}
                    color={row.status === 'Đã thi' ? 'success' : 'warning'}
                    size="small"
                  />
                </TableCell>
                <TableCell>{row.score}</TableCell>
                <TableCell>{row.correctAnswer}</TableCell>
                <TableCell>{row.totalQuestion}</TableCell>
                <TableCell>
                  {row.examDuration !== '-' 
                    ? `${Math.floor(row.examDuration / 60)}:${String(row.examDuration % 60).padStart(2, '0')}`
                    : '-'
                  }
                </TableCell>
                <TableCell>
                  {row.status === 'Đã thi' && (
                    <IconButton 
                      size="small"
                      onClick={() => {
                        setSelectedResult(row.result);
                        setShowPopup(true);
                      }}
                    >
                      <Visibility />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => navigate('/exam-sessions')}
          sx={{ minWidth: '120px' }}
        >
          Đóng
        </Button>
      </Box>

      <Dialog
        open={openStats}
        onClose={() => setOpenStats(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          Thống kê chi tiết kết quả thi
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

      {showPopup && selectedResult && (
        <ResultsModal
          open={showPopup}
          onClose={() => setShowPopup(false)}
          result={selectedResult}
        />
      )}
    </Box>
  );
};

export default ExamSessionResults; 
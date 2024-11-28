import React, { useState, useEffect } from "react";
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

const ExamPage = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);

  // Fetch quizzes khi component mount
  useEffect(() => {
    fetchQuizzes();
  }, []);

  // Lấy danh sách bài thi
  const fetchQuizzes = async () => {
    try {
      const response = await fetch('http://26.184.129.66:8080/api/v1/quizzes', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.code === 200) {
        setQuizzes(data.result);
      }
    } catch (error) {
      toast.error('Lỗi khi tải danh sách bài thi');
    }
  };

  // Xử lý khi nhấn nút "Bắt đầu làm bài"
  const handleStartExam = (quiz) => {
    navigate(`/exam/doing/${quiz.id}`);
  };

  return (
    <Box sx={{ p: 3 }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Danh sách bài thi</h1>

      {quizzes.length === 0 ? (
        <p style={{ textAlign: "center", fontSize: "16px" }}>Không có bài thi nào.</p>
      ) : (
        <TableContainer component={Paper} style={{ width: "90%", margin: "auto" }}>
          <Table>
            <TableHead>
              <TableRow style={{ background: "#F7F7F7" }}>
                <TableCell align="center" style={{ fontWeight: "bold", fontSize: "16px" }}>
                  Môn học
                </TableCell>
                <TableCell align="center" style={{ fontWeight: "bold", fontSize: "16px" }}>
                  Tên bài thi
                </TableCell>
                <TableCell align="center" style={{ fontWeight: "bold", fontSize: "16px" }}>
                  Thời gian (phút)
                </TableCell>
                <TableCell align="center" style={{ fontWeight: "bold", fontSize: "16px" }}>
                  Số câu hỏi
                </TableCell>
                <TableCell align="center" style={{ fontWeight: "bold", fontSize: "16px" }}>
                  Làm bài
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {quizzes.map((quiz) => (
                <TableRow key={quiz.id}>
                  <TableCell align="center" style={{ fontSize: "14px" }}>
                    {quiz.subject.subjectName}
                  </TableCell>
                  <TableCell align="center" style={{ fontSize: "14px" }}>
                    {quiz.quizName}
                  </TableCell>
                  <TableCell align="center" style={{ fontSize: "14px" }}>
                    {quiz.duration}
                  </TableCell>
                  <TableCell align="center" style={{ fontSize: "14px" }}>
                    {quiz.totalQuestion}
                  </TableCell>
                  <TableCell align="center">
                    <button
                      onClick={() => handleStartExam(quiz)}
                      style={{
                        backgroundColor: "#4CAF50",
                        color: "white",
                        padding: "5px 10px",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                    >
                      Bắt đầu làm bài
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default ExamPage;

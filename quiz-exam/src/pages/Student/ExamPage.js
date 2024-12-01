import React, { useState, useEffect } from "react";
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Pagination, Select, MenuItem, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

const ExamPage = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState(subjects.length > 0 ? subjects[0].id : null);
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [pageSize, setPageSize] = useState(5); // Số lượng hiển thị mỗi trang
 
  // Nếu danh sách subjects thay đổi, tự động chọn môn đầu tiên
  useEffect(() => {
    if (subjects.length > 0) {
      setSelectedSubjectId(subjects[0].id);
    }
  }, [subjects]);

  const filteredQuizzes = selectedSubjectId ? quizzes.filter((q) => q.subject.id === selectedSubjectId) : quizzes;

  // Fetch quizzes khi component mount
  useEffect(() => {
    fetchQuizzes();
    fetchSubjects();
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

  // Lấy danh sách môn học
  const fetchSubjects = async () => {
    try {
      const response = await fetch('http://26.184.129.66:8080/api/v1/subjects', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setSubjects(data.result);
    } catch (error) {
      toast.error('Lỗi khi tải danh sách môn học');
    }
  };

  // Xử lý khi nhấn nút "Bắt đầu làm bài"
  const handleStartExam = (quiz) => {
    navigate(`/exam/doing/${quiz.id}`);
  };

  // Tính toán dữ liệu phân trang
  const paginatedQuizzes = filteredQuizzes.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalPages = Math.ceil(filteredQuizzes.length / pageSize); // Tổng số trang

  // Xử lý thay đổi trang
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // Xử lý thay đổi số lượng hiển thị mỗi trang
  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value);
    setCurrentPage(1); // Reset về trang đầu tiên
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <Box
      sx={{
        width: '15%',
        backgroundColor: '#fff',
        padding: '10px',
        borderRadius: '8px',
        border: '1px solid #ccc',
      }}
      >     
        <Box sx={{
          backgroundColor: '#f5f5f5',
          padding: '10px',
          borderRadius: '4px',
          fontWeight: 'bold',
          textAlign: 'center',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          marginBottom: '10px',
        }}
        >
          Môn học
        </Box>
        {subjects.map((subject) => (
          <Box
            key={subject.id}
            sx={{
              backgroundColor: subject.id === selectedSubjectId ? '#BFEFFF' : '#f5f5f5', // Màu nền thay đổi khi được chọn
              padding: '10px', marginBottom: '8px', borderRadius: '4px',
              textAlign: 'center', cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.1)', // Hiệu ứng bóng
              '&:hover': {
                backgroundColor: subject.id === selectedSubjectId ? '#BFEFFF' : '#e0e0e0', // Hover vẫn giữ được màu nếu chọn
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)', // Hiệu ứng bóng khi hover
              },
            }}
            onClick={() => setSelectedSubjectId(subject.id)}
          >
            <Typography>
              {subject.subjectName}
            </Typography>
          </Box>
        ))}
      </Box>  

      {/* Main Content */}
      <Box sx={{ flex: 1,p: 3 }}>
        <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Danh sách bài thi</h1>
        <TableContainer component={Paper} style={{ width: "90%", margin: "auto" }}>
          <Table
            quizzes={paginatedQuizzes} 
            currentPage={currentPage} // Truyền trang hiện tại
            pageSize={pageSize}
          >
            <TableHead>
              <TableRow style={{ background: "#F7F7F7" }}>
                <TableCell align="center" style={{ fontWeight: "bold", fontSize: "16px" }}>
                  Tên bài thi
                </TableCell>
                <TableCell align="center" style={{ fontWeight: "bold", fontSize: "16px" }}>
                  Môn học
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
              {filteredQuizzes.map((quiz, localIndex) => {
                const globalIndex = (currentPage - 1) * pageSize + localIndex;
                return (
                  <TableRow key={globalIndex}>
                    <TableCell align="center" style={{ fontSize: "14px" }}>
                      {quiz.quizName}
                    </TableCell>
                    <TableCell align="center" style={{ fontSize: "14px" }}>
                      {quiz.subject.subjectName}
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
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        {filteredQuizzes.length > 0 ? ( // Kiểm tra nếu danh sách không rỗng thì hiển thị phân trang
          <>
            <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", mt: 2 }}>
              <Pagination
                count={totalPages} 
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                sx={{ mr: 2, display: 'flex', justifyContent: 'center' }}
              />
              <Select
                value={pageSize}
                onChange={handlePageSizeChange}
                size="small"
                sx={{ minWidth: "100px" }}
              >
                {[5, 10, 20, 30, 40, 50].map((size) => (
                  <MenuItem key={size} value={size}>
                    {size} / trang
                  </MenuItem>
                ))}
              </Select>
            </Box>
          </>
        ) : ( // Nếu danh sách trống thì hiển thị thông báo
          <Box sx={{ textAlign: "center", mt: 5 }}>
            <p>Hiện tại chưa có dữ liệu bài thi.</p>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ExamPage;

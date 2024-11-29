import React, { useState, useEffect } from "react";
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Pagination, Select, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

const ExamPage = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [pageSize, setPageSize] = useState(5); // Số lượng hiển thị mỗi trang
 
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

  // Tính toán dữ liệu phân trang
  const paginatedQuizzes = quizzes.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalPages = Math.ceil(quizzes.length / pageSize); // Tổng số trang

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
    <Box sx={{ p: 3 }}>
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
            {paginatedQuizzes.map((quiz) => (
              <TableRow key={quiz.id}>
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
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {quizzes.length > 0 ? ( // Kiểm tra nếu danh sách không rỗng thì hiển thị phân trang
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
  );
};

export default ExamPage;

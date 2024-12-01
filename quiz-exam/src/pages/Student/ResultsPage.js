import React, { useState, useEffect } from "react";
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Pagination, MenuItem, Select } from "@mui/material";
import ResultsModal from "../../components/ResultsModal";
import { useAuth } from "../../hooks/useAuth";
import { toast } from 'react-toastify';

const ResultsPage = () => {
  const [history, setHistory] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState(subjects.length > 0 ? subjects[0].id : null);
  const [showPopup, setShowPopup] = useState(false);
  const [quizzes, setQuizzes] = useState({});
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [pageSize, setPageSize] = useState(5); // Số lượng hiển thị mỗi trang

  // Nếu danh sách subjects thay đổi, tự động chọn kết quả môn đầu tiên
  useEffect(() => {
    if (subjects.length > 0) {
      setSelectedSubjectId(subjects[0].id);
    }
  }, [subjects]);

  const filteredHistory = selectedSubjectId ? history.filter((q) => q.subjectId === selectedSubjectId) : history;
  
  // Tính toán dữ liệu phân trang
  const paginatedResults = filteredHistory.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalPages = Math.ceil(filteredHistory.length / pageSize); // Tổng số trang

  // Xử lý thay đổi trang
  const handlePageChange = (event, value) => {
    setCurrentPage(value)
    console.log(filteredHistory)
  };

  // Xử lý thay đổi số lượng hiển thị
  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value);
    setCurrentPage(1); // Reset về trang đầu tiên
  };

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch(`http://26.184.129.66:8080/api/v1/results/user/${user.id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        if (data.code === 200) {
          setHistory(data.result);
          fetchQuizzes(data.result);
        } else {
          toast.error('Lỗi khi tải lịch sử bài thi');
        }
      } catch (error) {
        console.error("Error fetching results:", error);
        toast.error('Lỗi khi tải lịch sử bài thi');
      }
    };

    if (user?.id) {
      fetchResults();
      fetchSubjects();
    }
  }, [user]);

  const fetchSubjects = async () => {
    try {
      const response = await fetch('http://26.184.129.66:8080/api/v1/subjects', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setSubjects(data.result);
      console.log(data.result)
    } catch (error) {
      toast.error('Lỗi khi tải danh sách môn học');
    }
  };

  const fetchQuizzes = async (results) => {
    try {
      const quizIds = [...new Set(results.map(result => result.quizId))];
      const quizData = {};
      
      await Promise.all(quizIds.map(async (quizId) => {
        const response = await fetch(`http://26.184.129.66:8080/api/v1/quizzes/${quizId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        if (data.code === 200) {
          quizData[quizId] = data.result;
        }
      }));
      
      setQuizzes(quizData);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    }
    console.log(quizzes)
  };

  const handleExamClick = (result) => {
    setSelectedResult(result);
    setShowPopup(true);
  };

  const formatDateTime = (dateTime) => {
    if (!dateTime) return "";
    const date = new Date(dateTime);
    return date.toLocaleString('vi-VN');
  };

  const formatDuration = (seconds) => {
    if (seconds === undefined || seconds === null) return "N/A";
    
    // Nếu duration = 0 thì set thành 1 giây
    if (seconds === 0) seconds = 1;
    
    // Tính giờ, phút, giây từ tổng số giây
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    // Format với padding 0
    const hoursStr = hours.toString().padStart(2, '0');
    const minutesStr = minutes.toString().padStart(2, '0');
    const secondsStr = remainingSeconds.toString().padStart(2, '0');

    // Trả về format hh:mm:ss
    return `${hoursStr}:${minutesStr}:${secondsStr}`;
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <Box
        sx={{
        width: '15%', backgroundColor: '#fff', padding: '10px', borderRadius: '8px', border: '1px solid #ccc',
      }}
      >     
        <Box sx={{
          backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '4px', fontWeight: 'bold',
          textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.2)', marginBottom: '10px',
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
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)', // Hiệu ứng bng khi hover
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
      <Box sx={{ flex: 1, p: 3 }}>
        <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Lịch sử kết quả thi</h1>
        <TableContainer component={Paper}>
          <Table
            results={paginatedResults} 
            currentPage={currentPage} // Truyền trang hiện tại
            pageSize={pageSize} >
            <TableHead>
              <TableRow style={{ background: "#F7F7F7" }}>
                <TableCell align="center" style={{ fontWeight: "bold", fontSize: "16px"}}>Mã đề thi</TableCell>
                <TableCell align="center" style={{ fontWeight: "bold", fontSize: "16px"}}>Môn học</TableCell>
                <TableCell align="center" style={{ fontWeight: "bold", fontSize: "16px"}}>Tên đề thi</TableCell>
                <TableCell align="center" style={{ fontWeight: "bold", fontSize: "16px"}}>Thời gian bắt đầu</TableCell>
                <TableCell align="center" style={{ fontWeight: "bold", fontSize: "16px"}}>Thời gian nộp bài</TableCell>
                <TableCell align="center" style={{ fontWeight: "bold", fontSize: "16px"}}>Thời gian làm bài</TableCell>
                <TableCell align="center" style={{ fontWeight: "bold", fontSize: "16px"}}>Điểm</TableCell>
                <TableCell align="center" style={{ fontWeight: "bold", fontSize: "16px"}}>Số câu đúng</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedResults.map((result, localIndex) => {
                const globalIndex = (currentPage - 1) * pageSize + localIndex;
                return (
                  <TableRow key={globalIndex}>
                    <TableCell align="center">{result.id}</TableCell>
                    <TableCell align="center">
                      {quizzes[result.quizId]?.subject?.subjectName || "N/A"}
                    </TableCell>
                    <TableCell
                      align="center"
                      onClick={() => handleExamClick(result)}
                      style={{
                        cursor: "pointer",
                        color: "#007BFF",
                        textDecoration: "underline",
                      }}
                    >
                      {result.quizName  || "N/A"}
                    </TableCell>
                    <TableCell align="center">{formatDateTime(result.timeStart)}</TableCell>
                    <TableCell align="center">{formatDateTime(result.submitTime)}</TableCell>
                    <TableCell align="center">{formatDuration(result.examDuration)}</TableCell>
                    <TableCell align="center">{result.score.toFixed(2)}</TableCell>
                    <TableCell align="center">{result.totalCorrect}/{result.totalQuestion}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        {paginatedResults.length > 0 ? ( // Kiểm tra nếu danh sách không rỗng thì hiển thị phân trang
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
                {[5,10, 20, 30, 40, 50].map((size) => (
                  <MenuItem key={size} value={size}>
                    {size} / trang
                  </MenuItem>
                ))}
              </Select>
            </Box>
          </>
        ) : ( // Nếu danh sách trống thì hiển thị thông báo
          <Box sx={{ textAlign: "center", mt: 5 }}>
            <p>Hiện tại chưa có dữ liệu kết quả thi.</p>
          </Box>
        )}

        {showPopup && selectedResult && (
          <ResultsModal
            open={showPopup}
            onClose={() => setShowPopup(false)}
            result={selectedResult}
          />
        )}
      </Box>
    </Box>
  );
};

export default ResultsPage;

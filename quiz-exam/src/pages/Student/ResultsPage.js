import React, { useState, useEffect } from "react";
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import ResultsModal from "../../components/ResultsModal";
import { useAuth } from "../../hooks/useAuth";
import { toast } from 'react-toastify';

const ResultsPage = () => {
  const [history, setHistory] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [quizzes, setQuizzes] = useState({});
  const { user } = useAuth();

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
    }
  }, [user]);

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
    <Box sx={{ p: 3 }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Lịch sử kết quả thi</h1>
      {history.length === 0 ? (
        <p style={{ textAlign: "center", fontSize: "16px" }}>Không có lịch sử thi.</p>
      ) : (
        <TableContainer component={Paper} style={{ width: "95%", margin: "auto", marginTop: "20px" }}>
          <Table>
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
              {history.map((result) => (
                <TableRow key={result.id}>
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
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

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

export default ResultsPage;

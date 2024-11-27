import React, { useState, useEffect } from "react";
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import ResultsModal from "../../components/ResultsModal";

const ResultsPage = () => {
  const [history, setHistory] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  // Giả lập dữ liệu lịch sử thi từ localStorage hoặc API
  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem("examHistory")) || [];
    setHistory(storedHistory);
  }, []);

  // Mở popup với kết quả chi tiết của bài thi đã chọn
  const handleExamClick = (examResult) => {
    setSelectedResult(examResult);
    setShowPopup(true);
  };

  return (
    <Box sx={{ p: 3 }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Lịch sử kết quả thi</h1>
      {history.length === 0 ? (
        <p style={{ textAlign: "center", fontSize: "16px" }}>Không có lịch sử thi.</p>
      ) : (
        <TableContainer component={Paper} style={{ width: "80%", margin: "auto", marginTop: "20px" }}>
          <Table>
            <TableHead>
              <TableRow style={{ background: "#F7F7F7" }}>
                <TableCell align="center" style={{ fontWeight: "bold", fontSize: "16px"}}>Tên bài thi</TableCell>
                <TableCell align="center" style={{ fontWeight: "bold", fontSize: "16px"}}>Thời gian bắt đầu</TableCell>
                <TableCell align="center" style={{ fontWeight: "bold", fontSize: "16px"}}>Điểm</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {history.map((examResult, index) => (
                <TableRow key={index}>
                  <TableCell
                    align="center"
                    onClick={() => handleExamClick(examResult)}
                    style={{
                      cursor: "pointer",
                      color: "#007BFF",
                      textDecoration: "underline",
                    }}
                  >
                    {examResult.quizName}
                  </TableCell>
                  <TableCell align="center">{examResult.timeStart}</TableCell>
                  <TableCell align="center">{examResult.score}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Modal hiển thị kết quả chi tiết */}
      {showPopup && selectedResult && (
        <ResultsModal
          examResult={selectedResult}
          onClose={() => setShowPopup(false)}
        />
      )}
    </Box>
  );
};

export default ResultsPage;

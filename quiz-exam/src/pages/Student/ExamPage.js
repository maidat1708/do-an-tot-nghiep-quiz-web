import React from "react";
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const ExamPage = () => {
  const navigate = useNavigate();

  // Giả lập thông tin bài thi
  const examDetails = [
    {
      subject: "Toán học 12",
      duration: "60 phút",
      description:
        "Bài thi trắc nghiệm môn Toán, bao gồm 30 câu hỏi với thời gian làm bài là 60 phút.",
    },
    {
      subject: "Vật lý 11",
      duration: "45 phút",
      description:
        "Bài thi trắc nghiệm môn Vật lý, bao gồm 20 câu hỏi với thời gian làm bài là 45 phút.",
    },
  ];

  // Xử lý khi nhấn nút "Bắt đầu làm bài"
  const handleStartExam = (exam) => {
    console.log(`Bắt đầu làm bài: ${exam.subject}`);
    navigate("/exam/doing");
  };

  return (
    <Box sx={{ p: 3 }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Danh sách bài thi</h1>

      {examDetails.length === 0 ? (
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
                  Thời gian
                </TableCell>
                <TableCell align="center" style={{ fontWeight: "bold", fontSize: "16px" }}>
                  Mô tả
                </TableCell>
                <TableCell align="center" style={{ fontWeight: "bold", fontSize: "16px" }}>
                  Làm bài
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {examDetails.map((exam, index) => (
                <TableRow key={index}>
                  <TableCell align="center" style={{ fontSize: "14px" }}>
                    {exam.subject}
                  </TableCell>
                  <TableCell align="center" style={{ fontSize: "14px" }}>
                    {exam.duration}
                  </TableCell>
                  <TableCell align="center" style={{ fontSize: "14px", padding: "10px" }}>
                    {exam.description}
                  </TableCell>
                  <TableCell align="center">
                    {/* <Button
                      variant="contained"
                      color="success"
                      size="small"
                      onClick={() => handleStartExam(exam)}
                    >
                      Bắt đầu làm bài
                    </Button> */}
                    <button
                      onClick={() => handleStartExam(exam)}
                      style={{
                        backgroundColor: "#4CAF50",color: "white",padding: "5px 10px",
                        border: "none",borderRadius: "5px",cursor: "pointer",
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

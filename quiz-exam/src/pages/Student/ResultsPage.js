import React, { useState, useEffect } from "react";
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
    <div style={{ padding: "20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
        Lịch sử kết quả thi
      </h1>

      {history.length === 0 ? (
        <p style={{ textAlign: "center" }}>Không có lịch sử thi.</p>
      ) : (
        <table
          border="1"
          style={{
            width: "90%",
            margin: "auto",
            textAlign: "center",
            justifyContent: "center",
          }}
        >
          <thead>
            <tr>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Tên bài thi</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Thời gian bắt đầu</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Điểm</th>
            </tr>
          </thead>
          <tbody>
            {history.map((examResult, index) => (
              <tr key={index}>
                <td
                  style={{ border: "1px solid #ddd", padding: "8px", cursor: "pointer", color: "#007BFF", textDecoration: "underline", }}
                  onClick={() => handleExamClick(examResult)}
                >
                  {examResult.quizName}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{examResult.timeStart}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{examResult.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal hiển thị kết quả chi tiết */}
      {showPopup && selectedResult && (
        <ResultsModal
          examResult={selectedResult}
          onClose={() => setShowPopup(false)}
        />
      )}
    </div>
  );
};

export default ResultsPage;

import React, { useState, useEffect } from 'react';
import ResultsModal from '../../components/ResultsModal';

const ResultsPage = () => {
  const [history, setHistory] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  // Giả lập dữ liệu lịch sử thi từ localStorage hoặc API
  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem('examHistory')) || [];
    setHistory(storedHistory);
  }, []);

  // Mở popup với kết quả của bài thi đã chọn
  const handleExamClick = (examResult) => {
    setSelectedResult(examResult);
    setShowPopup(true);
  };

  return (
    <div className="history-page">
      <h1>Lịch sử kết quả thi</h1>
      <div className="history-list">
        {history.length === 0 ? (
          <p>Không có lịch sử thi.</p>
        ) : (
          history.map((examResult, index) => (
            <div key={index} className="history-item" onClick={() => handleExamClick(examResult)}>
              <div className="exam-title">{examResult.quizName}</div>
              <div className="exam-date">{examResult.timeStart}</div>
              <div className="exam-score">Điểm: {examResult.score}</div>
              {/* <p><strong>{examResult.quizName}</strong></p>
              <p>Điểm: {examResult.score}</p>
              <p>Thời gian bắt đầu: {examResult.timeStart}</p> */}
            </div>
          ))
        )}
      </div>

      {showPopup && selectedResult && (
        <ResultsModal examResult={selectedResult} onClose={() => setShowPopup(false)} />
      )}
    </div>
  );
};

export default ResultsPage;

import React from 'react';
import '../styles/ModalStyles.css'; ; // Import file CSS

const ResultsModal = ({ examResult, onClose }) => {
  return (
    <div className="modal show">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>

        <h2>Kết quả thi: {examResult.quizName}</h2>
        <div className="result-item">
          <strong>Điểm số:</strong> {examResult.score}
        </div>
        <div className="result-item">
          <strong>Tổng số câu hỏi:</strong> {examResult.totalQuestion}
        </div>
        <div className="result-item">
          <strong>Số câu trả lời đúng:</strong> {examResult.correctAnswer}
        </div>
        <div className="result-item">
          <strong>Thời gian làm bài:</strong> {examResult.examDuration} 
        </div>
        <div className="result-item">
          <strong>Thời gian bắt đầu:</strong> {examResult.timeStart}
        </div>
      </div>
    </div>
  );
};

export default ResultsModal;

import React from "react";
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
    <div style={{ padding: "20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Danh sách bài thi</h1>

      {examDetails.length === 0 ? (
        <p style={{ textAlign: "center" }}>Không có bài thi nào.</p>
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
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Môn học</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Thời gian</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Mô tả</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>Làm bài</th>
            </tr>
          </thead>
          <tbody>
            {examDetails.map((exam, index) => (
              <tr key={index}>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{exam.subject}</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{exam.duration}</td>
                <td style={{ border: "1px solid #ddd", textAlign: "left", padding: "0 10px" }}>
                  {exam.description}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  <button
                    onClick={() => handleStartExam(exam)}
                    style={{
                      backgroundColor: "#4CAF50",color: "white",padding: "5px 10px",
                      border: "none",borderRadius: "5px",cursor: "pointer",
                    }}
                  >
                    Bắt đầu làm bài
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ExamPage;

import React from "react";
import "../styles/HomePage.css"; // Đảm bảo rằng file CSS nằm trong thư mục styles

const HomePage = () => {
  return (
    <div className="home-container">
      <div className="home-content">
        <h1>Chào mừng đến với hệ thống thi trắc nghiệm</h1>
        <p>
        Hệ thống thi trắc nghiệm được xây dựng nhằm cung cấp một giải pháp hiện đại, 
        hiệu quả và tiện lợi cho việc quản lý và tổ chức các kỳ thi trực tuyến. 
        Với giao diện thân thiện và các tính năng linh hoạt, hệ thống đáp ứng nhu cầu 
        của cả người dùng thông thường và quản trị viên, từ quản lý môn học, câu hỏi, 
        kho đề thi cho đến theo dõi kết quả chi tiết.
        </p>
      </div>
      <div className="home-image">
        <img
          src={require("../assets/background.jpg")}
          alt="Hệ thống thi trắc nghiệm"
        />
      </div>
    </div>
  );
};
export default HomePage;

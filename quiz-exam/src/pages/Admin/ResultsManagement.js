import React, { useState, useEffect } from "react";
import { FaEdit } from "react-icons/fa"; // Import icon
import Modal from "../../components/Modal"; // Import modal component

const ResultManagement = () => {
  const [results, setResults] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  // Xử lý mở popup chỉnh sửa điểm thi
  const handleEdit = (index) => {
    setEditingIndex(index);
    setModalOpen(true);
  };

  // Lưu kết quả thi sau khi chỉnh sửa điểm
  const handleSave = (data) => {
    const updatedResults = [...results];
    if (editingIndex !== null) {
      updatedResults[editingIndex] = data;
    }
    setResults(updatedResults);
    setModalOpen(false);
  };

  // useEffect(() => {
  //   // Giả sử API trả về danh sách kết quả thi của học sinh
  //   fetch("/api/results")
  //     .then((response) => response.json())
  //     .then((data) => setResults(data));
  // }, []);

  return (
    <div style={{ padding: "20px" }}>
      <ResultTable
        results={results}
        onEdit={handleEdit}
      />
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <ResultForm
          initialData={editingIndex !== null ? results[editingIndex] : null}
          onSave={handleSave}
        />
      </Modal>
    </div>
  );
};

// Component bảng hiển thị danh sách kết quả thi
const ResultTable = ({ results, onEdit }) => {
  return (
    <table
      border="1"
      style={{width: "80%", margin: "auto", textAlign: "center", justifyContent: "center",}}
    >
      <thead>
        <tr>
          <th style={{ border: "1px solid #ddd", padding: "8px" }}>Username</th>
          <th style={{ border: "1px solid #ddd", padding: "8px" }}>Họ</th>
          <th style={{ border: "1px solid #ddd", padding: "8px" }}>Tên</th>
          <th style={{ border: "1px solid #ddd", padding: "8px" }}>Môn học</th>
          <th style={{ border: "1px solid #ddd", padding: "8px" }}>Tên bài thi</th>
          <th style={{ border: "1px solid #ddd", padding: "8px" }}>Điểm</th>
          <th style={{ border: "1px solid #ddd", padding: "8px" }}>Hành động</th>
        </tr>
      </thead>
      <tbody>
        {results.map((result, index) => (
          <tr key={index}>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
              {result.username}
            </td>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
              {result.firstName}
            </td>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
              {result.lastName}
            </td>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
              {result.subject}
            </td>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
              {result.examName}
            </td>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
              {result.score}
            </td>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
              <button
                onClick={() => onEdit(index)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#4CAF50", // Màu xanh
                }}
              >
                <FaEdit size={18} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

// Form chỉnh sửa kết quả thi
const ResultForm = ({ initialData, onSave }) => {
  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    subject: "",
    examName: "",
    score: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: "10px" }}>
        <label style={{ display: "block", marginBottom: "5px" }}>Username:</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
          required
        />
      </div>
      <div style={{ marginBottom: "10px" }}>
        <label style={{ display: "block", marginBottom: "5px" }}>Họ:</label>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
          required
        />
      </div>
      <div style={{ marginBottom: "10px" }}>
        <label style={{ display: "block", marginBottom: "5px" }}>Tên:</label>
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
          required
        />
      </div>
      <div style={{ marginBottom: "10px" }}>
        <label style={{ display: "block", marginBottom: "5px" }}>Môn học:</label>
        <input
          type="text"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
          required
        />
      </div>
      <div style={{ marginBottom: "10px" }}>
        <label style={{ display: "block", marginBottom: "5px" }}>Tên bài thi:</label>
        <input
          type="text"
          name="examName"
          value={formData.examName}
          onChange={handleChange}
          style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
          required
        />
      </div>
      <div style={{ marginBottom: "10px" }}>
        <label style={{ display: "block", marginBottom: "5px" }}>Điểm:</label>
        <input
          type="number"
          name="score"
          value={formData.score}
          onChange={handleChange}
          style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
          required
        />
      </div>
      <button
        type="submit"
        style={{backgroundColor: "#d30000",color: "#fff",width: "50px",
          padding: "5px 10px",border: "none",borderRadius: "4px", cursor: "pointer",
        }}
      >
        Lưu
      </button>
    </form>
  );
};

export default ResultManagement;

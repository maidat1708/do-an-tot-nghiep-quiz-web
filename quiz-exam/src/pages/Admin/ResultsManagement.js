import React, { useState, useEffect } from "react";
import { Box, Paper, Table, TableBody, TableCell,TableContainer,TableHead,TableRow } from '@mui/material';
import { FaEdit } from "react-icons/fa"; // Import icons
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
    <TableContainer component={Paper} style = {{ width: "50%", margin: "auto", textAlign: "center", justifyContent: "center",}}>
      <Table>
        <TableHead>
          <TableRow style={{background: "#F7F7F7"}}>
            <TableCell>Username</TableCell>
            <TableCell>Tên</TableCell>
            <TableCell>Họ</TableCell>
            <TableCell>Môn học</TableCell>
            <TableCell>Tên bài thi</TableCell>
            <TableCell>Điểm</TableCell>
            <TableCell>Thao tác</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {results.map((result, index) => (
            <TableRow key={index}>
              <TableCell>{result.username}</TableCell>
              <TableCell>{result.firstName}</TableCell>
              <TableCell>{result.lastName}</TableCell>
              <TableCell>{result.subject}</TableCell>
              <TableCell>{result.examName}</TableCell>
              <TableCell>{result.score}</TableCell>
              <TableCell>
                <button
                  onClick={() => onEdit(index)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#4CAF50", // Màu xanh
                    marginRight: "10px",
                  }}
                >
                  <FaEdit size={18} />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
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

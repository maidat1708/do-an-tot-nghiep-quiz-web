import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa"; // Import icons
import Modal from "../../components/Modal"; // Import modal component

const SubjectManagement = () => {
  const [subjects, setSubjects] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  // Xử lý mở popup thêm mới
  const handleAdd = () => {
    setEditingIndex(null);
    setModalOpen(true);
  };

  // Xử lý chỉnh sửa
  const handleEdit = (index) => {
    setEditingIndex(index);
    setModalOpen(true);
  };

  // Xóa môn học
  const handleDelete = (index) => {
    const updatedSubjects = [...subjects];
    updatedSubjects.splice(index, 1);
    setSubjects(updatedSubjects);
  };

  // Lưu môn học sau khi thêm/sửa
  const handleSave = (data) => {
    const updatedSubjects = [...subjects];
    if (editingIndex !== null) {
      updatedSubjects[editingIndex] = data;
    } else {
      updatedSubjects.push(data);
    }
    setSubjects(updatedSubjects);
    setModalOpen(false);
  };

  return (
    <div style={{ padding: "20px" }}>
      <button
        onClick={handleAdd}
        style={{
          backgroundColor: "#d30000",
          color: "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: "5px",
          marginBottom: "30px",
          cursor: "pointer",
        }}
      >
        + Thêm mới
      </button>
      <SubjectTable
        subjects={subjects}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <SubjectForm
          initialData={editingIndex !== null ? subjects[editingIndex] : null}
          onSave={handleSave}
        />
      </Modal>
    </div>
  );
};

// Component bảng hiển thị danh sách môn học
const SubjectTable = ({ subjects, onEdit, onDelete }) => {
  return (
    <table
      border="1"
      style={{
        width: "80%",
        margin: "auto",
        textAlign: "center",
        justifyContent: "center",
      }}
    >
      <thead>
        <tr>
          <th style={{ border: "1px solid #ddd", padding: "8px" }}>Tên môn học</th>
          <th style={{ border: "1px solid #ddd", padding: "8px" }}>Mã</th>
          <th style={{ border: "1px solid #ddd", padding: "8px" }}>Hành động</th>
        </tr>
      </thead>
      <tbody>
        {subjects.map((subject, index) => (
          <tr key={index}>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
              {subject.name}
            </td>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
              {subject.code}
            </td>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
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
              <button
                onClick={() => onDelete(index)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#f44336", // Màu đỏ
                }}
              >
                <FaTrash size={18} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

// form thêm/sửa môn học
const SubjectForm = ({ initialData, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    isVisible: false,
    order: 1,
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: "10px" }}>
        <label style={{ display: "block", marginBottom: "5px" }}>
          Tên môn học:
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
          required
        />
      </div>
      <div style={{ marginBottom: "10px" }}>
        <label style={{ display: "block", marginBottom: "5px" }}>
          Mã môn học:
        </label>
        <input
          type="text"
          name="code"
          value={formData.code}
          onChange={handleChange}
          style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
          required
        />
      </div>
      <button
        type="submit"
        style={{
          backgroundColor: "#d30000",
          color: "#fff",
          width: "50px",
          padding: "5px 10px",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Lưu
      </button>
    </form>
  );
};

export default SubjectManagement;

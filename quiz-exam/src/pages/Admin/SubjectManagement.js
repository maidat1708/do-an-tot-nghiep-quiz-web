import React, { useState, useEffect } from "react";
import { Box, Paper, Table, TableBody, TableCell,TableContainer,TableHead,TableRow } from '@mui/material';
import { FaEdit, FaTrash } from "react-icons/fa"; // Import icons
import Modal from "../../components/Modal"; // Import modal component

const SubjectManagement = () => {
  const [subjects, setSubjects] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [isDeleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

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

  // Hiển thị popup xác nhận xóa
  const handleDeleteClick = (index) => {
    setDeleteIndex(index);
    setDeleteConfirmOpen(true);
  };

  // Xử lý xóa môn học sau khi xác nhận
  const handleDeleteConfirm = () => {
    const updatedSubjects = [...subjects];
    updatedSubjects.splice(deleteIndex, 1);
    setSubjects(updatedSubjects);
    setDeleteConfirmOpen(false);
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
    <Box sx={{ p: 3 }}>
      <button
        onClick={handleAdd}
        sx={{ mb: 2 }}
        style={{
          backgroundColor: "#d30000", color: "white", padding: "10px 20px", border: "none",
          borderRadius: "5px", marginBottom: "30px", cursor: "pointer",}}>
        + Thêm mới
      </button>
      <SubjectTable
        subjects={subjects}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
      />
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <SubjectForm
          initialData={editingIndex !== null ? subjects[editingIndex] : null}
          onSave={handleSave}
        />
      </Modal>
      <Modal isOpen={isDeleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <div style={{ textAlign: "center" }}>
          <p>Bạn có chắc chắn muốn xóa môn học này không?</p>
          <button
            onClick={handleDeleteConfirm}
            style={{
              backgroundColor: "#d30000",color: "white",padding: "5px 15px",
              border: "none",borderRadius: "5px",cursor: "pointer",marginRight: "10px",}}>
            OK
          </button>
          <button
            onClick={() => setDeleteConfirmOpen(false)}
            style={{
              backgroundColor: "#ccc",color: "black",padding: "5px 15px",
              border: "none",borderRadius: "5px",cursor: "pointer",}}>
            Hủy
          </button>
        </div>
      </Modal>
    </Box>
  );
};

// Component bảng hiển thị danh sách môn học
const SubjectTable = ({ subjects, onEdit, onDelete }) => {
  return (
    <TableContainer component={Paper} style = {{ width: "50%", margin: "auto", textAlign: "center", justifyContent: "center",}}>
    <Table>
      <TableHead>
        <TableRow style={{background: "#F7F7F7"}}>
          <TableCell>Tên môn học</TableCell>
          <TableCell>Mã môn</TableCell>
          <TableCell>Thao tác</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {subjects.map((subject, index) => (
          <TableRow key={index}>
            <TableCell>{subject.name}</TableCell>
            <TableCell>{subject.code}</TableCell>
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
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
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
    <form onSubmit={handleSubmit} style={{ maxWidth: "500px", margin: "auto" }}>
      <h2 style={{ textAlign: "center" }}>Thông tin môn học</h2>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Tên môn học"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            sx={{ fontSize: "14px" }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Mã môn học"
            name="code"
            value={formData.code}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            sx={{ fontSize: "14px" }}
          />
        </Grid>
      </Grid>

      <Grid container spacing={1} justifyContent="center" style={{ marginTop: "20px" }}>
        <Grid item xs={4}>
          <Button 
            variant="contained" color="error" type="submit" fullWidth>
            Lưu
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default SubjectManagement;

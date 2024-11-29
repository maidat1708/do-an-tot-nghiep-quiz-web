import React, { useState, useEffect } from "react";
import { Grid, Box, Paper, Table, TableBody, TableCell,TableContainer,TableHead,TableRow, 
  TextField, Button, Pagination, Select, MenuItem } from '@mui/material';
import { FaEdit, FaTrash } from "react-icons/fa"; // Import icons
import Modal from "../../components/Modal"; // Import modal component
import { toast } from 'react-toastify';

const SubjectManagement = () => {
  const [subjects, setSubjects] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [isDeleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [pageSize, setPageSize] = useState(5); // Số lượng hiển thị mỗi trang
  
  // Fetch subjects khi component mount
  useEffect(() => {
    fetchSubjects();
  }, []);

  // Lấy danh sách môn học
  const fetchSubjects = async () => {
    try {
      const response = await fetch('http://26.184.129.66:8080/api/v1/subjects', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.code === 200) {
        setSubjects(data.result);
      }
    } catch (error) {
      toast.error('Lỗi khi tải danh sách môn học');
    }
  };

  // Xử lý mở popup thêm mới
  const handleAdd = () => {
    setEditingIndex(null);
    setModalOpen(true);
  };

  // Xử lý chỉnh sửa
  const handleEdit = (globalIndex) => {
    setEditingIndex(globalIndex);
    setModalOpen(true);
  };

  // Hiển thị popup xác nhận xóa
  const handleDeleteClick = (globalIndex) => {
    setDeleteIndex(globalIndex);
    setDeleteConfirmOpen(true);
  };

  // Xử lý xóa môn học sau khi xác nhận
  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(`http://26.184.129.66:8080/api/v1/subjects/${subjects[deleteIndex].id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        toast.success('Xóa môn học thành công');
        fetchSubjects(); // Refresh data
      } else {
        toast.error('Lỗi khi xóa môn học');
      }
    } catch (error) {
      toast.error('Lỗi khi xóa môn học');
    }
    // Kiểm tra tổng số trang sau khi xóa
    const totalPagesAfterDelete = Math.ceil(updatedSubjects.length / pageSize);
    // Nếu trang hiện tại lớn hơn tổng số trang, chuyển về trang cuối
    if (currentPage > totalPagesAfterDelete) {
      setCurrentPage(totalPagesAfterDelete);
    }
    setDeleteConfirmOpen(false);
  };

  // Lưu môn học sau khi thêm/sửa
  const handleSave = async (data) => {
    try {
      const url = editingIndex !== null 
        ? `http://26.184.129.66:8080/api/v1/subjects/${subjects[editingIndex].id}`
        : 'http://26.184.129.66:8080/api/v1/subjects';
      
      const method = editingIndex !== null ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        toast.success(`${editingIndex !== null ? 'Cập nhật' : 'Thêm'} môn học thành công`);
        fetchSubjects(); // Refresh data
        setModalOpen(false);
      } else {
        toast.error(`Lỗi khi ${editingIndex !== null ? 'cập nhật' : 'thêm'} môn học`);
      }
    } catch (error) {
      toast.error(`Lỗi khi ${editingIndex !== null ? 'cập nhật' : 'thêm'} môn học`);
    }
  };

  // Tính toán dữ liệu phân trang
  const paginatedSubjects = subjects.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalPages = Math.ceil(subjects.length / pageSize); // Tổng số trang

  // Xử lý thay đổi trang
  const handlePageChange = (event, value) => setCurrentPage(value);

  // Xử lý thay đổi số lượng hiển thị
  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value);
    setCurrentPage(1); // Reset về trang đầu tiên
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
        subjects={paginatedSubjects}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        currentPage={currentPage} // Truyền trang hiện tại
        pageSize={pageSize} // Truyền số lượng hiển thị mỗi trang
      />
      {subjects.length > 0 ? ( // Kiểm tra nếu danh sách không rỗng thì hiển thị bảng
        <>
          <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", mt: 2 }}>
            <Pagination
              count={totalPages} 
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              sx={{ mr: 2, display: 'flex', justifyContent: 'center' }}
            />
            <Select
              value={pageSize}
              onChange={handlePageSizeChange}
              size="small"
              sx={{ minWidth: "100px" }}
            >
              {[5, 10, 20, 30, 40, 50].map((size) => (
                <MenuItem key={size} value={size}>
                  {size} / trang
                </MenuItem>
              ))}
            </Select>
          </Box>
        </>
      ) : ( // Nếu danh sách trống thì hiển thị thông báo
        <Box sx={{ textAlign: "center", mt: 5 }}>
          <p>Hiện tại chưa có dữ liệu môn học.</p>
        </Box>
      )}
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
const SubjectTable = ({ subjects, onEdit, onDelete, currentPage, pageSize }) => {
  return (
    <TableContainer component={Paper} style={{ width: "50%", margin: "auto", textAlign: "center", justifyContent: "center" }}>
      <Table>
        <TableHead>
          <TableRow style={{background: "#F7F7F7"}}>
            <TableCell>Tên môn học</TableCell>
            <TableCell>Mã môn</TableCell>
            <TableCell>Thao tác</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {subjects.map((subject, localIndex) => {
            const globalIndex = (currentPage - 1) * pageSize + localIndex;
            return (
              <TableRow key={globalIndex}>
                <TableCell>{subject.subjectName}</TableCell>
                <TableCell>{subject.description || `MH${subject.id}`}</TableCell>
                <TableCell>
                  <button
                    onClick={() => onEdit(globalIndex)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#4CAF50",
                      marginRight: "10px",
                    }}
                  >
                    <FaEdit size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(globalIndex)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#f44336",
                    }}
                  >
                    <FaTrash size={18} />
                  </button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

// form thêm/sửa môn học
const SubjectForm = ({ initialData, onSave }) => {
  const [formData, setFormData] = useState({
    subjectName: "",
    id: "",
    description: ""
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        subjectName: initialData.subjectName || "",
        id: initialData.id || "",
        description: initialData.description || `MH${initialData.id}`
      });
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
    const submitData = {
      subjectName: formData.subjectName,
      description: formData.description
    };
    onSave(submitData);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "500px", margin: "auto" }}>
      <h2 style={{ textAlign: "center" }}>
        {initialData ? "Sửa môn học" : "Thêm môn học mới"}
      </h2>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Tên môn học"
            name="subjectName"
            value={formData.subjectName}
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
            name="description"
            value={formData.description}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            sx={{ fontSize: "14px" }}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2} justifyContent="center" style={{ marginTop: "20px" }}>
        <Grid item xs={6}>
          <Button 
            variant="contained" 
            color="error" 
            type="submit" 
            fullWidth
          >
            {initialData ? "Cập nhật" : "Thêm mới"}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default SubjectManagement;

import React, { useState, useEffect } from "react";
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, TextField, FormControl, Select, MenuItem, InputLabel, Grid } from '@mui/material';
import { FaEdit, FaTrash } from "react-icons/fa";
import Modal from "../../components/Modal";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [isDeleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

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
   const confirmDelete = (index) => {
    setUserToDelete(index);
    setDeleteConfirmOpen(true);
  };

  // Xóa người dùng sau khi xác nhận
  const handleDelete = () => {
    if (userToDelete !== null) {
      const updatedUsers = [...users];
      updatedUsers.splice(userToDelete, 1);
      setUsers(updatedUsers);
    }
    setDeleteConfirmOpen(false);
    setUserToDelete(null);
  };

  // Lưu người dùng sau khi thêm/sửa
  const handleSave = (data) => {
    const updatedUsers = [...users];
    if (editingIndex !== null) {
      updatedUsers[editingIndex] = data;
    } else {
      updatedUsers.push(data);
    }
    setUsers(updatedUsers);
    setModalOpen(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <button 
        onClick={() => handleAdd(true)}
        sx={{ mb: 2 }}
        style={{
          backgroundColor: "#d30000", color: "white", padding: "10px 20px", border: "none",
          borderRadius: "5px", marginBottom: "30px", cursor: "pointer",
          }}
        >
        + Thêm mới
      </button>

      <UserTable 
        users={users} 
        onEdit={handleEdit} 
        onDelete={confirmDelete} 
      />
      
      {/* Modal for Add/Edit User */}
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <UserForm
          initialData={editingIndex !== null ? users[editingIndex] : null}
          onSave={handleSave}
        />
      </Modal>

      {/* Modal for Delete Confirmation */}
      <Modal isOpen={isDeleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <div style={{ textAlign: "center" }}>
          <h3>Bạn có chắc chắn muốn xóa người dùng này không?</h3>
          <button
            onClick={handleDelete}
            style={{
              backgroundColor: "#d30000",color: "white",padding: "10px 20px",margin: "10px",
              border: "none",borderRadius: "5px",cursor: "pointer",
            }}
          >
            OK
          </button>
          <button
            onClick={() => setDeleteConfirmOpen(false)}
            style={{
              backgroundColor: "#ccc",color: "black",padding: "10px 20px",
              margin: "10px", border: "none",borderRadius: "5px",cursor: "pointer",
            }}
          >
            Hủy
          </button>
        </div>
      </Modal>
    </Box>
  );
};

// Component bảng hiển thị danh sách người dùng
const UserTable = ({ users, onEdit, onDelete }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow style={{background: "#F7F7F7"}}>
            <TableCell>Username</TableCell>
            <TableCell>First Name</TableCell>
            <TableCell>Last Name</TableCell>
            <TableCell>Birthday</TableCell>
            <TableCell>Gender</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Phone Number</TableCell>
            <TableCell>Address</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Thao tác</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user, index) => (
            <TableRow key={index}>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.firstName}</TableCell>
              <TableCell>{user.lastName}</TableCell>
              <TableCell>{user.birthDay}</TableCell>
              <TableCell>{user.gender}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.phoneNumber}</TableCell>
              <TableCell>{user.address}</TableCell>
              <TableCell>{user.role}</TableCell>
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

// Component form thêm/sửa người dùng
const UserForm = ({ initialData, onSave }) => {
  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    birthDay: "",
    gender: "",
    email: "",
    phoneNumber: "",
    address: "",
    role: "",
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
    <form onSubmit={handleSubmit} style={{ maxWidth: "500px", margin: "auto" }}>
      <h2 style={{ textAlign: "center" }}>Thông tin người dùng</h2>
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <TextField
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            sx={{ fontSize: '14px' }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            sx={{ fontSize: '14px' }}
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            sx={{ fontSize: '14px' }}
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            sx={{ fontSize: '14px' }}
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            label="Phone Number"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            fullWidth
            margin="normal"
            sx={{ fontSize: '14px' }}
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            label="Birthday"
            name="birthDay"
            value={formData.birthDay}
            onChange={handleChange}
            fullWidth
            margin="normal"
            type="date"
            InputLabelProps={{ shrink: true }}
            sx={{ fontSize: '14px' }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            fullWidth
            margin="normal"
            sx={{ fontSize: '14px' }}
          />
        </Grid>

        <Grid item xs={6}>
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Role</InputLabel>
            <Select
              name="role"
              value={formData.role}
              onChange={handleChange}
              sx={{ fontSize: '14px' }}
            >
              <MenuItem value="ADMIN">admin</MenuItem>
              <MenuItem value="STUDENT">student</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Gender</InputLabel>
            <Select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              sx={{ fontSize: '14px' }}
            >
              <MenuItem value={0}>Nam</MenuItem>
              <MenuItem value={1}>Nữ</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Grid container spacing={1} justifyContent="center" style={{ marginTop: '20px' }}>
        <Grid item xs={2}>
          <Button 
            variant="contained" color="error" type="submit" fullWidth>
            Lưu
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default UserManagement;

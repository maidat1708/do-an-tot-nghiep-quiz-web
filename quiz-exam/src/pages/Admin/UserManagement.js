import React, { useState, useEffect } from "react";
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, TextField, FormControl, Select, MenuItem, InputLabel, Grid, Pagination } from '@mui/material';
import { FaEdit, FaTrash } from "react-icons/fa";
import Modal from "../../components/Modal";
import { toast } from 'react-toastify';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [isDeleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [pageSize, setPageSize] = useState(5); // Số lượng hiển thị mỗi trang
  
  // Fetch users khi component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Lấy danh sách người dùng
  const fetchUsers = async () => {
    try {
      const response = await fetch('http://26.184.129.66:8080/api/v1/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.code === 200) {
        setUsers(data.result);
      }
    } catch (error) {
      toast.error('Lỗi khi tải danh sách người dùng');
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
  const confirmDelete = (globalIndex) => {
    setUserToDelete(globalIndex);
    setDeleteConfirmOpen(true);
  };

  // Xóa người dùng sau khi xác nhận
  const handleDelete = async () => {
    if (userToDelete !== null) {
      try {
        const response = await fetch(`http://26.184.129.66:8080/api/v1/users/${users[userToDelete].id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (response.ok) {
          toast.success('Xóa người dùng thành công');
          fetchUsers(); // Refresh data
          // Kiểm tra lại số trang sau khi cập nhật danh sách xóa
          const updatedUsers = users;
          const totalPagesAfterDelete = Math.ceil(updatedUsers.length / pageSize);
          
          // Nếu trang hiện tại lớn hơn tổng số trang, chuyển về trang cuối
          if (currentPage > totalPagesAfterDelete) {
            setCurrentPage(totalPagesAfterDelete);
          }
        } else {
          toast.error('Lỗi khi xóa người dùng');
        }
      } catch (error) {
        toast.error('Lỗi khi xóa người dùng');
      }
    }
    setDeleteConfirmOpen(false);
    setUserToDelete(null);
  };

  // Lưu người dùng sau khi thêm/sửa
  const handleSave = async (data) => {
    try {
      const url = editingIndex !== null 
        ? `http://26.184.129.66:8080/api/v1/users/${users[editingIndex].id}`
        : 'http://26.184.129.66:8080/api/v1/users';
      
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
        toast.success(`${editingIndex !== null ? 'Cập nhật' : 'Thêm'} người dùng thành công`);
        fetchUsers(); // Refresh data
        setModalOpen(false);
      } else {
        toast.error(`Lỗi khi ${editingIndex !== null ? 'cập nhật' : 'thêm'} người dùng`);
      }
    } catch (error) {
      toast.error(`Lỗi khi ${editingIndex !== null ? 'cập nhật' : 'thêm'} người dùng`);
    }
  };

  // Tính toán dữ liệu phân trang
  const paginatedUsers = users.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalPages = Math.ceil(users.length / pageSize); // Tổng số trang

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
        users={paginatedUsers} 
        onEdit={handleEdit} 
        onDelete={confirmDelete} 
        currentPage={currentPage} // Truyền trang hiện tại
        pageSize={pageSize} // Truyền số lượng hiển thị mỗi trang
      />
      
      {users.length > 0 ? ( // Kiểm tra nếu danh sách không rỗng thì hiển thị bảng
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
          <p>Hiện tại chưa có dữ liệu người dùng.</p>
        </Box>
      )}

      {/* Modal for Add/Edit User */}
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        {editingIndex !== null ? (
          <UserForm
            initialData={users[editingIndex]}
            onSave={handleSave}
          />
        ) : (
          <AddUserForm onSave={handleSave} />
        )}
      </Modal>

      {/* Modal for Delete Confirmation */}
      <Modal isOpen={isDeleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <div style={{ textAlign: "center" }}>
          <p>Bạn có chắc chắn muốn xóa người dùng này không?</p>
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
const UserTable = ({ users, onEdit, onDelete, currentPage, pageSize }) => {
  return (
    <TableContainer component={Paper} style={{ margin: "auto" }}>
      <Table>
        <TableHead>
          <TableRow style={{background: "#F7F7F7"}}>
            <TableCell>Username</TableCell>
            <TableCell>Tên</TableCell>
            <TableCell>Họ</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Số điện thoại</TableCell>
            <TableCell>Địa chỉ</TableCell>
            <TableCell>Ngày sinh</TableCell>
            <TableCell>Giới tính</TableCell>
            <TableCell>Vai trò</TableCell>
            <TableCell>Thao tác</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user, localIndex) => {
            const globalIndex = (currentPage - 1) * pageSize + localIndex;
            return (
              <TableRow key={globalIndex}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.profile.firstName}</TableCell>
                <TableCell>{user.profile.lastName}</TableCell>
                <TableCell>{user.profile.email}</TableCell>
                <TableCell>{user.profile.phoneNumber}</TableCell>
                <TableCell>{user.profile.address}</TableCell>
                <TableCell>{user.profile.birthDay}</TableCell>
                <TableCell>{user.profile.gender === 0 ? "Nam" : "Nữ"}</TableCell>
                <TableCell>{user.role}</TableCell>
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

// Component form thêm/sửa người dùng
const UserForm = ({ initialData, onSave }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "STUDENT",
    profile: {
      email: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      birthDay: "",
      address: "",
      gender: 0
    }
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        username: initialData.username || "",
        role: initialData.role || "STUDENT",
        profile: {
          email: initialData.profile?.email || "",
          firstName: initialData.profile?.firstName || "",
          lastName: initialData.profile?.lastName || "",
          phoneNumber: initialData.profile?.phoneNumber || "",
          birthDay: initialData.profile?.birthDay || "",
          address: initialData.profile?.address || "",
          gender: initialData.profile?.gender || 0
        }
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "800px", margin: "auto" }}>
      <h2 style={{ textAlign: "center" }}>
        {initialData ? "Sửa thông tin người dùng" : "Thêm người dùng mới"}
      </h2>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            disabled={initialData !== null}
          />
        </Grid>
        {!initialData && (
          <Grid item xs={6}>
            <TextField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
          </Grid>
        )}
        <Grid item xs={6}>
          <TextField
            label="Email"
            name="profile.email"
            value={formData.profile.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Họ"
            name="profile.firstName"
            value={formData.profile.firstName}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Tên"
            name="profile.lastName"
            value={formData.profile.lastName}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Số điện thoại"
            name="profile.phoneNumber"
            value={formData.profile.phoneNumber}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Ngày sinh"
            name="profile.birthDay"
            type="date"
            value={formData.profile.birthDay}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Địa chỉ"
            name="profile.address"
            value={formData.profile.address}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Vai trò</InputLabel>
            <Select
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <MenuItem value="ADMIN">Admin</MenuItem>
              <MenuItem value="STUDENT">Student</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Giới tính</InputLabel>
            <Select
              name="profile.gender"
              value={formData.profile.gender}
              onChange={handleChange}
            >
              <MenuItem value={0}>Nam</MenuItem>
              <MenuItem value={1}>Nữ</MenuItem>
            </Select>
          </FormControl>
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

// Form thêm mới user
const AddUserForm = ({ onSave }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    firstName: "",
    lastName: "",
    role: "STUDENT"
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "800px", margin: "auto" }}>
      <h2 style={{ textAlign: "center" }}>Thêm người dùng mới</h2>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
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
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Họ"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Tên"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth margin="normal">
            <InputLabel id="role-label">Vai trò</InputLabel>
            <Select
              labelId="role-label"
              name="role"
              value={formData.role}
              onChange={handleChange}
              label="Vai trò"
            >
              <MenuItem value="ADMIN">Admin</MenuItem>
              <MenuItem value="STUDENT">Student</MenuItem>
            </Select>
          </FormControl>
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
            Thêm mới
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default UserManagement;

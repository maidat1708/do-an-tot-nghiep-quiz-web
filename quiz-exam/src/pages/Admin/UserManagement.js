import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import Modal from "../../components/Modal";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
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

  // Xóa người dùng
  const handleDelete = (index) => {
    const updatedUsers = [...users];
    updatedUsers.splice(index, 1);
    setUsers(updatedUsers);
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
      <UserTable users={users} onEdit={handleEdit} onDelete={handleDelete} />
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <UserForm
          initialData={editingIndex !== null ? users[editingIndex] : null}
          onSave={handleSave}
        />
      </Modal>
    </div>
  );
};

// Component bảng hiển thị danh sách người dùng
const UserTable = ({ users, onEdit, onDelete }) => {
  return (
    <table
      border="1"
      style={{
        width: "100%",
        margin: "auto",
        textAlign: "center",
        justifyContent: "center",
      }}
    >
      <thead>
        <tr>
          <th style={{ border: "1px solid #ddd", padding: "8px" }}>Username</th>
          <th style={{ border: "1px solid #ddd", padding: "8px" }}>First Name</th>
          <th style={{ border: "1px solid #ddd", padding: "8px" }}>Last Name</th>
          <th style={{ border: "1px solid #ddd", padding: "8px" }}>Birthday</th>
          <th style={{ border: "1px solid #ddd", padding: "8px" }}>Gender</th>
          <th style={{ border: "1px solid #ddd", padding: "8px" }}>Email</th>
          <th style={{ border: "1px solid #ddd", padding: "8px" }}>Phone Number</th>
          <th style={{ border: "1px solid #ddd", padding: "8px" }}>Address</th>
          <th style={{ border: "1px solid #ddd", padding: "8px" }}>Role</th>
          <th style={{ border: "1px solid #ddd", padding: "8px" }}>Hành động</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user, index) => (
          <tr key={index}>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>{user.username}</td>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>{user.firstName}</td>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>{user.lastName}</td>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>{user.birthDay}</td>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>{user.gender}</td>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>{user.email}</td>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>{user.phoneNumber}</td>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>{user.address}</td>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>{user.role}</td>
            <td>
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
      <div>
        <label>Username:</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>First Name:</label>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Last Name:</label>
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Birthday:</label>
        <input
          type="date"
          name="birthDay"
          value={formData.birthDay}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Gender:</label>
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          required
        >
          <option value="">Chọn giới tính</option>
          <option value="Male">Nam</option>
          <option value="Female">Nữ</option>
        </select>
      </div>
      <div>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Phone Number:</label>
        <input
          type="text"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Address:</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Role:</label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          required
        >
          <option value="">Chọn vai trò</option>
          <option value="Admin">Admin</option>
          <option value="Student">Học sinh</option>
        </select>
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

export default UserManagement;

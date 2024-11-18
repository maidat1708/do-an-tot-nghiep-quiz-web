import React, { useState, useContext } from 'react';
import './ModalStyles.css'; // Import CSS để thiết kế popup
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';

const LoginModal = ({ onClose, onSwitchToRegister, onSuccess }) => {
  const { loginUser, setUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [error, setError] = useState(''); // Lưu trữ thông báo lỗi

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password } = formData;

    const success = await loginUser(username, password);

    if (success) {
      setUser({ username, password }); // Cập nhật user vào context khi đăng nhập thành công
      onSuccess(); // Gọi hàm khi đăng nhập thành công
      toast.success('Đăng nhập thành công!');
      setError('');
      onClose();
    } else {
      setError('Username hoặc mật khẩu không đúng!');
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Đăng nhập</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username *</label>
            <input 
              type="username" 
              name="username" 
              placeholder="Nhập tên đăng nhập" 
              value={formData.username} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="form-group">
            <label>Password *</label>
            <input 
              type="password" 
              name="password" 
              placeholder="Nhập mật khẩu" 
              value={formData.password} 
              onChange={handleChange} 
              required 
            />
          </div>
          
          {error && <p style={{ color: 'red' }}>{error}</p>} {/* Hiển thị lỗi nếu có */}

          <button type="submit" className="submit-btn">Đăng nhập</button>
        </form>
        <p>
          Chưa có tài khoản?{' '}
          <span onClick={onSwitchToRegister} style={{ color: 'blue', cursor: 'pointer' }}>
            Đăng ký
          </span>
        </p>
      </div>
    </div>
  );
};
export default LoginModal;
import React, { useState, useContext } from 'react';
import './ModalStyles.css'; // Dùng cùng một CSS
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext'; 
import { FiEye, FiEyeOff } from 'react-icons/fi'; // Thêm icon mắt từ react-icons

const RegisterModal = ({ onClose, onSwitchToLogin }) => {
  const { registerUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const [showPassword, setShowPassword] = useState(false); // Quản lý trạng thái hiển thị mật khẩu
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Trạng thái cho confirm password
  
  const [errors, setErrors] = useState({
    passwordLength: '',
    passwordUppercase: '',
    passwordSpecialChar: '',
    passwordMatch: '',
    registrationError: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'password') {
      const isValidLength = value.length >= 8;
      const hasUpperCase = /[A-Z]/.test(value);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

      setErrors((prevErrors) => ({
        ...prevErrors,
        passwordLength: isValidLength ? '' : 'Mật khẩu phải có ít nhất 8 ký tự.',
        passwordUppercase: hasUpperCase ? '' : 'Mật khẩu phải chứa ít nhất một ký tự viết hoa.',
        passwordSpecialChar: hasSpecialChar ? '' : 'Mật khẩu phải chứa ít nhất một ký tự đặc biệt.',
      }));
    }

    if (name === 'confirmPassword') {
      setErrors((prevErrors) => ({
        ...prevErrors,
        passwordMatch: value !== formData.password ? 'Mật khẩu và Xác nhận mật khẩu không khớp!' : '',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra lại các lỗi mật khẩu trước khi submit
    if (errors.passwordLength || errors.passwordUppercase ||
      errors.passwordSpecialChar || errors.passwordMatch
    ) {
      toast.error('Vui lòng sửa các lỗi trước khi đăng ký!');
      return;
    }

    const success = await registerUser(
      formData.firstname,
      formData.lastname,
      formData.username,
      formData.email,
      formData.password
    );

    if (success) {
      toast.success('Đăng ký thành công!');
      onClose();
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        registrationError: 'Username đã được sử dụng!',
      }));
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Đăng ký</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Firstname *</label>
            <input 
              type="text" 
              name="firstname" 
              placeholder="Nhập tên" 
              value={formData.firstname} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="form-group">
            <label>Lastname *</label>
            <input 
              type="text" 
              name="lastname" 
              placeholder="Nhập họ" 
              value={formData.lastname} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="form-group">
            <label>Username *</label>
            <input 
              type="text" 
              name="username" 
              placeholder="Nhập tên đăng nhập" 
              value={formData.username} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="form-group">
            <label>Email *</label>
            <input 
              type="email" 
              name="email" 
              placeholder="Nhập email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="form-group password-wrapper">
            <label>Password *</label>
            <input 
              type={showPassword ? 'text' : 'password'} 
              name="password" 
              placeholder="Nhập mật khẩu" 
              value={formData.password} 
              onChange={handleChange} 
              required 
            />
            <span 
              className="eye-icon" 
              onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </span>
            {/* Hiển thị các lỗi liên quan đến mật khẩu */}
            {errors.passwordLength && <p style={{ color: 'red' }}>{errors.passwordLength}</p>}
            {errors.passwordUppercase && <p style={{ color: 'red' }}>{errors.passwordUppercase}</p>}
            {errors.passwordSpecialChar && <p style={{ color: 'red' }}>{errors.passwordSpecialChar}</p>}
          </div>
          <div className="form-group password-wrapper">
            <label>Confirm password *</label>
            <input 
              type={showConfirmPassword ? 'text' : 'password'} 
              name="confirmPassword" 
              placeholder="Xác nhận mật khẩu" 
              value={formData.confirmPassword} 
              onChange={handleChange} 
              required 
            />
            <span 
              className="eye-icon" 
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
            </span>
            {/* Hiển thị lỗi mật khẩu không khớp */}
            {errors.passwordMatch && <p style={{ color: 'red' }}>{errors.passwordMatch}</p>}
          </div>

          {/* Hiển thị lỗi đăng ký nếu có */}
          {errors.registrationError && <p style={{ color: 'red' }}>{errors.registrationError}</p>}
          
          <button type="submit" className="submit-btn">Đăng ký</button>
        </form>
        <p>
          Đã có tài khoản?{' '}
          <span onClick={onSwitchToLogin} style={{ color: 'blue', cursor: 'pointer' }}>
            Đăng nhập
          </span>
        </p>
      </div>
    </div>
  );
};

export default RegisterModal;

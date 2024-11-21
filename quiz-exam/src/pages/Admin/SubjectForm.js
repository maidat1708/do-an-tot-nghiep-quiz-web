import React, { useState, useEffect } from "react";

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
      <div>
        <label>Tên môn học:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Mã môn học:</label>
        <input
          type="text"
          name="code"
          value={formData.code}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit" style={{backgroundColor: "#d30000", color: "#fff", width: "50px", margin: "auto"}}>Lưu</button>
    </form>
  );
};

export default SubjectForm;

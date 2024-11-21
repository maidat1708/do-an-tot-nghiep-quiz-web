import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa"; // Import icons

const SubjectTable = ({ subjects, onEdit, onDelete }) => {
  return (
    <table border="1" style={{ width: "80%", margin: "auto", textAlign: "center", justifyContent: "center"}}>
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
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>{subject.name}</td>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>{subject.code}</td>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
              <button
                onClick={() => onEdit(index)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#4CAF50", // Màu xanh
                  marginRight: "10px"
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

export default SubjectTable;

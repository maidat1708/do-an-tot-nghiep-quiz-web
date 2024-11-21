import React, { useState } from "react";
import SubjectTable from "./SubjectTable";
import Modal from "../../components/Modal";
import SubjectForm from "./SubjectForm";

const SubjectManagement = () => {
  const [subjects, setSubjects] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  const handleAdd = () => {
    setEditingIndex(null);
    setModalOpen(true);
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setModalOpen(true);
  };

  const handleDelete = (index) => {
    const updatedSubjects = [...subjects];
    updatedSubjects.splice(index, 1);
    setSubjects(updatedSubjects);
  };

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
      <button onClick={handleAdd} style={{backgroundColor: "#d30000", color: "white", padding: "10px 20px", border: "none", borderRadius: "5px", marginBottom: "30px", cursor: "pointer"}}>+ Thêm mới</button>
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

export default SubjectManagement;

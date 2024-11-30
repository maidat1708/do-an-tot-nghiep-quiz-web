import React, { useState, useEffect } from 'react';
import {
  Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent, 
  DialogActions, TextField, Select, MenuItem, FormControl, InputLabel, FormControlLabel, Radio, Typography, Pagination
} from '@mui/material';
import { toast } from 'react-toastify';
// import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { FaEdit, FaTrash } from "react-icons/fa";

const QuestionManagement = () => {
  const [questions, setQuestions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState(subjects.length > 0 ? subjects[0].id : null);
  const [formData, setFormData] = useState({
    questionText: '',
    level: 1,
    subjectId: '',
    answers: [
      { answerText: '', isCorrect: 0 },
      { answerText: '', isCorrect: 0 },
      { answerText: '', isCorrect: 0 },
      { answerText: '', isCorrect: 0 }
    ]
  });
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [pageSize, setPageSize] = useState(5); // Số lượng hiển thị mỗi trang

  // Nếu danh sách subjects thay đổi, tự động chọn môn đầu tiên
  useEffect(() => {
    if (subjects.length > 0) {
      setSelectedSubjectId(subjects[0].id);
    }
  }, [subjects]);

  const filteredQuestions = selectedSubjectId ? questions.filter((q) => q.subject.id === selectedSubjectId) : questions;

  // Fetch questions và subjects khi component mount
  useEffect(() => {
    fetchQuestions();
    fetchSubjects();
  }, []);

  // Lấy danh sách câu hỏi
  const fetchQuestions = async () => {
    try {
      const response = await fetch('http://26.184.129.66:8080/api/v1/questions', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.code === 200) {
        setQuestions(data.result);
      }
    } catch (error) {
      toast.error('Lỗi khi tải danh sách câu hỏi');
    }
  };

  // Lấy danh sách môn học
  const fetchSubjects = async () => {
    try {
      const response = await fetch('http://26.184.129.66:8080/api/v1/subjects', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setSubjects(data.result);
    } catch (error) {
      toast.error('Lỗi khi tải danh sách môn học');
    }
  };

  // Thêm câu hỏi mới
  const handleAdd = async () => {
    try {
      const response = await fetch('http://26.184.129.66:8080/api/v1/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        toast.success('Thêm câu hỏi thành công');
        handleClose();
        fetchQuestions();
      } else {
        toast.error('Lỗi khi thêm câu hỏi');
      }
    } catch (error) {
      toast.error('Lỗi khi thêm câu hỏi');
    }
  };

  // Cập nhật câu hỏi
  const handleUpdate = async () => {
    try {
      const response = await fetch(`http://26.184.129.66:8080/api/v1/questions/${selectedQuestion.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        toast.success('Cập nhật câu hỏi thành công');
        handleClose();
        fetchQuestions();
      } else {
        toast.error('Lỗi khi cập nhật câu hỏi');
      }
    } catch (error) {
      toast.error('Lỗi khi cập nhật câu hỏi');
    }
  };

  // Xóa câu hỏi
  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa câu hỏi này?')) {
      try {
        const response = await fetch(`http://26.184.129.66:8080/api/v1/questions/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (response.ok) {
          toast.success('Xóa câu hỏi thành công');
          fetchQuestions();
          // Kiểm tra lại số trang sau khi cập nhật danh sách xóa
          const updatedQuestions = questions;
          const totalPagesAfterDelete = Math.ceil(updatedQuestions.length / pageSize);

          // Nếu trang hiện tại lớn hơn tổng số trang, chuyển về trang cuối
          if (currentPage > totalPagesAfterDelete) {
            setCurrentPage(totalPagesAfterDelete);
          }
        } else {
          toast.error('Lỗi khi xóa câu hỏi');
        }
      } catch (error) {
        toast.error('Lỗi khi xóa câu hỏi');
      }
    }
  };

  // Handlers cho form
  const handleAnswerChange = (index, field, value) => {
    setFormData(prev => {
      const newAnswers = [...prev.answers];
      newAnswers[index] = {
        ...newAnswers[index],
        [field]: field === 'isCorrect' ? Number(value) : value
      };
      
      // Nếu đang set isCorrect = 1, reset các đáp án khác về 0
      if (field === 'isCorrect' && value === 1) {
        newAnswers.forEach((answer, i) => {
          if (i !== index) {
            newAnswers[i].isCorrect = 0;
          }
        });
      }
      
      return {
        ...prev,
        answers: newAnswers
      };
    });
  };

  // Handlers cho modal
  const handleOpen = (question = null) => {
    if (question) {
      setSelectedQuestion(question);
      setFormData({
        questionText: question.questionText,
        level: question.level,
        subjectId: question.subject.id,
        answers: question.answers.map(answer => ({
          answerText: answer.answerText,
          isCorrect: answer.isCorrect
        }))
      });
    } else {
      setSelectedQuestion(null);
      setFormData({
        questionText: '',
        level: 1,
        subjectId: '',
        answers: [
          { answerText: '', isCorrect: 0 },
          { answerText: '', isCorrect: 0 },
          { answerText: '', isCorrect: 0 },
          { answerText: '', isCorrect: 0 }
        ]
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedQuestion(null);
    setFormData({
      questionText: '',
      level: 1,
      subjectId: '',
      answers: [
        { answerText: '', isCorrect: 0 },
        { answerText: '', isCorrect: 0 },
        { answerText: '', isCorrect: 0 },
        { answerText: '', isCorrect: 0 }
      ]
    });
  };

  // Tính toán dữ liệu phân trang
  const paginatedQuestions = filteredQuestions.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalPages = Math.ceil(filteredQuestions.length / pageSize); // Tổng số trang

  // Xử lý thay đổi trang
  const handlePageChange = (event, value) => setCurrentPage(value);

  // Xử lý thay đổi số lượng hiển thị
  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value);
    setCurrentPage(1); // Reset về trang đầu tiên
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <Box
      sx={{
        width: '15%',
        backgroundColor: '#fff',
        padding: '10px',
        borderRadius: '8px',
        border: '1px solid #ccc',
      }}
      >     
        <Box sx={{
          backgroundColor: '#f5f5f5',
          padding: '10px',
          borderRadius: '4px',
          fontWeight: 'bold',
          textAlign: 'center',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          marginBottom: '10px',
        }}
        >
          Môn học
        </Box>
        {subjects.map((subject) => (
          <Box
            key={subject.id}
            sx={{
              backgroundColor: subject.id === selectedSubjectId ? '#BFEFFF' : '#f5f5f5', // Màu nền thay đổi khi được chọn
              padding: '10px', marginBottom: '8px', borderRadius: '4px',
              textAlign: 'center', cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.1)', // Hiệu ứng bóng
              '&:hover': {
                backgroundColor: subject.id === selectedSubjectId ? '#BFEFFF' : '#e0e0e0', // Hover vẫn giữ được màu nếu chọn
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)', // Hiệu ứng bóng khi hover
              },
            }}
            onClick={() => setSelectedSubjectId(subject.id)}
          >
            <Typography>
              {subject.subjectName}
            </Typography>
          </Box>
        ))}
      </Box>  

      {/* Main Content */}
      <Box sx={{ flex: 1,p: 3 }}>
        <button
          onClick={() => handleOpen()}
          sx={{ mb: 2 }}
          style={{
            backgroundColor: '#d30000',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            marginBottom: '30px',
            cursor: 'pointer'
          }}
        >
          Thêm câu hỏi mới
        </button>

        <TableContainer component={Paper}>
          <Table
            questions={paginatedQuestions} 
            currentPage={currentPage} // Truyền trang hiện tại
            pageSize={pageSize} >
            <TableHead>
              <TableRow style={{background: "#F7F7F7"}}>
                <TableCell>ID</TableCell>
                <TableCell>Câu hỏi</TableCell>
                <TableCell>Môn học</TableCell>
                <TableCell>Cấp độ</TableCell>
                <TableCell>Đáp án A</TableCell>
                <TableCell>Đáp án B</TableCell>
                <TableCell>Đáp án C</TableCell>
                <TableCell>Đáp án D</TableCell>
                <TableCell>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredQuestions.map((question, localIndex) => {
                const globalIndex = (currentPage - 1) * pageSize + localIndex;
                return (
                  <TableRow key={globalIndex}>
                    <TableCell>{question.id}</TableCell>
                    <TableCell>{question.questionText}</TableCell>
                    <TableCell>{question.subject?.subjectName}</TableCell>
                    <TableCell>{question.level}</TableCell>
                    {question.answers.map((answer, index) => (
                      <TableCell
                        key={index}
                        sx={answer.isCorrect ? { color: 'green', fontWeight: 'bold' } : {}}
                      >
                        {answer.answerText}
                      </TableCell>
                    ))}
                    <TableCell>
                      <button
                        onClick={() => handleOpen(question)}
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
                        onClick={() => handleDelete(question.id)}
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
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        {filteredQuestions.length > 0 ? ( // Kiểm tra nếu danh sách không rỗng thì hiển thị phân trang
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
            <p>Hiện tại chưa có dữ liệu câu hỏi.</p>
          </Box>
        )}
        
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
          <DialogTitle>
            {selectedQuestion ? 'Sửa câu hỏi' : 'Thêm câu hỏi mới'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <TextField
                name="questionText"
                label="Nội dung câu hỏi"
                fullWidth
                value={formData.questionText}
                onChange={(e) => setFormData({...formData, questionText: e.target.value})}
              />
              
              <FormControl fullWidth>
                <InputLabel>Môn học</InputLabel>
                <Select
                  value={formData.subjectId}
                  onChange={(e) => setFormData({...formData, subjectId: e.target.value})}
                  label="Môn học"
                >
                  {subjects.map((subject) => (
                    <MenuItem key={subject.id} value={subject.id}>
                      {subject.subjectName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Cấp độ</InputLabel>
                <Select
                  value={formData.level}
                  onChange={(e) => setFormData({...formData, level: e.target.value})}
                  label="Cấp độ"
                >
                  <MenuItem value={1}>Dễ</MenuItem>
                  <MenuItem value={2}>Trung bình</MenuItem>
                  <MenuItem value={3}>Khó</MenuItem>
                </Select>
              </FormControl>

              {formData.answers.map((answer, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <TextField
                    label={`Đáp án ${String.fromCharCode(65 + index)}`}
                    fullWidth
                    value={answer.answerText}
                    onChange={(e) => handleAnswerChange(index, 'answerText', e.target.value)}
                  />
                  <FormControlLabel
                    control={
                      <Radio
                        checked={answer.isCorrect === 1}
                        onChange={(e) => handleAnswerChange(index, 'isCorrect', e.target.checked ? 1 : 0)}
                      />
                    }
                    label="Đáp án đúng"
                  />
                </Box>
              ))}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Hủy</Button>
            <Button 
              onClick={selectedQuestion ? handleUpdate : handleAdd}
              variant="contained"
            >
              {selectedQuestion ? 'Cập nhật' : 'Thêm'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default QuestionManagement;

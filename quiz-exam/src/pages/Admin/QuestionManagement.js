import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormControlLabel,
  Radio,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';

const QuestionManagement = () => {
  const [questions, setQuestions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [formData, setFormData] = useState({
    questionText: '',
    level: 1,
    answers: [
      { answerText: '', isCorrect: 0 },
      { answerText: '', isCorrect: 0 },
      { answerText: '', isCorrect: 0 },
      { answerText: '', isCorrect: 0 }
    ]
  });

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
        answers: question.answers
      });
    } else {
      setSelectedQuestion(null);
      setFormData({
        questionText: '',
        level: 1,
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
      answers: [
        { answerText: '', isCorrect: 0 },
        { answerText: '', isCorrect: 0 },
        { answerText: '', isCorrect: 0 },
        { answerText: '', isCorrect: 0 }
      ]
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={() => handleOpen()}
        sx={{ mb: 2 }}
      >
        Thêm câu hỏi mới
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Câu hỏi</TableCell>
              <TableCell>Cấp độ</TableCell>
              <TableCell>Đáp án A</TableCell>
              <TableCell>Đáp án B</TableCell>
              <TableCell>Đáp án C</TableCell>
              <TableCell>Đáp án D</TableCell>
              <TableCell>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {questions.map((question) => (
              <TableRow key={question.id}>
                <TableCell>{question.id}</TableCell>
                <TableCell>{question.questionText}</TableCell>
                <TableCell>{question.level}</TableCell>
                {question.answers.map((answer, index) => (
                  <TableCell key={answer.id} sx={answer.isCorrect ? { color: 'green', fontWeight: 'bold' } : {}}>
                    {answer.answerText}
                  </TableCell>
                ))}
                <TableCell>
                  <IconButton onClick={() => handleOpen(question)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(question.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

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
  );
};

export default QuestionManagement;

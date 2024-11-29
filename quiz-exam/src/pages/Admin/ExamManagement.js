import React, { useState, useEffect } from 'react';
import { Typography,Button,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Paper,Dialog,DialogTitle,DialogContent,
  DialogActions,TextField,FormControl,InputLabel,Select,MenuItem,Grid,IconButton,Box,List,ListItem,
  ListItemButton,ListItemIcon,ListItemText,Checkbox,Radio,FormControlLabel,Pagination} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash } from "react-icons/fa";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ExamPopup from "../../components/ExamPopup";

const ExamManagement = () => {
  const [exams, setExams] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [formData, setFormData] = useState({
    quizName: '',
    totalQuestion: '',
    duration: '',
    subjectId: ''
  });
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editFormData, setEditFormData] = useState({
    id: '',
    quizName: '',
    totalQuestion: '',
    duration: '',
    subjectId: '',
    questions: []
  });
  const [questions, setQuestions] = useState([]); // Danh sách tất cả câu hỏi
  const [selectedQuestions, setSelectedQuestions] = useState([]); // Câu hỏi đã chọn
  const [selectedSubjectId, setSelectedSubjectId] = useState(subjects.length > 0 ? subjects[0].id : null);
  const [openQuestionDialog, setOpenQuestionDialog] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [openQuestionEditDialog, setOpenQuestionEditDialog] = useState(false);
  const [questionFormData, setQuestionFormData] = useState({
    questionText: '',
    level: 1,
    answers: [
      { answerText: '', isCorrect: 0 },
      { answerText: '', isCorrect: 0 },
      { answerText: '', isCorrect: 0 },
      { answerText: '', isCorrect: 0 }
    ]
  });
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [pageSize, setPageSize] = useState(5); // Số lượng hiển thị mỗi trang

  // Lấy danh sách đề thi
  const fetchExams = async () => {
    try {
      const response = await fetch('http://26.184.129.66:8080/api/v1/quizzes', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Danh sách đề thi:', data); // Để debug
        setExams(data.result);
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách đề thi:', error);
      toast.error('Lỗi khi tải danh sách đề thi');
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
      if (response.ok) {
        const data = await response.json();
        console.log('Danh sách môn học:', data); // Để debug
        setSubjects(data.result);
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách môn học:', error);
      toast.error('Lỗi khi tải danh sách môn học');
    }
  };

  // Lấy danh sách câu hỏi
  const fetchQuestions = async () => {
    try {
      const response = await fetch('http://26.184.129.66:8080/api/v1/questions', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setQuestions(data.result);
      }
    } catch (error) {
      toast.error('Lỗi khi tải danh sách câu hỏi');
    }
  };

  // Nếu danh sách subjects thay đổi, tự động chọn bài thi đầu tiên
  useEffect(() => {
    if (subjects.length > 0) {
      setSelectedSubjectId(subjects[0].id);
    }
  }, [subjects]);

  const filteredExams = selectedSubjectId ? exams.filter((q) => q.subject.id === selectedSubjectId) : exams;
  
  // Gọi API khi component mount
  useEffect(() => {
    fetchExams();
    fetchSubjects();
    fetchQuestions();
  }, []); // Empty dependency array means this runs once when component mounts

  // Xử lý chọn câu hỏi
  const handleQuestionSelect = (question) => {
    const isSelected = selectedQuestions.find(q => q.id === question.id);
    if (isSelected) {
      setSelectedQuestions(selectedQuestions.filter(q => q.id !== question.id));
    } else {
      setSelectedQuestions([...selectedQuestions, question]);
    }
  };

  // Tạo đề thi mới
  const handleCreateExam = async () => {
    try {
      const examData = {
        quizName: formData.quizName,
        totalQuestion: selectedQuestions.length,
        duration: parseInt(formData.duration),
        subjectId: formData.subjectId,
        questionIds: selectedQuestions.map(q => q.id) // Thêm danh sách ID câu hỏi
      };

      const response = await fetch('http://26.184.129.66:8080/api/v1/quizzes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(examData)
      });

      if (response.ok) {
        toast.success('Tạo đề thi thành công');
        setOpenDialog(false);
        setSelectedQuestions([]);
        fetchExams();
      } else {
        toast.error('Lỗi khi tạo đề thi');
      }
    } catch (error) {
      toast.error('Lỗi khi tạo đề thi');
    }
  };

  // Xóa đề thi
  const handleDeleteExam = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa đề thi này?')) {
      try {
        const response = await fetch(`http://26.184.129.66:8080/api/v1/quizzes/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.ok) {
          toast.success('Xóa đề thi thành công');
          fetchExams();
          // Kiểm tra lại số trang sau khi cập nhật danh sách xóa
          const updatedExams = exams; 
          const totalPagesAfterDelete = Math.ceil(updatedExams.length / pageSize);

          // Nếu trang hiện tại lớn hơn tổng số trang, chuyển về trang cuối
          if (currentPage > totalPagesAfterDelete) {
            setCurrentPage(totalPagesAfterDelete);
          }
        } else {
          toast.error('Lỗi khi xóa đề thi');
        }
      } catch (error) {
        toast.error('Lỗi khi xóa đề thi');
      }
    }
  };

  // Mở dialog chỉnh sửa và điền dữ liệu
  const handleEditExam = async (exam) => {
    try {
      // Lấy chi tiết đề thi bao gồm câu hỏi
      const response = await fetch(`http://26.184.129.66:8080/api/v1/quizzes/${exam.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        const examDetail = data.result;
        
        // Cập nhật form data với thông tin đề thi và câu hỏi
        setEditFormData({
          id: exam.id,
          quizName: examDetail.quizName,
          totalQuestion: examDetail.totalQuestion,
          duration: examDetail.duration,
          subjectId: examDetail.subject.id,
          questions: examDetail.questionHistories || [] // Lưu danh sách câu hỏi hiện tại
        });

        // Cập nhật selectedQuestions cho dialog chọn câu hỏi
        setSelectedQuestions(examDetail.questionHistories || []);
        setOpenEditDialog(true);
      }
    } catch (error) {
      toast.error('Lỗi khi tải thông tin đề thi');
    }
  };

  // Lưu chỉnh sửa đề thi
  const handleSaveEdit = async (examId) => {
    try {
      // Tách riêng questionIds và questionHistoryIds
      const questionIds = selectedQuestions
        .filter(q => !q.hasOwnProperty('answerHistories')) // Là Question nếu không có answerHistories
        .map(q => q.id);
        
      const questionHistoryIds = selectedQuestions
        .filter(q => q.hasOwnProperty('answerHistories')) // Là QuestionHistory nếu có answerHistories
        .map(q => q.id);

      const response = await fetch(`http://26.184.129.66:8080/api/v1/quizzes/${examId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          quizName: editFormData.quizName,
          totalQuestion: selectedQuestions.length,
          duration: parseInt(editFormData.duration),
          subjectId: editFormData.subjectId,
          questionIds: questionIds,
          questionHistoryIds: questionHistoryIds
        })
      });

      if (response.ok) {
        toast.success('Cập nhật đề thi thành công');
        setOpenEditDialog(false);
        setSelectedQuestions([]);
        fetchExams();
      } else {
        toast.error('Lỗi khi cập nhật đề thi');
      }
    } catch (error) {
      toast.error('Lỗi khi cập nhật đề thi');
    }
  };

  // Thêm dialog chọn câu hỏi
  const QuestionSelectionDialog = () => (
    <Dialog open={openQuestionDialog} onClose={() => setOpenQuestionDialog(false)} maxWidth="md" fullWidth>
      <DialogTitle>
        Chọn câu hỏi 
        <Typography variant="subtitle1" color="textSecondary">
          Đã chọn: {selectedQuestions.length} câu
        </Typography>
      </DialogTitle>
      <DialogContent>
        <List>
          {questions.map((question) => (
            <ListItem key={question.id} disablePadding>
              <ListItemButton onClick={() => handleQuestionSelect(question)}>
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={selectedQuestions.some(q => q.id === question.id)}
                    tabIndex={-1}
                    disableRipple
                  />
                </ListItemIcon>
                <ListItemText 
                  primary={question.questionText}
                  secondary={
                    <React.Fragment>
                      <Typography component="span" variant="body2" color="textPrimary">
                        Độ khó: {question.level}
                      </Typography>
                      <br />
                      {question.answers?.map((answer, index) => (
                        <Typography key={index} component="span" variant="body2" color={answer.isCorrect ? "success.main" : "text.primary"}>
                          {index + 1}. {answer.answerText}{' '}
                        </Typography>
                      ))}
                    </React.Fragment>
                  }
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenQuestionDialog(false)}>Đóng</Button>
      </DialogActions>
    </Dialog>
  );

  // Hàm mở dialog chỉnh sửa câu hỏi
  const handleEditQuestion = (question) => {
    setEditingQuestion(question);
    setQuestionFormData({
      questionText: question.questionText,
      level: question.level,
      answers: question.answerHistories ? question.answerHistories.map(answer => ({
        id: answer.id,
        answerText: answer.answerText,
        isCorrect: answer.isCorrect
      })) : question.answers.map(answer => ({
        id: answer.id, 
        answerText: answer.answerText,
        isCorrect: answer.isCorrect
      }))
    });
    setOpenQuestionEditDialog(true);
  };

  // Hàm xử lý thay đổi câu trả lời
  const handleAnswerChange = (index, field, value) => {
    const newAnswers = [...questionFormData.answers];
    if (field === 'isCorrect') {
      // Reset tất cả về 0 trước khi set câu trả lời đúng
      newAnswers.forEach(answer => answer.isCorrect = 0);
      newAnswers[index][field] = value ? 1 : 0;
    } else {
      newAnswers[index][field] = value;
    }
    setQuestionFormData({ ...questionFormData, answers: newAnswers });
  };

  // Hàm lưu chỉnh sửa câu hỏi
  const handleSaveQuestionEdit = async () => {
    try {
      const isQuestionHistory = editingQuestion.hasOwnProperty('answerHistories');
      const endpoint = isQuestionHistory 
        ? `http://26.184.129.66:8080/api/v1/question-histories/${editingQuestion.id}`
        : `http://26.184.129.66:8080/api/v1/questions/${editingQuestion.id}`;

      // Log để debug
      console.log('editingQuestion:', editingQuestion);
      console.log('questionFormData:', questionFormData);

      // Kiểm tra và lấy subjectId từ editFormData nếu không có trong editingQuestion
      const subjectId = editingQuestion.subject?.id || editFormData.subjectId;

      if (!subjectId) {
        toast.error('Không tìm thấy thông tin môn học');
        return;
      }

      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          questionText: questionFormData.questionText,
          level: questionFormData.level,
          subjectId: subjectId,
          answers: questionFormData.answers.map(answer => ({
            answerText: answer.answerText,
            isCorrect: answer.isCorrect
          }))
        })
      });

      if (response.ok) {
        toast.success('Cập nhật câu hỏi thành công');
        setOpenQuestionEditDialog(false);
        
        // Gọi API để lấy lại thông tin đề thi sau khi cập nhật câu hỏi
        handleEditExam({ id: editFormData.id });
      } else {
        toast.error('Lỗi khi cập nhật câu hỏi');
      }
    } catch (error) {
      console.error(error);
      toast.error('Lỗi khi cập nhật câu hỏi');
    }
  };

  // Lấy dữ liệu câu hỏi của đề thi
  const handlePreviewClick = (exam) => {
    setSelectedExam(exam.questionHistories); 
    setIsPopupOpen(true); // Mở popup
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedExam(null);
  };
  // Tính toán dữ liệu phân trang
  const paginatedExams = filteredExams.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalPages = Math.ceil(filteredExams.length / pageSize); // Tổng số trang

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
        width: '15%', backgroundColor: '#fff', padding: '10px', borderRadius: '8px', border: '1px solid #ccc',
      }}
      >     
        <Box sx={{
          backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '4px', fontWeight: 'bold',
          textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.2)', marginBottom: '10px',
        }}
        >
          Ngân hàng câu hỏi
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
          onClick={() => setOpenDialog(true)}
          sx={{ mb: 2 }}
          style={{
            backgroundColor: '#d30000', color: 'white', padding: '10px 20px', border: 'none',
            borderRadius: '5px', marginBottom: '30px', cursor: 'pointer'
          }}
        >
          Tạo đề thi mới
        </button>
    
        <TableContainer component={Paper}>
          <Table
            exams={paginatedExams} 
            currentPage={currentPage} // Truyền trang hiện tại
            pageSize={pageSize} >
            <TableHead>
              <TableRow style={{background: "#F7F7F7"}}>
                <TableCell>Tên đề thi</TableCell>
                <TableCell>Môn học</TableCell>
                <TableCell>Thời gian (phút)</TableCell>
                <TableCell>Số câu hỏi</TableCell>
                <TableCell>Xem trước</TableCell>
                <TableCell>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredExams.map((exam, localIndex) => {
                const globalIndex = (currentPage - 1) * pageSize + localIndex;
                return (
                  <TableRow key={globalIndex}>
                    <TableCell>{exam.quizName}</TableCell>
                    <TableCell>{exam.subject.subjectName}</TableCell>
                    <TableCell>{exam.duration}</TableCell>
                    <TableCell>{exam.totalQuestion}</TableCell>
                    <TableCell >
                      <IconButton onClick={() => handlePreviewClick(exam)}>
                        <VisibilityIcon color="primary" />
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => handleEditExam(exam)}
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
                        onClick={() => handleDeleteExam(exam.id)}
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
        {filteredExams.length > 0 ? ( // Kiểm tra nếu danh sách không rỗng thì hiển thị phân trang
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
            <p>Hiện tại chưa có dữ liệu bài thi.</p>
          </Box>
        )}

        {/* Dialog tạo đề thi mới */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>Tạo đề thi mới</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Tên đề thi"
                  value={formData.quizName}
                  onChange={(e) => setFormData({ ...formData, quizName: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Môn học</InputLabel>
                  <Select
                    value={formData.subjectId}
                    onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                  >
                    {subjects.map((subject) => (
                      <MenuItem key={subject.id} value={subject.id}>
                        {subject.subjectName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Thời gian làm bài (phút)"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                />
              </Grid>
              {/* <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Số câu hỏi"
                  value={formData.totalQuestion}
                  onChange={(e) => setFormData({ ...formData, totalQuestion: e.target.value })}
                />
              </Grid> */}
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => setOpenQuestionDialog(true)}
                  startIcon={<AddIcon />}
                >
                  Chọn câu hỏi ({selectedQuestions.length} câu đã chọn)
                </Button>
              </Grid>

              {selectedQuestions.length > 0 && (
                <Grid item xs={12}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Câu hỏi đã chọn:
                    </Typography>
                    <List dense>
                      {selectedQuestions.map((question, index) => (
                        <ListItem key={question.id}>
                          <ListItemText
                            primary={`${index + 1}. ${question.questionText}`}
                          />
                          <IconButton 
                            edge="end" 
                            onClick={() => handleQuestionSelect(question)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                </Grid>
              )}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
            <Button 
              onClick={handleCreateExam} 
              variant="contained" 
              color="primary"
              disabled={selectedQuestions.length === 0}
            >
              Tạo đề thi
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog chỉnh sửa đề thi */}
        <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>Chỉnh sửa đề thi</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Tên đề thi"
                  value={editFormData.quizName}
                  onChange={(e) => setEditFormData({ ...editFormData, quizName: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Môn học</InputLabel>
                  <Select
                    value={editFormData.subjectId}
                    onChange={(e) => setEditFormData({ ...editFormData, subjectId: e.target.value })}
                  >
                    {subjects.map((subject) => (
                      <MenuItem key={subject.id} value={subject.id}>
                        {subject.subjectName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Thời gian làm bài (phút)"
                  value={editFormData.duration}
                  onChange={(e) => setEditFormData({ ...editFormData, duration: e.target.value })}
                />
              </Grid>

              {/* Phần quản lý câu hỏi */}
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => setOpenQuestionDialog(true)}
                  startIcon={<AddIcon />}
                >
                  Quản lý câu hỏi ({selectedQuestions.length} câu đã chọn)
                </Button>
              </Grid>

              {/* Hiển thị danh sách câu hỏi đã chọn */}
              {selectedQuestions.length > 0 && (
                <Grid item xs={12}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Câu hỏi trong đề thi:
                    </Typography>
                    <List dense>
                      {selectedQuestions.map((question, index) => (
                        <ListItem key={question.id}>
                          <ListItemText
                            primary={`${index + 1}. ${question.questionText}`}
                            secondary={
                              <Typography variant="body2" color="textSecondary">
                                {question.answerHistories?.map((answer, i) => (
                                  answer.isCorrect === 1 ? 
                                    `Đáp án đúng: ${answer.answerText}` : ''
                                )).filter(Boolean).join(', ')}
                              </Typography>
                            }
                          />
                          <IconButton 
                            edge="end" 
                            onClick={() => handleEditQuestion(question)}
                            color="primary"
                            sx={{ mr: 1 }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton 
                            edge="end" 
                            onClick={() => handleQuestionSelect(question)}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                </Grid>
              )}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {
              setOpenEditDialog(false);
              setSelectedQuestions([]);
            }}>
              Hủy
            </Button>
            <Button 
              onClick={() => handleSaveEdit(editFormData.id)} 
              variant="contained" 
              color="primary"
              disabled={selectedQuestions.length === 0}
            >
              Lưu thay đổi
            </Button>
          </DialogActions>
        </Dialog>

        {/* Thêm dialog chọn câu hỏi */}
        <QuestionSelectionDialog />

        {/* Dialog chỉnh sửa câu hỏi */}
        <Dialog open={openQuestionEditDialog} onClose={() => setOpenQuestionEditDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>Chỉnh sửa câu hỏi</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <TextField
                label="Nội dung câu hỏi"
                fullWidth
                value={questionFormData.questionText}
                onChange={(e) => setQuestionFormData({...questionFormData, questionText: e.target.value})}
              />
              
              <FormControl fullWidth>
                <InputLabel>Cấp độ</InputLabel>
                <Select
                  value={questionFormData.level}
                  onChange={(e) => setQuestionFormData({...questionFormData, level: e.target.value})}
                  label="Cấp độ"
                >
                  <MenuItem value={1}>Dễ</MenuItem>
                  <MenuItem value={2}>Trung bình</MenuItem>
                  <MenuItem value={3}>Khó</MenuItem>
                </Select>
              </FormControl>

              {questionFormData.answers.map((answer, index) => (
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
                        onChange={(e) => handleAnswerChange(index, 'isCorrect', e.target.checked)}
                      />
                    }
                    label="Đáp án đúng"
                  />
                </Box>
              ))}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenQuestionEditDialog(false)}>Hủy</Button>
            <Button onClick={handleSaveQuestionEdit} variant="contained" color="primary">
              Lưu thay đổi
            </Button>
          </DialogActions>
        </Dialog>
        {/* Popup show bài thi xem trước*/}
        <ExamPopup open={isPopupOpen} onClose={handleClosePopup} examData={selectedExam} />
      </Box>
    </Box>
  );
};

export default ExamManagement;


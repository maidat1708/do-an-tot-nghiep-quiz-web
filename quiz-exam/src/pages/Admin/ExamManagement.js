import React, { useState, useEffect, useRef } from 'react';
import { Typography,Button,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Paper,Dialog,DialogTitle,DialogContent,
  DialogActions,TextField,FormControl,InputLabel,Select,MenuItem,Grid,IconButton,Box,List,ListItem,
  ListItemButton,ListItemIcon,ListItemText,Checkbox,Radio,FormControlLabel,Pagination,Tooltip} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash } from "react-icons/fa";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ExamPopup from "../../components/ExamPopup";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import RadioGroup from '@mui/material/RadioGroup';
import FormLabel from '@mui/material/FormLabel';
import Menu from '@mui/material/Menu';

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
  const [openImportDialog, setOpenImportDialog] = useState(false);
  const [importFormData, setImportFormData] = useState({
    subjectId: '',
    quizName: '',
    duration: '',
    file: null
  });
  const [importType, setImportType] = useState('excel'); // 'excel', 'word', 'pdf'
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedExamId, setSelectedExamId] = useState(null);
  const [openPreviewDialog, setOpenPreviewDialog] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');

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
        
        // Cập nhật form data vi thông tin đề thi và câu hỏi
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

  // Lấy dữ liệu câu hỏi ca đề thi
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

  const totalPages = Math.ceil(filteredExams.length / pageSize); // Tng s trang

  // Xử lý thay đổi trang
  const handlePageChange = (event, value) => setCurrentPage(value);

  // Xử lý thay đổi số lượng hiển thị
  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value);
    setCurrentPage(1); // Reset về trang đầu tiên
  };

  // Hàm xử lý export đề thi
  const handleExportExam = async (examId) => {
    try {
      const response = await fetch(`http://26.184.129.66:8080/api/v1/quizzes/${examId}/export`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `exam_${examId}.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success('Xuất đề thi thành công');
      } else {
        toast.error('Lỗi khi xuất đề thi');
      }
    } catch (error) {
      console.error('Error exporting exam:', error);
      toast.error('Lỗi khi xuất đề thi');
    }
  };

  // Hàm xử lý import đề thi
  const handleImportExam = async () => {
    if (!importFormData.file) return;

    const formData = new FormData();
    formData.append('file', importFormData.file);
    formData.append('subjectId', importFormData.subjectId);
    formData.append('quizName', importFormData.quizName);
    formData.append('duration', importFormData.duration);

    let importUrl = 'http://26.184.129.66:8080/api/v1/quizzes/';
    switch(importType) {
      case 'excel':
        importUrl += 'import-excel';
        break;
      case 'word':
        importUrl += 'import-word';
        break;
      case 'pdf':
        importUrl += 'import-pdf';
        break;
    }

    try {
      const response = await fetch(importUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (response.ok) {
        toast.success('Import đề thi thành công');
        fetchExams();
        setOpenImportDialog(false);
        setImportFormData({
          subjectId: '',
          quizName: '',
          duration: '',
          file: null
        });
      } else {
        toast.error('Lỗi khi import đề thi');
      }
    } catch (error) {
      console.error('Error importing exam:', error);
      toast.error('Lỗi khi import đề thi');
    }
  };

  const handleExportWord = async (examId, templateId) => {
    try {
      const response = await fetch(
        `http://26.184.129.66:8080/api/v1/quizzes/${examId}/export-word?templateId=${templateId}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            "Access-Control-Allow-Origin": "*",
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Export failed');
      }

      const blob = await response.blob();
      const filename = `quiz_${examId}.docx`;
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Xuất file Word thành công');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Lỗi khi xuất file Word');
    }
  };

  const handleExportPDF = async (examId, templateId) => {
    try {
      const response = await fetch(
        `http://26.184.129.66:8080/api/v1/quizzes/${examId}/export-pdf?templateId=${templateId}`, 
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            "Access-Control-Allow-Origin": "*",
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `quiz_${examId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success('Xuất file PDF thành công');
      } else {
        toast.error('Lỗi khi xuất file PDF');
      }
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast.error('Lỗi khi xuất file PDF');
    }
  };

  const handleExportClick = (event, examId) => {
    setAnchorEl(event.currentTarget);
    setSelectedExamId(examId);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedExamId(null);
  };

  const handleViewSampleTemplate = async () => {
    try {
      const token = localStorage.getItem('token');
      const endpoint = importType === 'word' ? 'word' : 'pdf';
      
      const response = await fetch(`http://26.184.129.66:8080/api/v1/templates/sample/${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch template');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      if (importType === 'word') {
        setOpenPreviewDialog(true);
      } else {
        // Hiển thị PDF trong dialog
        setPreviewUrl(url);
        setOpenPreviewDialog(true);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Lỗi khi tải template mẫu');
    }
  };

  const handleDownloadWordTemplate = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://26.184.129.66:8080/api/v1/templates/sample/word`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to download template');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'template.docx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      setOpenPreviewDialog(false);
      toast.success('Tải template thành công');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Lỗi khi tải template');
    }
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
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)', // Hiệu ứng bng khi hover
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpenDialog(true)}
              startIcon={<AddIcon />}
            >
              Thêm đề thi
            </Button>
            
            <Tooltip title="Import đề thi">
              <Button
                variant="contained"
                color="secondary"
                onClick={() => setOpenImportDialog(true)}
                startIcon={<FileUploadIcon />}
              >
                Import
              </Button>
            </Tooltip>
          </Box>
        </Box>
    
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
                <TableCell align="center">Xem trước</TableCell>
                <TableCell>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedExams.map((exam, localIndex) => {
                const globalIndex = (currentPage - 1) * pageSize + localIndex;
                return (
                  <TableRow key={globalIndex}>
                    <TableCell>{exam.quizName}</TableCell>
                    <TableCell>{exam.subject.subjectName}</TableCell>
                    <TableCell>{exam.duration}</TableCell>
                    <TableCell>{exam.totalQuestion}</TableCell>
                    <TableCell align="center">
                      <IconButton onClick={() => handlePreviewClick(exam)}>
                        <VisibilityIcon sx={{ color: '#1976d2' }} />
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        gap: '16px',  // Tăng khoảng cách giữa các nút
                        padding: '0 8px' // Thêm padding để tránh sát mép
                      }}>
                        <IconButton 
                          onClick={() => handleEditExam(exam)}
                          style={{ padding: '8px' }} // Thêm padding cho button
                        >
                          <FaEdit size={18} style={{ color: '#4CAF50' }} />
                        </IconButton>
                        
                        <IconButton 
                          onClick={() => handleDeleteExam(exam.id)}
                          style={{ padding: '8px' }}
                        >
                          <FaTrash size={18} style={{ color: '#f44336' }} />
                        </IconButton>

                        <IconButton onClick={(e) => handleExportClick(e, exam.id)}>
                          <FileDownloadIcon sx={{ color: '#2196F3' }} />
                        </IconButton>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        {paginatedExams.length > 0 ? ( // Kiểm tra nếu danh sách không rỗng thì hiển thị phân trang
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
                label="Ni dung cau hoi"
                fullWidth
                value={questionFormData.questionText}
                onChange={(e) => setQuestionFormData({...questionFormData, questionText: e.target.value})}
              />
              
              <FormControl fullWidth>
                <InputLabel>Cap do</InputLabel>
                <Select
                  value={questionFormData.level}
                  onChange={(e) => setQuestionFormData({...questionFormData, level: e.target.value})}
                  label="Cap do"
                >
                  <MenuItem value={1}>Dễ</MenuItem>
                  <MenuItem value={2}>Trung bình</MenuItem>
                  <MenuItem value={3}>Khó</MenuItem>
                </Select>
              </FormControl>

              {questionFormData.answers.map((answer, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <TextField
                    label={`Dap an ${String.fromCharCode(65 + index)}`}
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
                    label="Dap an dung"
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

        <Dialog open={openImportDialog} onClose={() => setOpenImportDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Import Đề Thi</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                fullWidth
                label="Tên đề thi"
                value={importFormData.quizName}
                onChange={(e) => setImportFormData({ ...importFormData, quizName: e.target.value })}
              />
              
              <FormControl fullWidth>
                <InputLabel id="subject-select-label">Môn học</InputLabel>
                <Select
                  labelId="subject-select-label"
                  label="Môn học"
                  value={importFormData.subjectId}
                  onChange={(e) => setImportFormData({ ...importFormData, subjectId: e.target.value })}
                >
                  {subjects.map((subject) => (
                    <MenuItem key={subject.id} value={subject.id}>
                      {subject.subjectName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                type="number"
                label="Thời gian làm bài (phút)"
                value={importFormData.duration}
                onChange={(e) => setImportFormData({ ...importFormData, duration: e.target.value })}
              />

              <FormControl component="fieldset" sx={{ mb: 2 }}>
                <FormLabel component="legend">Loại file import</FormLabel>
                <RadioGroup
                  row
                  value={importType}
                  onChange={(e) => setImportType(e.target.value)}
                >
                  <FormControlLabel value="excel" control={<Radio />} label="Excel" />
                  <FormControlLabel value="word" control={<Radio />} label="Word" />
                  <FormControlLabel value="pdf" control={<Radio />} label="PDF" />
                </RadioGroup>
              </FormControl>

              {(importType === 'word' || importType === 'pdf') && (
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleViewSampleTemplate}
                  startIcon={<VisibilityIcon />}
                >
                  Xem Template Mẫu
                </Button>
              )}

              <Button
                variant="outlined"
                component="label"
                startIcon={<CloudUploadIcon />}
              >
                Chọn file {importType.toUpperCase()}
                <input
                  type="file"
                  hidden
                  accept={
                    importType === 'excel' ? '.xlsx,.xls' :
                    importType === 'word' ? '.doc,.docx' :
                    '.pdf'
                  }
                  onChange={(e) => setImportFormData({ ...importFormData, file: e.target.files[0] })}
                />
              </Button>
              {importFormData.file && (
                <Typography variant="body2" color="textSecondary">
                  File đã chọn: {importFormData.file.name}
                </Typography>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenImportDialog(false)}>Hủy</Button>
            <Button
              onClick={handleImportExam}
              variant="contained"
              color="primary"
              disabled={!importFormData.file || !importFormData.quizName || !importFormData.subjectId || !importFormData.duration}
            >
              Import
            </Button>
          </DialogActions>
        </Dialog>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={() => {
            handleExportWord(selectedExamId, 5); // templateId
            handleClose();
          }}>
            Xuất file Word
          </MenuItem>
          <MenuItem onClick={() => {
            handleExportPDF(selectedExamId, 4); // templateId
            handleClose();
          }}>
            Xuất file PDF
          </MenuItem>
        </Menu>

        <Dialog
          open={openPreviewDialog}
          onClose={() => {
            setOpenPreviewDialog(false);
            if (previewUrl) {
              window.URL.revokeObjectURL(previewUrl);
              setPreviewUrl('');
            }
          }}
          maxWidth="lg"
          fullWidth
        >
          <DialogTitle>
            Xem Template {importType.toUpperCase()}
          </DialogTitle>
          <DialogContent>
            {importType === 'word' ? (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>
                  Không thể xem trước file Word trực tiếp
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Vui lòng tải xuống để xem nội dung file Word
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<FileDownloadIcon />}
                  onClick={handleDownloadWordTemplate}
                >
                  Tải Template Word
                </Button>
              </Box>
            ) : (
              <Box sx={{ height: '70vh', width: '100%' }}>
                <embed
                  src={previewUrl}
                  type="application/pdf"
                  width="100%"
                  height="100%"
                />
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {
              setOpenPreviewDialog(false);
              if (previewUrl) {
                window.URL.revokeObjectURL(previewUrl);
                setPreviewUrl('');
              }
            }}>
              Đóng
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default ExamManagement;


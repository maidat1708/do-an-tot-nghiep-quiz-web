import React, { useState, useEffect, useRef, useMemo, useCallback, memo } from 'react';
import { Typography,Button,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Paper,Dialog,DialogTitle,DialogContent,
  DialogActions,TextField,FormControl,InputLabel,Select,MenuItem,Grid,IconButton,Box,List,ListItem,
  ListItemButton,ListItemIcon,ListItemText,Checkbox,Radio,FormControlLabel,Pagination,Tooltip,Chip, InputAdornment, OutlinedInput} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon, Close as CloseIcon, DeleteSweep as DeleteSweepIcon, Check as CheckIcon, DriveFileRenameOutline as DriveFileRenameOutlineIcon, Timer as TimerIcon, Subject as SubjectIcon, Quiz as QuizIcon, South } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash } from "react-icons/fa";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ExamPopup from "../../components/ExamPopup";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import RadioGroup from '@mui/material/RadioGroup';
import FormLabel from '@mui/material/FormLabel';
import Menu from '@mui/material/Menu';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

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
  const [showSelectedAnswers, setShowSelectedAnswers] = useState({});
  const [questionSearchQuery, setQuestionSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);
  const [previewQuestions, setPreviewQuestions] = useState([]);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [editingPreviewQuestion, setEditingPreviewQuestion] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 1000);

    return () => clearTimeout(timer);
  }, [searchQuery]);

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

  // Thêm useEffect để set formData.subjectId khi component mount
  useEffect(() => {
    if (subjects.length > 0) {
      // Set môn học đầu tiên làm mặc định
      const firstSubject = subjects[0];
      setSelectedSubjectId(firstSubject.id);
      setFormData(prev => ({
        ...prev,
        subjectId: firstSubject.id
      }));
    }
  }, [subjects]); // Chạy khi subjects thay đổi

  const filteredExams = selectedSubjectId ? exams.filter((q) => q.subject.id === selectedSubjectId) : exams;
  
  // Gọi API khi component mount
  useEffect(() => {
    fetchExams();
    fetchSubjects();
    fetchQuestions();
    handleSubjectSelect(selectedSubjectId);
  }, []); // Empty dependency array means this runs once when component mounts

  // Xử lý chọn câu hỏi
  const handleQuestionSelect = useCallback((question) => {
    setSelectedQuestions(prev => {
      const existingIndex = prev.findIndex(q => q.questionText === question.questionText);
      
      if (existingIndex >= 0) {
        // Xóa câu hỏi
        setShowSelectedAnswers(prev => {
          const newState = { ...prev };
          delete newState[question.id];
          return newState;
        });
        return prev.filter((_, index) => index !== existingIndex);
      }
      
      // Thêm câu hỏi mới
      setShowSelectedAnswers(prev => ({
        ...prev,
        [question.id]: false
      }));

      // Cập nhật số lượng câu hỏi trong formData
      setFormData(prev => ({
        ...prev,
        totalQuestion: prev.length + 1
      }));

      return [...prev, question];
    });
  }, []);

  // Thêm hàm kiểm tra câu hỏi trùng lặp
  const isQuestionDuplicate = useCallback((question1, question2) => {
    return question1.questionText === question2.questionText;
  }, []);

  // Sửa lại hàm xử lý khi thay đổi giá trị form
  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    console.log('Form data after change:', formData); // Để debug
  };

  // Tạo đề thi mới
  const handleCreateExam = async (value) => {
    try {
      console.log(value)
      // Kiểm tra dữ liệu trước khi gửi
      if (!value.quizName || !value.duration || !formData.subjectId) {
        toast.error('Vui lòng điền đầy đủ thông tin');
        return;
      }

      const examData = {
        quizName: value.quizName.trim(),
        totalQuestion: selectedQuestions.length,
        duration: parseInt(value.duration),
        subjectId: formData.subjectId,
        questionIds: selectedQuestions.map(q => q.id)
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
        // Reset form sau khi tạo thành công
        setFormData({
          quizName: '',
          totalQuestion: '',
          duration: '',
          subjectId: subjects.length > 0 ? subjects[0].id : ''
        });
        setSelectedQuestions([]);
        fetchExams();
      } else {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        toast.error('Lỗi khi tạo đề thi');
      }
    } catch (error) {
      console.error('Error creating exam:', error);
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
  const QuestionSelectionDialog = () => {
    // Thay đổi thành một object để theo dõi trạng thái hiển thị của từng câu hỏi
    const [showAnswers, setShowAnswers] = useState({});

    // Hàm toggle cho từng câu hỏi
    const toggleAnswers = (questionId, event) => {
      event.stopPropagation(); // Ngăn không cho sự kiện click lan ra ListItemButton
      setShowAnswers(prev => ({
        ...prev,
        [questionId]: !prev[questionId]
      }));
    };

    // Thêm hàm xử lý xóa tất cả
    const handleClearAll = () => {
      // Hiển thị dialog xác nhận trước khi xóa
      if (window.confirm('Bạn có chắc chắn muốn xóa tất cả câu hỏi đã chọn?')) {
        setSelectedQuestions([]);
        toast.success('Đã xóa tất cả câu hỏi đã chọn');
      }
    };

    return (
      <Dialog 
        open={openQuestionDialog}
        onClose={() => {
          setOpenQuestionDialog(false);
          setSearchQuery('');
        }}
        maxWidth="md"
        fullWidth
        TransitionProps={{
          enter: false,
          exit: false
        }}
        sx={{
          '& .MuiDialog-paper': {
            transition: 'none !important'
          }
        }}
      >
        <DialogTitle sx={{ 
          borderBottom: '1px solid #e0e0e0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 24px',
          backgroundColor: '#f8f9fa'
        }}>
          <Box>
            <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
              Chọn câu hỏi
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
              <Chip
                label={subjects.find(s => s.id === selectedSubjectId)?.subjectName}
                color="info"
                size="small"
                variant="outlined"
                icon={<SubjectIcon />}
                sx={{ 
                  fontWeight: 500,
                  '& .MuiChip-icon': { 
                    fontSize: 18 
                  }
                }}
              />
              <Chip
                label={`Đã chọn: ${selectedQuestions.length}`}
                color="primary"
                size="small"
                icon={<CheckCircleOutlineIcon />}
                sx={{ 
                  fontWeight: 500,
                  backgroundColor: selectedQuestions.length > 0 ? 'primary.main' : 'grey.300',
                  '& .MuiChip-icon': { 
                    fontSize: 18 
                  }
                }}
              />
            </Box>
          </Box>
          {/* Nút Xóa tất cả */}
          <Button
            variant="outlined"
            size="small"
            color="error"
            onClick={handleClearAll}
            startIcon={<DeleteSweepIcon />}
            disabled={selectedQuestions.length === 0}
            sx={{
              '&.Mui-disabled': {
                borderColor: 'grey.300',
                color: 'grey.400'
              }
            }}
          >
            Xóa tất cả
          </Button>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ mb: 2, mt: 1 }}>
            <OutlinedInput
              inputRef={searchInputRef}
              fullWidth
              autoFocus
              placeholder="Tìm kiếm câu hỏi..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
              onBlur={(e) => {
                e.preventDefault();
                searchInputRef.current?.focus();
              }}
              startAdornment={
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              }
              endAdornment={
                searchQuery && (
                  <InputAdornment position="end">
                    <IconButton 
                      size="small" 
                      onClick={() => {
                        setSearchQuery('');
                        setDebouncedSearchQuery('');
                        searchInputRef.current?.focus();
                      }}
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                )
              }
              size="small"
            />
          </Box>
          <List sx={{ width: '100%', bgcolor: 'background.paper', pt: 0 }}>
            {questions
              .filter(question => 
                question.subject.id === selectedSubjectId && 
                question.questionText.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
              )
              .map((question, index) => (
                <ListItem 
                  key={question.id} 
                  disablePadding
                  sx={{
                    borderBottom: '1px solid #f0f0f0',
                    '&:hover': {
                      backgroundColor: '#f5f5f5'
                    }
                  }}
                >
                  <ListItemButton 
                    onClick={(e) => {
                      e.preventDefault();
                      handleQuestionSelect(question);
                    }}
                  >
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={selectedQuestions.some(
                          selectedQ => selectedQ.questionText === question.questionText
                        )}
                        onChange={(e) => {
                          e.stopPropagation();
                          // Chỉ gọi handleQuestionSelect khi trạng thái checkbox thực sự thay đổi
                          if (e.target.checked !== selectedQuestions.some(
                            selectedQ => selectedQ.questionText === question.questionText
                          )) {
                            handleQuestionSelect(question);
                          }
                        }}
                        tabIndex={-1}
                        disableRipple
                        sx={{
                          '& .MuiSvgIcon-root': {
                            transition: 'none !important'
                          },
                          '&:hover': {
                            backgroundColor: 'transparent'
                          }
                        }}
                      />
                    </ListItemIcon>
                    <Box sx={{ flex: 1, py: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                            Câu {index + 1}. {question.questionText}
                          </Typography>
                          <IconButton 
                            size="small"
                            onClick={(e) => toggleAnswers(question.id, e)}
                            sx={{ ml: 1 }}
                          >
                            {showAnswers[question.id] ? 
                              <VisibilityOffIcon fontSize="small" /> : 
                              <VisibilityIcon fontSize="small" />
                            }
                          </IconButton>
                        </Box>
                        <Chip 
                          label={`Độ khó: ${question.level}`}
                          size="small"
                          color={question.level === 1 ? "success" : question.level === 2 ? "warning" : "error"}
                        />
                      </Box>
                      {/* Hiển thị đáp án chỉ khi câu hỏi đó được toggle */}
                      {showAnswers[question.id] && (
                        <Box sx={{ pl: 2 }}>
                          {question.answers?.map((answer, idx) => (
                            <Typography 
                              key={idx} 
                              variant="body2" 
                              sx={{ 
                                color: answer.isCorrect ? 'success.main' : 'text.primary',
                                mb: 0.5,
                                display: 'flex',
                                alignItems: 'center'
                              }}
                            >
                              <Box 
                                component="span" 
                                sx={{ 
                                  minWidth: '24px',
                                  height: '24px',
                                  borderRadius: '12px',
                                  backgroundColor: answer.isCorrect ? 'success.light' : 'grey.200',
                                  color: answer.isCorrect ? 'white' : 'text.primary',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  mr: 1,
                                  fontSize: '0.875rem'
                                }}
                              >
                                {String.fromCharCode(65 + idx)}
                              </Box>
                              {answer.answerText}
                            </Typography>
                          ))}
                        </Box>
                      )}
                    </Box>
                  </ListItemButton>
                </ListItem>
              ))}
          </List>
        </DialogContent>
        <DialogActions sx={{ 
          borderTop: '1px solid #e0e0e0',
          padding: '16px 24px'
        }}>
          <Button 
            onClick={() => setOpenQuestionDialog(false)}
            variant="outlined"
            startIcon={<CloseIcon />}
          >
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

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

  // Thêm hàm xử lý khi chọn môn học từ sidebar
  const handleSubjectSelect = (subjectId) => {
    setSelectedSubjectId(subjectId);
    setFormData(prev => ({
      ...prev,
      subjectId: subjectId
    }));
  };

  // Lọc câu hỏi theo môn học được chọn
  const filteredQuestions = useMemo(() => {
    if (!selectedSubjectId) return [];
    return questions.filter(question => question.subject.id === selectedSubjectId);
  }, [questions, selectedSubjectId]);

  const filteredQuestionList = useMemo(() => {
    return questions.filter(question => 
      question.questionText.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
    );
  }, [questions, debouncedSearchQuery]);

  const CreateExamDialog = () => {
    // Tách state form ra
    const [formValues, setFormValues] = useState({
      quizName: '',
      duration: ''
    });

    // Xử lý thay đổi input
    const handleInputChange = (field) => (event) => {
      const value = event.target.value;
      setFormValues(prev => ({
        ...prev,
        [field]: value
      }));
    };

    // Xử lý đóng dialog
    const handleClose = () => {
      setOpenDialog(false);
      setFormValues({ quizName: '', duration: '' });
      setSelectedQuestions([]); // Reset selected questions
    };

    // Xử lý tạo đề thi
    const handleSubmit = () => {
      handleCreateExam(formValues);
      setFormValues({ quizName: '', duration: '' });
      setSelectedQuestions([]); // Reset selected questions
    };

    return (
      <Dialog 
        open={openDialog} 
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            minWidth: '600px'
          }
        }}
      >
        <DialogTitle 
          sx={{ 
            borderBottom: '1px solid #e0e0e0',
            backgroundColor: '#f8f9fa',
            padding: '16px 24px',
            paddingBottom: '16px',
            marginBottom: '8px',
          }}
        >
          <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
            Tạo đề thi mới
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
            <Chip
              label={subjects.find(s => s.id === formData.subjectId)?.subjectName}
              color="info"
              size="small"
              variant="outlined"
              icon={<SubjectIcon />}
              sx={{ fontWeight: 500 }}
            />
          </Box>
        </DialogTitle>

        <DialogContent 
          sx={{ 
            padding: '24px',
            paddingTop: '16px',
            marginTop: '10px'
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField
              fullWidth
              label="Tên đề thi"
              value={formValues.quizName}
              onChange={handleInputChange('quizName')}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ pl: 0.5 }}>
                    <DriveFileRenameOutlineIcon color="action" sx={{ fontSize: 20 }} />
                  </InputAdornment>
                )
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  paddingLeft: '8px'
                },
                '& .MuiInputLabel-outlined': {
                  transform: 'translate(14px, 16px) scale(1)'
                },
                '& .MuiInputLabel-outlined.MuiInputLabel-shrink': {
                  transform: 'translate(14px, -5px) scale(0.75)'
                }
              }}
            />

            <TextField
              fullWidth
              label="Thời gian làm bài"
              type="number"
              value={formValues.duration}
              onChange={handleInputChange('duration')}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <TimerIcon color="action" sx={{ fontSize: 20 }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">phút</InputAdornment>
                )
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  paddingLeft: '8px'
                },
                '& .MuiInputLabel-outlined': {
                  transform: 'translate(14px, 16px) scale(1)'
                },
                '& .MuiInputLabel-outlined.MuiInputLabel-shrink': {
                  transform: 'translate(14px, -6px) scale(0.75)'
                }
              }}
            />

            <TextField
              fullWidth
              label="Môn học"
              value={subjects.find(s => s.id === formData.subjectId)?.subjectName || ''}
              disabled
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SubjectIcon color="action" sx={{ fontSize: 20 }} />
                  </InputAdornment>
                )
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  paddingLeft: '8px'
                },
                '& .MuiInputLabel-outlined': {
                  transform: 'translate(14px, 16px) scale(1)'
                },
                '& .MuiInputLabel-outlined.MuiInputLabel-shrink': {
                  transform: 'translate(14px, -6px) scale(0.75)'
                }
              }}
            />

            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2,
              backgroundColor: '#f5f5f5',
              padding: '12px 16px',
              borderRadius: '8px'
            }}>
              <QuizIcon color="primary" />
              <Typography>
                Số câu hỏi đã chọn: 
                <Typography
                  component="span"
                  sx={{ 
                    fontWeight: 600,
                    color: 'primary.main',
                    ml: 1
                  }}
                >
                  {selectedQuestions.length}
                </Typography>
              </Typography>
              <Button
                size="small"
                startIcon={<EditIcon />}
                onClick={() => setOpenQuestionDialog(true)}
                sx={{ ml: 'auto' }}
              >
                Chọn câu hỏi
              </Button>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ 
          borderTop: '1px solid #e0e0e0',
          padding: '16px 24px',
          gap: 1
        }}>
          <Button 
            onClick={handleClose}
            variant="outlined"
            startIcon={<CloseIcon />}
          >
            Hủy
          </Button>
          <Button 
            onClick={handleSubmit}
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={!formValues.quizName || !formValues.duration || selectedQuestions.length === 0}
          >
            Tạo đề thi
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  // Thêm hàm xử lý xóa câu hỏi khỏi danh sách đã chọn
  const handleRemoveQuestion = useCallback((questionId) => {
    setSelectedQuestions(prev => prev.filter(q => q.id !== questionId));
  }, []);

  // Thêm hàm xử lý cập nhật đề thi
  const handleUpdateExam = async () => {
    try {
      const payload = {
        id: editFormData.id,
        quizName: editFormData.quizName,
        totalQuestion: selectedQuestions.length,
        duration: parseInt(editFormData.duration),
        subjectId: editFormData.subjectId,
        questionIds: selectedQuestions.map(q => q.id)
      };

      const response = await fetch(`http://26.184.129.66:8080/api/v1/quizzes/${editFormData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        toast.success('Cập nhật đề thi thành công');
        setOpenEditDialog(false);
        fetchExams(); // Cập nhật lại danh sách đề thi
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Lỗi khi cập nhật đề thi');
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật đề thi:', error);
      toast.error('Lỗi khi cập nhật đề thi');
    }
  };

  // Hàm toggle hiển thị đáp án cho câu hỏi đã chọn
  const toggleSelectedAnswers = useCallback((questionId, event) => {
    event.stopPropagation();
    setShowSelectedAnswers(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  }, []);

  // Sửa lại hàm mở dialog chọn câu hỏi
  const handleOpenQuestionDialog = () => {
    setOpenQuestionDialog(true);
  };

  // Sửa lại hàm mở dialog import
  const handleOpenImportDialog = () => {
    setImportFormData({
      ...importFormData,
      subjectId: selectedSubjectId // Lấy môn học đang được chọn từ sidebar
    });
    setOpenImportDialog(true);
  };

  // Thêm hàm xử lý preview file
  const handlePreviewFile = async (file) => {
    try {
      // Nếu đã có dữ liệu preview và đang xem lại thì không cần gọi API
      if (previewQuestions.length > 0 && showPreviewDialog === false) {
        setShowPreviewDialog(true);
        setOpenImportDialog(false);
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://26.184.129.66:8080/api/v1/quizzes/preview', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        setPreviewQuestions(data.result);
        setShowPreviewDialog(true);
        setOpenImportDialog(false);
      } else {
        const errorData = await response.json();
        toast.error('Lỗi khi đọc file: ' + (errorData.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error previewing file:', error);
      toast.error('Lỗi khi đọc file');
    }
  };

  // Thêm hàm xử lý import sau preview
  const handleImportAfterPreview = async () => {
    try {
      const response = await fetch('http://26.184.129.66:8080/api/v1/quizzes/import-after-preview', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...importFormData,
          questions: previewQuestions
        })
      });

      if (response.ok) {
        toast.success('Import đề thi thành công');
        handleCloseImport();
      } else {
        toast.error('Lỗi khi import đề thi');
      }
    } catch (error) {
      console.error('Error importing exam:', error);
      toast.error('Lỗi khi import đề thi');
    }
  };

  // Sửa lại hàm đóng form import
  const handleCloseImport = () => {
    setOpenImportDialog(false);
    setShowPreviewDialog(false);
    setPreviewQuestions([]);
    setImportFormData({
      subjectId: '',
      quizName: '',
      duration: '',
      file: null
    });
    fetchExams();
  };

  // Sửa lại hàm handleSavePreviewQuestion để cập nhật state chính xác
  const handleSavePreviewQuestion = () => {
    if (!editingPreviewQuestion) return;
    
    setPreviewQuestions(prevQuestions => 
      prevQuestions.map(question => 
        question === editingPreviewQuestion.originalQuestion 
          ? { ...editingPreviewQuestion, originalQuestion: undefined } 
          : question
      )
    );
    setEditingPreviewQuestion(null);
  };

  // Sửa lại hàm handleEditPreviewQuestion để lưu câu hỏi gốc
  const handleEditPreviewQuestion = (question) => {
    setEditingPreviewQuestion({
      ...question,
      originalQuestion: question // Lưu lại câu hỏi gốc để so sánh khi update
    });
  };

  // Thêm các hàm xử lý
  const handleAddAnswer = () => {
    if (!editingPreviewQuestion) return;
    setEditingPreviewQuestion({
      ...editingPreviewQuestion,
      answers: [...editingPreviewQuestion.answers, { answerText: '', isCorrect: 0 }]
    });
  };

  const handleRemoveAnswer = (indexToRemove) => {
    if (!editingPreviewQuestion) return;
    setEditingPreviewQuestion({
      ...editingPreviewQuestion,
      answers: editingPreviewQuestion.answers.filter((_, index) => index !== indexToRemove)
    });
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setImportFormData({
      ...importFormData,
      file: file
    });
    
    // Tự động gọi preview sau khi chọn file
    if (file) {
      await handlePreviewFile(file);
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Thêm sidebar chọn môn học */}
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
        }}>
          Môn học
        </Box>
        {subjects.map((subject) => (
          <Box
            key={subject.id}
            sx={{
              backgroundColor: subject.id === selectedSubjectId ? '#BFEFFF' : '#f5f5f5',
              padding: '10px',
              marginBottom: '8px',
              borderRadius: '4px',
              textAlign: 'center',
              cursor: 'pointer',
              boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
              '&:hover': {
                backgroundColor: subject.id === selectedSubjectId ? '#BFEFFF' : '#e0e0e0',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              },
            }}
            onClick={() => handleSubjectSelect(subject.id)}
          >
            <Typography>
              {subject.subjectName}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Giữ nguyên phần nội dung chính */}
      <Box sx={{ flex: 1, p: 3 }}>
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
                onClick={handleOpenImportDialog}
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
        <CreateExamDialog />

        {/* Dialog chỉnh sửa đề thi */}
        <Dialog 
          open={openEditDialog} 
          onClose={() => setOpenEditDialog(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{ 
            sx: { 
              minWidth: '800px',
              minHeight: '400px',
              position: 'fixed',
              top: '15%',
              '& .MuiDialogTitle-root': {
                padding: '16px 24px',
              },
              '& .MuiDialogContent-root': {
                padding: '16px 24px',
              },
              '& .MuiDialogActions-root': {
                padding: '16px 24px',
              }
            } 
          }}
        >
          <DialogTitle sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            gap: 1.5,
            pb: 2,
            borderBottom: '1px solid #e0e0e0'
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ fontSize: '1.5rem' }}>Chỉnh sửa đề thi</Typography>
              <IconButton onClick={() => setOpenEditDialog(false)} size="medium">
                <CloseIcon />
              </IconButton>
            </Box>
            <Chip 
              label="Math" 
              icon={<SubjectIcon />} 
              size="medium"
              sx={{ 
                alignSelf: 'flex-start',
                backgroundColor: '#e3f2fd',
                color: '#1976d2',
                '& .MuiChip-icon': {
                  color: '#1976d2'
                }
              }}
            />
          </DialogTitle>

          <DialogContent sx={{ pt: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <FormControl fullWidth>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    mb: 0.5,
                    color: 'text.secondary',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <DriveFileRenameOutlineIcon fontSize="small" />
                  Tên đề thi
                </Typography>
                <OutlinedInput
                  value={editFormData.quizName}
                  onChange={(e) => setEditFormData({ ...editFormData, quizName: e.target.value })}
                  size="small"
                  placeholder="Nhập tên đề thi"
                />
              </FormControl>

              <FormControl fullWidth>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    mb: 0.5,
                    color: 'text.secondary',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <TimerIcon fontSize="small" />
                  Thời gian làm bài
                </Typography>
                <OutlinedInput
                  type="number"
                  value={editFormData.duration}
                  onChange={(e) => setEditFormData({ ...editFormData, duration: e.target.value })}
                  size="small"
                  placeholder="Nhập thời gian"
                  endAdornment={<InputAdornment position="end">phút</InputAdornment>}
                />
              </FormControl>

              <FormControl fullWidth>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    mb: 0.5,
                    color: 'text.secondary',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <SubjectIcon fontSize="small" />
                  Môn học
                </Typography>
                <Select
                  value={editFormData.subjectId}
                  onChange={(e) => setEditFormData({ ...editFormData, subjectId: e.target.value })}
                  size="small"
                  disabled
                  sx={{
                    backgroundColor: '#f5f5f5',
                    '& .MuiSelect-select': {
                      color: 'text.primary'
                    }
                  }}
                >
                  {subjects.map((subject) => (
                    <MenuItem key={subject.id} value={subject.id}>
                      {subject.subjectName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                bgcolor: '#f5f5f5',
                borderRadius: 1,
                p: 2
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <QuizIcon sx={{ color: 'primary.main' }} fontSize="small" />
                  <Typography variant="body2">
                    Số câu hỏi đã chọn: {selectedQuestions.length}
                  </Typography>
                </Box>
                <Button
                  variant="text"
                  color="primary"
                  onClick={handleOpenQuestionDialog}
                  startIcon={<EditIcon />}
                  size="small"
                >
                  CHỌN CÂU HỎI
                </Button>
              </Box>
            </Box>
          </DialogContent>

          <DialogActions sx={{ 
            p: 3, 
            gap: 2,
            borderTop: '1px solid #e0e0e0'
          }}>
            <Button 
              onClick={() => setOpenEditDialog(false)}
              variant="outlined"
              size="medium"
              sx={{ minWidth: '100px' }}
            >
              HỦY
            </Button>
            <Button
              onClick={() => handleSaveEdit(editFormData.id)}
              variant="contained"
              startIcon={<SaveIcon />}
              size="medium"
              sx={{ minWidth: '150px' }}
              disabled={!editFormData.quizName || !editFormData.subjectId || !editFormData.duration || selectedQuestions.length === 0}
            >
              SỬA ĐỀ THI
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

        <Dialog open={openImportDialog} onClose={() => setOpenImportDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Import đề thi</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <TextField
                fullWidth
                label="Tên đề thi"
                value={importFormData.quizName}
                onChange={(e) => setImportFormData({ ...importFormData, quizName: e.target.value })}
              />
              
              <FormControl fullWidth disabled>
                <InputLabel>Môn học</InputLabel>
                <Select
                  value={importFormData.subjectId}
                  label="Môn học"
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
                sx={{ mt: 2 }}
                fullWidth
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
                  onChange={handleFileChange}
                />
              </Button>
              {importFormData.file && (
                <Typography variant="body2" color="textSecondary">
                  File đã chọn: {importFormData.file.name}
                </Typography>
              )}
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setOpenImportDialog(false)}>Hủy</Button>
            {selectedFile && (
              <Button
                variant="contained"
                onClick={() => handlePreviewFile(importFormData.file)}
                startIcon={<VisibilityIcon />}
              >
                Xem trước
              </Button>
            )}
          </DialogActions>
        </Dialog>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={() => {
            handleExportWord(selectedExamId, 1); // templateId
            handleClose();
          }}>
            Xuất file Word
          </MenuItem>
          <MenuItem onClick={() => {
            handleExportPDF(selectedExamId, 2); // templateId
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

        {/* Dialog Preview Câu hỏi */}
        <Dialog 
          open={showPreviewDialog} 
          onClose={() => setShowPreviewDialog(false)} 
          maxWidth="md" 
          fullWidth
          PaperProps={{
            sx: {
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column'
            }
          }}
        >
          <DialogTitle>
            Xem trước câu hỏi ({previewQuestions.length})
            <IconButton
              onClick={() => setShowPreviewDialog(false)}
              sx={{ position: 'absolute', right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          
          <DialogContent dividers sx={{ p: 2, overflow: 'auto' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {previewQuestions.map((question, index) => (
                <Paper
                  key={index}
                  elevation={0}
                  sx={{
                    p: 2,
                    border: '1px solid #e0e0e0',
                    borderRadius: 1,
                    '&:hover': {
                      backgroundColor: '#f5f5f5'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography 
                        variant="subtitle1" 
                        sx={{ 
                          fontWeight: 500,
                          color: 'primary.main',
                          minWidth: '60px'
                        }}
                      >
                        Câu {index + 1}
                      </Typography>
                      <Typography>{question.questionText}</Typography>
                      {question.valid === false && question.errorMessage && (
                        <Tooltip title={question.errorMessage || "Câu h�i không hợp lệ"}>
                          <ErrorIcon color="error" sx={{ ml: 1 }} />
                        </Tooltip>
                      )}
                    </Box>
                    <IconButton 
                      onClick={() => handleEditPreviewQuestion(question)}
                      size="small"
                      sx={{ 
                        color: 'primary.main',
                        '&:hover': {
                          backgroundColor: 'primary.lighter'
                        }
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Box>

                  <Box sx={{ pl: 8 }}>
                    <Grid container spacing={2}>
                      {question.answers.map((answer, aIndex) => (
                        <Grid item xs={6} key={aIndex}>
                          <Box
                            sx={{
                              p: 1,
                              borderRadius: 1,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                              backgroundColor: answer.isCorrect === 1 ? 'success.lighter' : 'grey.50',
                              border: '1px solid',
                              borderColor: answer.isCorrect === 1 ? 'success.light' : 'grey.300'
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{
                                color: answer.isCorrect === 1 ? 'success.dark' : 'text.primary',
                                fontWeight: answer.isCorrect === 1 ? 500 : 400
                              }}
                            >
                              {String.fromCharCode(65 + aIndex)}. {answer.answerText}
                            </Typography>
                            {answer.isCorrect === 1 && (
                              <CheckCircleIcon 
                                fontSize="small" 
                                sx={{ 
                                  ml: 'auto',
                                  color: 'success.main'
                                }} 
                              />
                            )}
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </Paper>
              ))}
            </Box>
          </DialogContent>

          <DialogActions sx={{ p: 2 }}>
            <Button 
              onClick={() => {
                setShowPreviewDialog(false);
                setOpenImportDialog(true);
              }}
            >
              Quay lại
            </Button>
            <Button 
              onClick={handleImportAfterPreview} 
              variant="contained"
              disabled={!importFormData.quizName || !importFormData.subjectId || !importFormData.duration}
            >
              Thêm đề thi
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog chỉnh sửa câu hỏi */}
        <Dialog 
          open={!!editingPreviewQuestion} 
          onClose={() => setEditingPreviewQuestion(null)} 
          maxWidth="sm" 
          fullWidth
          PaperProps={{
            sx: { maxHeight: '90vh' }
          }}
        >
          <DialogTitle>Chỉnh sửa câu hỏi</DialogTitle>
          <DialogContent dividers>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                fullWidth
                label="Câu hỏi"
                value={editingPreviewQuestion?.questionText || ''}
                onChange={(e) => setEditingPreviewQuestion({
                  ...editingPreviewQuestion,
                  questionText: e.target.value
                })}
              />
              
              {editingPreviewQuestion?.answers.map((answer, index) => (
                <Box key={index} sx={{ 
                  display: 'flex', 
                  gap: 1,
                  alignItems: 'flex-start' 
                }}>
                  <TextField
                    fullWidth
                    label={`Đáp án ${String.fromCharCode(65 + index)}`}
                    value={answer.answerText}
                    onChange={(e) => {
                      const newAnswers = [...editingPreviewQuestion.answers];
                      newAnswers[index] = { ...answer, answerText: e.target.value };
                      setEditingPreviewQuestion({
                        ...editingPreviewQuestion,
                        answers: newAnswers
                      });
                    }}
                  />
                  <FormControlLabel
                    control={
                      <Radio // Thay Checkbox bằng Radio
                        checked={answer.isCorrect === 1}
                        onChange={(e) => {
                          const newAnswers = editingPreviewQuestion.answers.map((ans, idx) => ({
                            ...ans,
                            isCorrect: idx === index ? 1 : 0 // Set tất cả về 0, chỉ đáp án được chọn là 1
                          }));
                          setEditingPreviewQuestion({
                            ...editingPreviewQuestion,
                            answers: newAnswers
                          });
                        }}
                      />
                    }
                    label="Đúng"
                  />
                  <IconButton 
                    onClick={() => handleRemoveAnswer(index)}
                    color="error"
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}

              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleAddAnswer}
                sx={{ mt: 1 }}
              >
                Thêm đáp án
              </Button>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setEditingPreviewQuestion(null)}>Hủy</Button>
            <Button onClick={handleSavePreviewQuestion} variant="contained">
              Lưu
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default ExamManagement;


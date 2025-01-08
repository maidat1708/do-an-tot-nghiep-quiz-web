import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Chip,
  IconButton,
  Stack,
  Tooltip,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Divider,
  Badge,
  FormHelperText,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import { toast } from 'react-toastify';
import { Edit, Visibility, Assessment, School } from '@mui/icons-material';

const TeacherExamSessions = () => {
  const { loginResponse } = useContext(AuthContext);
  const [examSessions, setExamSessions] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [examSession, setExamSession] = useState(null);
  const [selectedResult, setSelectedResult] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [quizzes, setQuizzes] = useState([]);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    quizId: '',
    startTime: '',
    endTime: '',
    teacherIds: new Set(),
    studentIds: new Set(),
    allowReview: false
  });
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [updateData, setUpdateData] = useState({
    name: '',
    quizId: '',
    startTime: '',
    endTime: '',
    teacherIds: new Set(),
    studentIds: new Set(),
    allowReview: false
  });
  const [selectedExamSession, setSelectedExamSession] = useState(null);
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const drawerWidth = 240;

  useEffect(() => {
    fetchExamSessions();
    fetchQuizzes();
    fetchTeachers();
    fetchStudents();
    fetchSubjects();
  }, []);

  const fetchExamSessions = async () => {
    try {
      const response = await fetch(
        `http://26.184.129.66:8080/api/v1/exam-sessions/teacher/${loginResponse.result.userId}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      const data = await response.json();
      if (data.code === 200) {
        setExamSessions(data.result);
        console.log(data.result)
      } else {
        toast.error('Lỗi khi tải danh sách ca thi');
      }
    } catch (error) {
      toast.error('Lỗi kết nối server');
    }
  };

  const formatDateTime = (dateTimeStr) => {
    return new Date(dateTimeStr).toLocaleString('vi-VN');
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'PENDING': return 'Chưa bắt đầu';
      case 'ONGOING': return 'Đang diễn ra';
      case 'COMPLETED': return 'Đã kết thúc';
      case 'CANCELLED': return 'Đã hủy';
      default: return status;
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'PENDING':
        return { color: '#ff9800' };
      case 'ONGOING':
        return { color: '#4caf50' };
      case 'COMPLETED':
        return { color: '#2196f3' };
      case 'CANCELLED':
        return { color: '#f44336' };
      default:
        return {};
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const fetchQuizzes = async () => {
    try {
      const response = await fetch('http://26.184.129.66:8080/api/v1/quizzes', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.code === 200) {
        setQuizzes(data.result);
      }
    } catch (error) {
      toast.error('Lỗi khi tải danh sách đề thi');
    }
  };

  const fetchTeachers = async () => {
    try {
      const response = await fetch('http://26.184.129.66:8080/api/v1/users/teachers', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.code === 200) {
        setTeachers(data.result);
      }
    } catch (error) {
      toast.error('Lỗi khi tải danh sách giáo viên');
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await fetch('http://26.184.129.66:8080/api/v1/users/students', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.code === 200) {
        setStudents(data.result);
      }
    } catch (error) {
      toast.error('Lỗi khi tải danh sách học sinh');
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await fetch(
        'http://26.184.129.66:8080/api/v1/subjects',
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      const data = await response.json();
      if (data.code === 200) {
        setSubjects(data.result);
      }
    } catch (error) {
      toast.error('Lỗi khi tải danh sách môn học');
    }
  };

  const handleCreateExamSession = async () => {
    try {
      const requestData = {
        ...formData,
        teacherIds: Array.from(formData.teacherIds),
        studentIds: Array.from(formData.studentIds)
      };

      const response = await fetch('http://26.184.129.66:8080/api/v1/exam-sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(requestData)
      });

      const data = await response.json();
      if (data.code === 200) {
        toast.success('Tạo ca thi thành công');
        setOpenDialog(false);
        fetchExamSessions();
        setFormData({
          name: '',
          quizId: '',
          startTime: '',
          endTime: '',
          teacherIds: new Set(),
          studentIds: new Set(),
          allowReview: false
        });
      } else {
        toast.error(data.message || 'Lỗi khi tạo ca thi');
      }
    } catch (error) {
      toast.error('Lỗi kết nối server');
    }
  };

  const handleOpenUpdate = (examSession) => {
    setSelectedExamSession(examSession);
    setUpdateData({
      name: examSession.name,
      quizId: examSession.quiz.id,
      startTime: examSession.startTime.slice(0, 16),
      endTime: examSession.endTime.slice(0, 16),
      teacherIds: new Set(examSession.teachers.map(t => t.id)),
      studentIds: new Set(examSession.students.map(s => s.id)),
      allowReview: examSession.allowReview
    });
    setOpenUpdateDialog(true);
  };

  const handleUpdateExamSession = async () => {
    try {
      const requestData = {
        name: updateData.name,
        quizId: updateData.quizId,
        startTime: updateData.startTime,
        endTime: updateData.endTime,
        teacherIds: Array.from(updateData.teacherIds),
        studentIds: Array.from(updateData.studentIds)
      };

      const response = await fetch(
        `http://26.184.129.66:8080/api/v1/exam-sessions/${selectedExamSession.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(requestData)
        }
      );

      const data = await response.json();
      if (data.code === 200) {
        toast.success('Cập nhật ca thi thành công');
        setOpenUpdateDialog(false);
        fetchExamSessions();
      } else {
        toast.error(data.message || 'Lỗi khi cập nhật ca thi');
      }
    } catch (error) {
      toast.error('Lỗi kết nối server');
    }
  };

  const getFilteredExamSessions = () => {
    if (!selectedSubject) return examSessions;
    return examSessions.filter(session => 
      session.quiz.subject.id === selectedSubject.id
    );
  };

  const getExamSessionCount = (subjectId) => {
    console.log(examSessions)
    return examSessions.filter(session => 
      session.quiz.subject.id === subjectId
    ).length;
  };

  const getFilteredQuizzes = () => {
    if (!selectedSubject) return quizzes;
    return quizzes.filter(quiz => quiz.subject.id === selectedSubject.id);
  };

  const getPageData = () => {
    const filteredData = getFilteredExamSessions();
    return filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            position: 'relative',
            height: '100%'
          },
        }}
      >
        <List>
          <ListItem>
            <Typography variant="h6">Môn học</Typography>
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemButton 
              selected={!selectedSubject}
              onClick={() => setSelectedSubject(null)}
            >
              <ListItemIcon>
                <School />
              </ListItemIcon>
              <ListItemText primary="Tất cả" />
              <Badge 
                badgeContent={examSessions.length} 
                color="primary"
                sx={{ ml: 1 }}
              />
            </ListItemButton>
          </ListItem>
          {subjects.map((subject) => (
            <ListItem key={subject.id}>
              <ListItemButton
                selected={selectedSubject?.id === subject.id}
                onClick={() => setSelectedSubject(subject)}
              >
                <ListItemIcon>
                  <School />
                </ListItemIcon>
                <ListItemText primary={subject.subjectName} />
                <Badge 
                  badgeContent={getExamSessionCount(subject.id)} 
                  color="primary"
                  sx={{ ml: 1 }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h4">
            {selectedSubject ? `Ca thi môn ${selectedSubject.subjectName}` : 'Tất cả ca thi'}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenDialog(true)}
          >
            Tạo ca thi mới
          </Button>
        </Box>

        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell>STT</TableCell>
                <TableCell>Tên ca thi</TableCell>
                <TableCell>Bài thi</TableCell>
                <TableCell align="center">Thời gian bắt đầu</TableCell>
                <TableCell align="center">Thời gian kết thúc</TableCell>
                <TableCell align="center">Số học sinh</TableCell>
                <TableCell align="center">Trạng thái</TableCell>
                <TableCell align="center">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {getPageData().map((session, index) => (
                <TableRow key={session.id}>
                  <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell>{session.name}</TableCell>
                  <TableCell>{session.quiz.quizName}</TableCell>
                  <TableCell align="center">{formatDateTime(session.startTime)}</TableCell>
                  <TableCell align="center">{formatDateTime(session.endTime)}</TableCell>
                  <TableCell align="center">{session.students?.length || 0}</TableCell>
                  <TableCell align="center" sx={getStatusStyle(session.status)}>
                    {getStatusText(session.status)}
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="Chi tiết ca thi">
                        <IconButton 
                          size="small" 
                          onClick={() => navigate(`/exam-sessions/${session.id}`)}
                          color="info"
                        >
                          <Visibility />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Xem kết quả">
                        <IconButton 
                          size="small" 
                          onClick={() => navigate(`/exam-session/results/${session.id}`)}
                          color="success"
                        >
                          <Assessment />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Cập nhật">
                        <IconButton 
                          size="small" 
                          onClick={() => handleOpenUpdate(session)}
                          color="primary"
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={getFilteredExamSessions().length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Số hàng mỗi trang:"
            labelDisplayedRows={({ from, to, count }) => 
              `${from}-${to} của ${count}`
            }
          />
        </TableContainer>

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            {selectedSubject 
              ? `Tạo ca thi môn ${selectedSubject.subjectName}`
              : 'Tạo ca thi mới'
            }
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Tên ca thi"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  sx={{ 
                    '& label': { backgroundColor: 'white', px: 1 } 
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="quiz-label" sx={{ backgroundColor: 'white', px: 1 }}>
                    Chọn đề thi {selectedSubject ? `môn ${selectedSubject.subjectName}` : ''}
                  </InputLabel>
                  <Select
                    labelId="quiz-label"
                    value={formData.quizId}
                    onChange={(e) => setFormData({ ...formData, quizId: e.target.value })}
                  >
                    {getFilteredQuizzes().map((quiz) => (
                      <MenuItem key={quiz.id} value={quiz.id}>
                        {quiz.quizName}
                      </MenuItem>
                    ))}
                  </Select>
                  {getFilteredQuizzes().length === 0 && (
                    <FormHelperText error>
                      {selectedSubject 
                        ? `Không có đề thi nào cho môn ${selectedSubject.subjectName}`
                        : 'Vui lòng chọn môn học để xem đề thi'
                      }
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Thời gian bắt đầu"
                  type="datetime-local"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  InputLabelProps={{
                    shrink: true,
                    sx: { backgroundColor: 'white', px: 1 }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Thời gian kết thúc"
                  type="datetime-local"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  InputLabelProps={{
                    shrink: true,
                    sx: { backgroundColor: 'white', px: 1 }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="teachers-label" sx={{ backgroundColor: 'white', px: 1 }}>
                    Chọn giáo viên phụ trách
                  </InputLabel>
                  <Select
                    labelId="teachers-label"
                    multiple
                    value={Array.from(formData.teacherIds)}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      teacherIds: new Set(e.target.value) 
                    })}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip 
                            key={value} 
                            label={teachers.find(t => t.id === value)?.username}
                            onDelete={() => {
                              const newTeacherIds = new Set(formData.teacherIds);
                              newTeacherIds.delete(value);
                              setFormData({
                                ...formData,
                                teacherIds: newTeacherIds
                              });
                            }}
                          />
                        ))}
                      </Box>
                    )}
                  >
                    {teachers.map((teacher) => (
                      <MenuItem key={teacher.id} value={teacher.id}>
                        {teacher.username}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="students-label" sx={{ backgroundColor: 'white', px: 1 }}>
                    Chọn học sinh tham gia
                  </InputLabel>
                  <Select
                    labelId="students-label"
                    multiple
                    value={Array.from(formData.studentIds)}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      studentIds: new Set(e.target.value) 
                    })}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip 
                            key={value} 
                            label={students.find(s => s.id === value)?.username}
                            onDelete={() => {
                              const newStudentIds = new Set(formData.studentIds);
                              newStudentIds.delete(value);
                              setFormData({
                                ...formData,
                                studentIds: newStudentIds
                              });
                            }}
                          />
                        ))}
                      </Box>
                    )}
                  >
                    {students.map((student) => (
                      <MenuItem key={student.id} value={student.id}>
                        {student.username}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.allowReview}
                      onChange={(e) => setFormData({
                        ...formData,
                        allowReview: e.target.checked
                      })}
                    />
                  }
                  label="Cho phép học sinh xem lại đáp án sau khi thi"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
            <Button 
              onClick={handleCreateExamSession} 
              variant="contained" 
              color="primary"
              disabled={getFilteredQuizzes().length === 0}
            >
              Tạo
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openUpdateDialog} onClose={() => setOpenUpdateDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>Cập nhật ca thi</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Tên ca thi"
                  value={updateData.name}
                  onChange={(e) => setUpdateData({ ...updateData, name: e.target.value })}
                  sx={{ '& label': { backgroundColor: 'white', px: 1 } }}
                />
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="quiz-update-label" sx={{ backgroundColor: 'white', px: 1 }}>
                    Chọn đề thi
                  </InputLabel>
                  <Select
                    labelId="quiz-update-label"
                    value={updateData.quizId}
                    onChange={(e) => setUpdateData({ ...updateData, quizId: e.target.value })}
                  >
                    {quizzes.map((quiz) => (
                      <MenuItem key={quiz.id} value={quiz.id}>
                        {quiz.quizName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Thời gian bắt đầu"
                  type="datetime-local"
                  value={updateData.startTime}
                  onChange={(e) => setUpdateData({ ...updateData, startTime: e.target.value })}
                  InputLabelProps={{
                    shrink: true,
                    sx: { backgroundColor: 'white', px: 1 }
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Thời gian kết thúc"
                  type="datetime-local"
                  value={updateData.endTime}
                  onChange={(e) => setUpdateData({ ...updateData, endTime: e.target.value })}
                  InputLabelProps={{
                    shrink: true,
                    sx: { backgroundColor: 'white', px: 1 }
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="teachers-update-label" sx={{ backgroundColor: 'white', px: 1 }}>
                    Chọn giáo viên phụ trách
                  </InputLabel>
                  <Select
                    labelId="teachers-update-label"
                    multiple
                    value={Array.from(updateData.teacherIds)}
                    onChange={(e) => setUpdateData({ 
                      ...updateData, 
                      teacherIds: new Set(e.target.value) 
                    })}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip 
                            key={value} 
                            label={teachers.find(t => t.id === value)?.username}
                            onDelete={() => {
                              const newTeacherIds = new Set(updateData.teacherIds);
                              newTeacherIds.delete(value);
                              setUpdateData({
                                ...updateData,
                                teacherIds: newTeacherIds
                              });
                            }}
                          />
                        ))}
                      </Box>
                    )}
                  >
                    {teachers.map((teacher) => (
                      <MenuItem key={teacher.id} value={teacher.id}>
                        {teacher.username}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="students-update-label" sx={{ backgroundColor: 'white', px: 1 }}>
                    Chọn học sinh tham gia
                  </InputLabel>
                  <Select
                    labelId="students-update-label"
                    multiple
                    value={Array.from(updateData.studentIds)}
                    onChange={(e) => setUpdateData({ 
                      ...updateData, 
                      studentIds: new Set(e.target.value) 
                    })}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip 
                            key={value} 
                            label={students.find(s => s.id === value)?.username}
                            onDelete={() => {
                              const newStudentIds = new Set(updateData.studentIds);
                              newStudentIds.delete(value);
                              setUpdateData({
                                ...updateData,
                                studentIds: newStudentIds
                              });
                            }}
                          />
                        ))}
                      </Box>
                    )}
                  >
                    {students.map((student) => (
                      <MenuItem key={student.id} value={student.id}>
                        {student.username}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={updateData.allowReview}
                      onChange={(e) => setUpdateData({
                        ...updateData,
                        allowReview: e.target.checked
                      })}
                    />
                  }
                  label="Cho phép học sinh xem lại đáp án sau khi thi"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenUpdateDialog(false)}>Hủy</Button>
            <Button onClick={handleUpdateExamSession} variant="contained" color="primary">
              Cập nhật
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default TeacherExamSessions;
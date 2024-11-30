import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Tooltip,
  Card,
  CardContent
} from '@mui/material';
import {
  Delete as DeleteIcon,
  FileDownload as FileDownloadIcon,
  Add as AddIcon,
  Info as InfoIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';

const TemplateManagementPage = () => {
  const [templates, setTemplates] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState(subjects.length > 0 ? subjects[0].id : null);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    description: ''
  });
  const [openPreviewDialog, setOpenPreviewDialog] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  useEffect(() => {
    if (subjects.length > 0) {
      setSelectedSubjectId(subjects[0].id);
    }
  }, [subjects]);

  // Fetch templates by subject
  const fetchTemplates = async () => {
    try {
      const response = await fetch(`http://26.184.129.66:8080/api/v1/templates/subject/${selectedSubjectId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setTemplates(data.result);
      } else {
        toast.error('Lỗi khi tải danh sách template');
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast.error('Lỗi khi tải danh sách template');
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  useEffect(() => {
    if (selectedSubjectId) {
      fetchTemplates();
    }
  }, [selectedSubjectId]);

  // Add new template
  const handleAddTemplate = async () => {
    try {
      const templateData = {
        ...newTemplate,
        subjectId: selectedSubjectId
      };

      const response = await fetch('http://26.184.129.66:8080/api/v1/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(templateData)
      });

      if (response.ok) {
        toast.success('Thêm template thành công');
        setOpenAddDialog(false);
        setNewTemplate({ name: '', description: '' });
        fetchTemplates();
      } else {
        toast.error('Lỗi khi thêm template');
      }
    } catch (error) {
      console.error('Error adding template:', error);
      toast.error('Lỗi khi thêm template');
    }
  };

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

  // Delete template
  const handleDeleteTemplate = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa template này?')) {
      try {
        const response = await fetch(`http://26.184.129.66:8080/api/v1/templates/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.ok) {
          toast.success('Xóa template thành công');
          fetchTemplates();
        } else {
          toast.error('Lỗi khi xóa template');
        }
      } catch (error) {
        console.error('Error deleting template:', error);
        toast.error('Lỗi khi xóa template');
      }
    }
  };

  // Download template
  const handleDownloadTemplate = async (id) => {
    try {
      const response = await fetch(`http://26.184.129.66:8080/api/v1/templates/${id}/download`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const contentType = response.headers.get('Content-Type');
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        
        // Xác định extension dựa vào Content-Type
        let extension = '';
        if (contentType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
          extension = '.docx';
        } else if (contentType === 'application/pdf') {
          extension = '.pdf';
        }
        
        a.download = `template_${id}${extension}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success('Tải template thành công');
      } else {
        toast.error('Lỗi khi tải template');
      }
    } catch (error) {
      console.error('Error downloading template:', error);
      toast.error('Lỗi khi tải template');
    }
  };

  const handlePreview = async (template) => {
    setSelectedTemplate(template);
    try {
      const response = await fetch(`http://26.184.129.66:8080/api/v1/templates/${template.id}/preview`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        setPreviewUrl(url);
        setOpenPreviewDialog(true);
      } else {
        toast.error('Lỗi khi tải file xem trước');
      }
    } catch (error) {
      console.error('Error previewing template:', error);
      toast.error('Lỗi khi tải file xem trước');
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
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

      <Box sx={{ flex: 1,p: 3 }}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5">Quản lý Template</Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => setOpenAddDialog(true)}
              >
                Thêm Template
              </Button>
            </Box>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>STT</TableCell>
                    <TableCell>Tên template</TableCell>
                    <TableCell>Mô tả</TableCell>
                    <TableCell>Loại file</TableCell>
                    <TableCell align="center">Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {templates.map((template, index) => (
                    <TableRow key={template.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{template.name}</TableCell>
                      <TableCell>{template.description}</TableCell>
                      <TableCell>
                        {template.fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
                          ? 'Word (.docx)'
                          : template.fileType === 'application/pdf' 
                            ? 'PDF (.pdf)'
                            : 'Không xác định'}
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Tải template">
                          <IconButton
                            color="primary"
                            onClick={() => handleDownloadTemplate(template.id)}
                          >
                            <FileDownloadIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Xóa">
                          <IconButton
                            color="error"
                            onClick={() => handleDeleteTemplate(template.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Xem trước">
                          <IconButton
                            color="primary"
                            onClick={() => handlePreview(template)}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Dialog thêm template mới */}
        <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
          <DialogTitle>Thêm Template Mới</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                fullWidth
                label="Tên template"
                value={newTemplate.name}
                onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
              />
              <TextField
                fullWidth
                label="Mô tả"
                multiline
                rows={3}
                value={newTemplate.description}
                onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenAddDialog(false)}>Hủy</Button>
            <Button
              onClick={handleAddTemplate}
              variant="contained"
              color="primary"
              disabled={!newTemplate.name}
            >
              Thêm
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog xem trước template */}
        <Dialog
          open={openPreviewDialog}
          onClose={() => {
            setOpenPreviewDialog(false);
            window.URL.revokeObjectURL(previewUrl);
            setSelectedTemplate(null);
          }}
          maxWidth="lg"
          fullWidth
        >
          <DialogTitle>Xem trước Template</DialogTitle>
          <DialogContent>
            {selectedTemplate?.fileType === 'application/pdf' ? (
              <iframe
                src={previewUrl}
                width="100%"
                height="600px"
                title="PDF Preview"
              />
            ) : (
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
                  onClick={() => handleDownloadTemplate(selectedTemplate.id)}
                >
                  Tải xuống
                </Button>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {
              setOpenPreviewDialog(false);
              window.URL.revokeObjectURL(previewUrl);
              setSelectedTemplate(null);
            }}>
              Đóng
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default TemplateManagementPage; 
import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Typography,
  List,
  Box,
  Paper
} from '@mui/material';

const ResultsModal = ({ open, onClose, result }) => {
  if (!result) return null;

  const formatDateTime = (dateTime) => {
    if (!dateTime) return "N/A";
    return new Date(dateTime).toLocaleString('vi-VN');
  };

  const formatDuration = (seconds) => {
    if (seconds === undefined || seconds === null) return "N/A";
    
    if (seconds === 0) seconds = 1;
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const hoursStr = hours.toString().padStart(2, '0');
    const minutesStr = minutes.toString().padStart(2, '0');
    const secondsStr = remainingSeconds.toString().padStart(2, '0');

    return `${hoursStr}:${minutesStr}:${secondsStr}`;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Kết quả bài thi</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Điểm số: {((result.totalCorrect * 10) / result.totalQuestion).toFixed(2)}/10
          </Typography>
          <Typography variant="body1" gutterBottom>
            Số câu đúng: {result.totalCorrect}/{result.totalQuestion}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Thời gian bắt đầu: {formatDateTime(result.timeStart)}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Thời gian nộp bài: {formatDateTime(result.submitTime)}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Thời gian làm bài: {formatDuration(result.examDuration)}
          </Typography>
        </Box>

        <Typography variant="h6" gutterBottom>
          Chi tiết bài làm:
        </Typography>
        <List>
          {result.questionResults?.map((question, index) => {
            const selectedAnswer = question.selectedAnswers?.[0];
            const isQuestionAnswered = !!selectedAnswer;
            const isQuestionCorrect = selectedAnswer?.isCorrect === 1;
            
            return (
              <Paper 
                key={index} 
                elevation={3}
                sx={{ 
                  mb: 2,
                  p: 2,
                  backgroundColor: 'rgba(200, 200, 200, 0.1)',
                  opacity: isQuestionAnswered ? 1 : 0.7
                }}
              >
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    fontWeight: 'bold', 
                    mb: 2,
                    opacity: isQuestionAnswered ? 1 : 0.7
                  }}
                >
                  {question.questionText}
                  {!isQuestionAnswered && (
                    <Typography 
                      component="span" 
                      sx={{ 
                        ml: 2,
                        color: 'warning.main',
                        fontWeight: 'normal'
                      }}
                    >
                      (Chưa trả lời)
                    </Typography>
                  )}
                </Typography>

                {question.answers?.map((answer) => {
                  const isSelected = selectedAnswer?.id === answer.id;
                  
                  return (
                    <Box 
                      key={answer.id}
                      sx={{
                        p: 1.5,
                        mb: 1,
                        borderRadius: 1,
                        backgroundColor: isSelected 
                          ? (isQuestionCorrect 
                              ? 'rgba(76, 175, 80, 0.2)' 
                              : 'rgba(244, 67, 54, 0.2)') 
                          : 'transparent',
                        border: '1px solid',
                        borderColor: isSelected 
                          ? (isQuestionCorrect ? 'success.main' : 'error.main')
                          : 'grey.300',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        opacity: isQuestionAnswered ? 1 : 0.5
                      }}
                    >
                      <Typography
                        sx={{
                          color: isSelected 
                            ? (isQuestionCorrect ? 'success.main' : 'error.main')
                            : 'text.primary'
                        }}
                      >
                        {answer.answerText}
                      </Typography>
                      {isSelected && (
                        <Typography 
                          component="span" 
                          sx={{ 
                            ml: 2,
                            color: isQuestionCorrect ? 'success.main' : 'error.main',
                            fontWeight: 'bold'
                          }}
                        >
                          {isQuestionCorrect ? '✓ Đúng' : '✗ Sai'}
                        </Typography>
                      )}
                    </Box>
                  );
                })}
              </Paper>
            );
          })}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ResultsModal;

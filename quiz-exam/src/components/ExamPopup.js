import React, { useState } from "react";
import { Box, Typography, IconButton, Divider, Switch, FormControlLabel } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const ExamPopup = ({ open, onClose, examData }) => {
  const [showSolution, setShowSolution] = useState(false);

  if (!open || !examData) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        top: "10%",
        left: "50%",
        transform: "translate(-50%, 0)",
        width: "80%",
        maxHeight: "80%",
        backgroundColor: "white",
        borderRadius: 2,
        boxShadow: 24,
        overflow: "auto",
        p: 4,
      }}
    >
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h5">Nội dung đề</Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Toggle show solution */}
      <FormControlLabel
        control={
          <Switch
            checked={showSolution}
            onChange={() => setShowSolution((prev) => !prev)}
            color="primary"
          />
        }
        label="Hiển thị lời giải"
      />

      {/* Exam questions */}
      {examData.map((question, index) => (
        <Box key={index} sx={{ mb: 3 }}>
          <Typography variant="body1" sx={{ mb: 1, fontWeight: "bold", textAlign: "left", }}>
            Câu {index + 1}: {question.questionText}
          </Typography>
          {question.answers.map((answer, idx) => (
            <Typography
              key={idx}
              sx={{
                ml: 2,
                mb: 0.5,
                backgroundColor: showSolution && answer.isCorrect ? "#c8e6c9" : "transparent", // Highlight đáp án đúng
                padding: "4px 8px",
                borderRadius: "4px",
                textAlign: "left", // Căn lề trái
              }}
            >
              {String.fromCharCode(65 + idx)}. {answer.text}
            </Typography>
          ))}

          {/* Show solution if toggled */}
          {showSolution && (
            <Typography sx={{ mt: 1, ml: 2, fontStyle: "italic", color: "gray", textAlign: "left", }}>
              Lời giải: {question.solution}
            </Typography>
          )}
        </Box>
      ))}
    </Box>
  );
};

export default ExamPopup;
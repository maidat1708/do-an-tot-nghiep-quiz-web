import React from 'react';
import { 
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { 
  Box, 
  Grid, 
  Paper, 
  Typography, 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider
} from '@mui/material';

// Đăng ký các components Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const ExamSessionStats = ({ stats }) => {
  console.log(stats)
  // Data cho biểu đồ phân bố điểm chi tiết
  const detailedScoreData = {
    labels: Object.keys(stats.detailedScoreDistribution),
    datasets: [
      {
        label: 'Số lượng học sinh',
        data: Object.values(stats.detailedScoreDistribution),
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(255, 159, 64, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(153, 102, 255, 0.5)',
          'rgba(201, 203, 207, 0.5)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(201, 203, 207, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  // Data cho biểu đồ phân loại học lực
  const gradeData = {
    labels: Object.keys(stats.gradeDistribution),
    datasets: [
      {
        data: Object.values(stats.gradeDistribution),
        backgroundColor: [
          'rgba(54, 162, 235, 0.8)',  // Giỏi
          'rgba(75, 192, 192, 0.8)',  // Khá
          'rgba(255, 206, 86, 0.8)',  // TB
          'rgba(255, 99, 132, 0.8)',  // Yếu
        ],
        borderWidth: 1,
      },
    ],
  };

  // Data cho biểu đồ xu hướng điểm
  const trendData = {
    labels: stats.scoreTrends.map(trend => 
      new Date(trend.submitTime).toLocaleTimeString()
    ),
    datasets: [
      {
        label: 'Điểm số theo thời gian',
        data: stats.scoreTrends.map(trend => trend.score),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  // Options cho các biểu đồ
  const barOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: 'Phân bố điểm chi tiết'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 }
      }
    }
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'right' },
      title: {
        display: true,
        text: 'Phân loại học lực'
      }
    }
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: 'Xu hướng điểm theo thời gian'
      }
    },
    scales: {
      y: {
        min: 0,
        max: 10
      }
    }
  };

  // Component hiển thị thông tin trong card
  const StatCard = ({ title, value, suffix = '' }) => (
    <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        {title}
      </Typography>
      <Typography variant="h4" component="div">
        {typeof value === 'number' ? value.toFixed(2) : value}{suffix}
      </Typography>
    </Paper>
  );

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {/* Thống kê tổng quan */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Điểm Trung Bình" 
            value={stats.averageScore} 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Điểm Trung Vị" 
            value={stats.medianScore}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Tỷ Lệ Đạt" 
            value={stats.passRate}
            suffix="%" 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Độ Lệch Chuẩn" 
            value={stats.standardDeviation}
          />
        </Grid>
      </Grid>

      {/* Biểu đồ */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Bar data={detailedScoreData} options={barOptions} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Pie data={gradeData} options={pieOptions} />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Line data={trendData} options={lineOptions} />
          </Paper>
        </Grid>
      </Grid>

      {/* Bảng top điểm cao */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Top 5 Điểm Cao Nhất
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Thứ hạng</TableCell>
                    <TableCell>Học sinh</TableCell>
                    <TableCell align="right">Điểm</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stats.topResults.map((result, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{result.user.profile.firstName} {result.user.profile.lastName}</TableCell>
                      <TableCell align="right">{result.score.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Thông tin thêm */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Thông Tin Chi Tiết
            </Typography>
            <Typography variant="body1" paragraph>
              Tổng số học sinh: {stats.totalStudents}
            </Typography>
            <Typography variant="body1" paragraph>
              Số học sinh đạt: {stats.passedStudents}
            </Typography>
            <Typography variant="body1" paragraph>
              Điểm cao nhất: {stats.highestScore.toFixed(2)}
            </Typography>
            <Typography variant="body1" paragraph>
              Điểm thấp nhất: {stats.lowestScore.toFixed(2)}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ExamSessionStats; 
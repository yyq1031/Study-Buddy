import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Avatar,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  LinearProgress,
  Divider
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from 'recharts';
import {
  QuizOutlined,
  VideoLibraryOutlined,
  HandymanOutlined,
  PersonOutlined,
  WarningOutlined,
  TrendingDownOutlined,
  SchoolOutlined,
  PlayCircleOutlined,
  ArticleOutlined
} from '@mui/icons-material';
import { useTheme, useMediaQuery } from '@mui/material';

// Mock data
const contentTypeData = [
  { name: 'Quizzes', value: 45, color: '#4caf50' },
  { name: 'Videos', value: 35, color: '#2196f3' },
  { name: 'Hands-on', value: 20, color: '#ff9800' }
];

const strugglingTopics = [
  { topic: 'Calculus Integration', difficulty: 85, students: 12 },
  { topic: 'Organic Chemistry', difficulty: 78, students: 8 },
  { topic: 'Quantum Physics', difficulty: 72, students: 15 },
  { topic: 'Linear Algebra', difficulty: 68, students: 6 }
];

const studentsNeedingAttention = [
  { name: 'Alex Johnson', avatar: 'AJ', score: 45, struggles: ['Calculus', 'Physics'] },
  { name: 'Sarah Chen', avatar: 'SC', score: 52, struggles: ['Chemistry', 'Math'] },
  { name: 'Michael Brown', avatar: 'MB', score: 48, struggles: ['Physics', 'Statistics'] },
  { name: 'Emma Wilson', avatar: 'EW', score: 41, struggles: ['Calculus', 'Chemistry'] }
];

const students = [
  'Alex Johnson', 'Sarah Chen', 'Michael Brown', 'Emma Wilson', 'David Kim', 'Lisa Rodriguez'
];

const learningJourneyData = {
  'Alex Johnson': [
    { id: 1, concept: 'Basic Algebra', x: 100, y: 200, mastery: 85, attempts: 3, bestModality: 'video', score: 85 },
    { id: 2, concept: 'Linear Equations', x: 250, y: 150, mastery: 72, attempts: 4, bestModality: 'quiz', score: 72 },
    { id: 3, concept: 'Quadratic Functions', x: 400, y: 180, mastery: 45, attempts: 6, bestModality: 'hands-on', score: 45 },
    { id: 4, concept: 'Calculus Basics', x: 550, y: 220, mastery: 38, attempts: 8, bestModality: 'video', score: 38 },
    { id: 5, concept: 'Derivatives', x: 700, y: 160, mastery: 25, attempts: 5, bestModality: 'text', score: 25 }
  ],
  'Sarah Chen': [
    { id: 1, concept: 'Atomic Structure', x: 100, y: 200, mastery: 90, attempts: 2, bestModality: 'video', score: 90 },
    { id: 2, concept: 'Chemical Bonds', x: 250, y: 180, mastery: 78, attempts: 3, bestModality: 'hands-on', score: 78 },
    { id: 3, concept: 'Molecular Geometry', x: 400, y: 220, mastery: 65, attempts: 4, bestModality: 'quiz', score: 65 },
    { id: 4, concept: 'Reaction Kinetics', x: 550, y: 160, mastery: 42, attempts: 7, bestModality: 'video', score: 42 },
    { id: 5, concept: 'Organic Synthesis', x: 700, y: 200, mastery: 35, attempts: 6, bestModality: 'hands-on', score: 35 }
  ]
};

const connections = {
  'Alex Johnson': [
    { from: 1, to: 2 },
    { from: 2, to: 3 },
    { from: 3, to: 4 },
    { from: 4, to: 5 }
  ],
  'Sarah Chen': [
    { from: 1, to: 2 },
    { from: 2, to: 3 },
    { from: 3, to: 4 },
    { from: 4, to: 5 }
  ]
};

export default function Dashboard() {
  const [selectedStudent, setSelectedStudent] = useState('Alex Johnson');
  const [selectedNode, setSelectedNode] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const getMasteryColor = (mastery) => {
    if (mastery >= 70) return '#4caf50'; // Green
    if (mastery >= 50) return '#ff9800'; // Orange
    return '#f44336'; // Red
  };

  const getModalityIcon = (modality) => {
    switch (modality) {
      case 'video': return <PlayCircleOutlined />;
      case 'quiz': return <QuizOutlined />;
      case 'hands-on': return <HandymanOutlined />;
      case 'text': return <ArticleOutlined />;
      default: return <SchoolOutlined />;
    }
  };

  const handleNodeClick = (node) => {
    setSelectedNode(node);
    setDialogOpen(true);
  };

  const currentJourney = learningJourneyData[selectedStudent] || [];
  const currentConnections = connections[selectedStudent] || [];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
        Class Analytics Dashboard
      </Typography>

      {/* General Analytics Section */}
      <Grid container spacing={3} sx={{ mb: 6 }} justifyContent="center">
        {/* Content Type Effectiveness */}
        <Grid item xs={12} sm={6} md={4}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <SchoolOutlined sx={{ mr: 1 }} />
                Most Effective Content Types
              </Typography>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={contentTypeData}
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    dataKey="value"
                  >
                    {contentTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}% effectiveness`} />
                </PieChart>
              </ResponsiveContainer>
              <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                {contentTypeData.map((item, index) => (
                  <Chip
                    key={index}
                    label={`${item.name}: ${item.value}%`}
                    sx={{ backgroundColor: item.color, color: 'white' }}
                    size="small"
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Struggling Topics */}
        <Grid item xs={12} sm={6} md={4}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <WarningOutlined sx={{ mr: 1, color: 'warning.main' }} />
                Topics Students Struggle With
              </Typography>
              <List dense>
                {strugglingTopics.map((topic, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemIcon>
                      <TrendingDownOutlined color="error" />
                    </ListItemIcon>
                    <ListItemText
                      primary={topic.topic}
                      secondary={
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            {topic.students} students struggling
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={topic.difficulty}
                            color="error"
                            sx={{ mt: 0.5 }}
                          />
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Students Needing Attention */}
        <Grid item xs={12} sm={6} md={4}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <PersonOutlined sx={{ mr: 1, color: 'info.main' }} />
                Students Needing Extra Attention
              </Typography>
              <List dense>
                {studentsNeedingAttention.map((student, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemIcon>
                      <Avatar sx={{ width: 32, height: 32, fontSize: '0.875rem' }}>
                        {student.avatar}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={student.name}
                      secondary={
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Overall Score: {student.score}%
                          </Typography>
                          <Box sx={{ mt: 0.5, display: 'flex', flexWrap: 'wrap' }}>
                            {student.struggles.map((struggle, idx) => (
                              <Chip
                                key={idx}
                                label={struggle}
                                size="small"
                                color="error"
                                variant="outlined"
                                sx={{ mr: 0.5, mb: 0.5 }}
                              />
                            ))}
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Divider sx={{ my: 4 }} />

      {/* Learning Journey Map Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
          Learning Journey Map
        </Typography>
        <FormControl fullWidth sx={{ mb: 3, maxWidth: 300 }}>
          <InputLabel>Select Student</InputLabel>
          <Select
            value={selectedStudent}
            label="Select Student"
            onChange={(e) => setSelectedStudent(e.target.value)}
          >
            {students.map((student) => (
              <MenuItem key={student} value={student}>
                {student}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Journey Visualization */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          {selectedStudent}'s Learning Path
        </Typography>
        <Box sx={{ width: '100%', overflowX: 'auto' }}>
          <svg
            viewBox="0 0 800 400"
            preserveAspectRatio="xMinYMin meet"
            width="100%"
            height="auto"
            style={{ border: '1px solid #e0e0e0', borderRadius: '8px', minWidth: 600 }}
          >
            {currentConnections.map((conn, index) => {
              const fromNode = currentJourney.find(n => n.id === conn.from);
              const toNode = currentJourney.find(n => n.id === conn.to);
              if (!fromNode || !toNode) return null;

              return (
                <line
                  key={index}
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  stroke="#bdbdbd"
                  strokeWidth="2"
                  markerEnd="url(#arrowhead)"
                />
              );
            })}

            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
              >
                <polygon points="0 0, 10 3.5, 0 7" fill="#bdbdbd" />
              </marker>
            </defs>

            {currentJourney.map((node) => (
              <g key={node.id}>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="25"
                  fill={getMasteryColor(node.mastery)}
                  stroke="#fff"
                  strokeWidth="3"
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleNodeClick(node)}
                />
                <text
                  x={node.x}
                  y={node.y + 35}
                  textAnchor="middle"
                  fontSize="12"
                  fill="#333"
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleNodeClick(node)}
                >
                  {node.concept.length > 15 ? node.concept.substring(0, 15) + '...' : node.concept}
                </text>
                <text
                  x={node.x}
                  y={node.y + 5}
                  textAnchor="middle"
                  fontSize="10"
                  fill="white"
                  fontWeight="bold"
                >
                  {node.mastery}%
                </text>
              </g>
            ))}
          </svg>
        </Box>

        <Box sx={{ mt: 2, display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 20, height: 20, borderRadius: '50%', backgroundColor: '#4caf50' }} />
            <Typography variant="body2">Strong (70%+)</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 20, height: 20, borderRadius: '50%', backgroundColor: '#ff9800' }} />
            <Typography variant="body2">Moderate (50–69%)</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 20, height: 20, borderRadius: '50%', backgroundColor: '#f44336' }} />
            <Typography variant="body2">Weak (&lt;50%)</Typography>
          </Box>
        </Box>
      </Paper>

      {/* Node Details Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth fullScreen={isSmallScreen}>
        {selectedNode && (
          <>
            <DialogTitle>
              <Typography variant="h6">{selectedNode.concept} – Detailed Analysis</Typography>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom color="primary">
                        Performance Metrics
                      </Typography>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2">Mastery Level: {selectedNode.mastery}%</Typography>
                        <LinearProgress
                          variant="determinate"
                          value={selectedNode.mastery}
                          sx={{ mt: 1, height: 8, borderRadius: 4 }}
                          color={selectedNode.mastery >= 70 ? 'success' : selectedNode.mastery >= 50 ? 'warning' : 'error'}
                        />
                      </Box>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        Number of Attempts: {selectedNode.attempts}
                      </Typography>
                      <Typography variant="body2">
                        Latest Score: {selectedNode.score}%
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom color="primary">
                        Learning Approach
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        {getModalityIcon(selectedNode.bestModality)}
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          Most Effective: {selectedNode.bestModality.charAt(0).toUpperCase() + selectedNode.bestModality.slice(1)}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        This student learns this concept best through {selectedNode.bestModality} content. Consider providing more {selectedNode.bestModality}-based materials for improvement.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom color="primary">
                        Recommendations
                      </Typography>
                      {selectedNode.mastery < 50 ? (
                        <Typography variant="body2" color="error">
                          ⚠️ This student needs immediate attention on this topic. Consider scheduling a one-on-one session or providing additional {selectedNode.bestModality} resources.
                        </Typography>
                      ) : selectedNode.mastery < 70 ? (
                        <Typography variant="body2" color="warning.main">
                          📝 Good progress, but there's room for improvement. Provide practice exercises using {selectedNode.bestModality} format.
                        </Typography>
                      ) : (
                        <Typography variant="body2" color="success.main">
                          ✅ Excellent mastery! This student can help mentor others or move to advanced topics.
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialogOpen(false)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
}
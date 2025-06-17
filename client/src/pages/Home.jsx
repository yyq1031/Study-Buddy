import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Paper,
  Avatar,
  useTheme,
  useMediaQuery
} from "@mui/material";
import { AutoAwesome, Group, Insights } from "@mui/icons-material";
import homeIllustration from "../assets/home-illustration.jpg";
import studentLearning from "../assets/student-learning.png";
import teacherDashboard from "../assets/teacher-dashboard.png";
import { Link } from "react-router-dom";

const features = [
  {
    title: "Personalized Learning",
    description:
      "Adaptive lessons and quizzes tailored to each student's pace and preferences.",
    icon: <AutoAwesome sx={{ fontSize: 48, color: '#2196f3' }} />,
  },
  {
    title: "Supports All Learning Styles",
    description:
      "Visual, auditory, kinesthetic – we personalize content delivery for every learner.",
    icon: <Group sx={{ fontSize: 48, color: '#4caf50' }} />,
  },
  {
    title: "Real-Time Teacher Insights",
    description:
      "Teachers get dashboards with progress tracking and AI-powered suggestions.",
    icon: <Insights sx={{ fontSize: 48, color: '#9c27b0' }} />,
  },
];

export default function Home() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box sx={{ width: '100%', minHeight: '100vh' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: { xs: 8, md: 12 },
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                <Typography
                  variant="h2"
                  component="h1"
                  sx={{
                    fontWeight: 'bold',
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                    mb: 3,
                    lineHeight: 1.2
                  }}
                >
                  Welcome to Study Buddy
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    mb: 4,
                    fontSize: { xs: '1.25rem', md: '1.5rem' },
                    fontWeight: 300,
                    opacity: 0.9
                  }}
                >
                  The AI-powered learning platform that adapts to every student.
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    bgcolor: 'white',
                    color: '#667eea',
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    '&:hover': {
                      bgcolor: '#f5f5f5',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                  component={Link}to='/about'
                >
                  Get Started
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  mt: { xs: 4, md: 0 }
                }}
              >
                <Paper
                  elevation={8}
                  sx={{
                    borderRadius: 3,
                    overflow: 'hidden',
                    maxWidth: 450,
                    width: '100%'
                  }}
                >
                  <Box
                    component="img"
                    src={homeIllustration}
                    alt="Study Buddy AI Learning"
                    sx={{
                      width: '100%',
                      height: { xs: 250, md: 300 },
                      objectFit: 'cover',
                      display: 'block'
                    }}
                  />
                </Paper>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Typography
          variant="h3"
          component="h2"
          sx={{
            textAlign: 'center',
            fontWeight: 'bold',
            mb: 2,
            color: '#333'
          }}
        >
          Why Study Buddy?
        </Typography>
        <Typography
          variant="h6"
          sx={{
            textAlign: 'center',
            color: '#666',
            mb: 6,
            fontWeight: 300
          }}
        >
          Discover the features that make learning personalized and effective
        </Typography>
        
        <Grid container spacing={4} justifyContent="center" alignItems="stretch">
  {features.map((feature, idx) => (
    <Grid item xs={12} md={4} key={idx}>
              <Card
  elevation={3}
  sx={{
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    textAlign: 'center',
    p: 3,
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-8px)',
      boxShadow: '0 12px 40px rgba(0,0,0,0.1)'
    }
  }}
>
                <CardContent>
                  <Box sx={{ mb: 3 }}>
                    {feature.icon}
                  </Box>
                  <Typography
                    variant="h5"
                    component="h3"
                    sx={{ fontWeight: 'bold', mb: 2, color: '#333' }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ color: '#666', lineHeight: 1.6 }}
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* For Students Section */}
      <Box
  sx={{
    background: 'linear-gradient(135deg, #43cea2 0%, #185a9d 100%)',
    color: 'white',
    py: { xs: 8, md: 12 },
    minHeight: '80vh',
    display: 'flex',
    alignItems: 'center'
  }}
>
  <Container maxWidth="lg">
    <Grid container spacing={4} alignItems="center">
      <Grid item xs={12} md={6}>
        <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
          <Typography
            variant="h3"
            component="h2"
            sx={{
              fontWeight: 'bold',
              mb: 3,
              fontSize: { xs: '2rem', md: '2.8rem' },
              lineHeight: 1.2
            }}
          >
            Adapting to Every Learning Style
          </Typography>
          <Typography
            variant="h6"
            sx={{
              mb: 4,
              fontSize: { xs: '1.2rem', md: '1.4rem' },
              fontWeight: 300,
              opacity: 0.9
            }}
          >
            Whether you're a visual learner who benefits from diagrams,
            someone who prefers hands-on practice, or an auditory learner who
            thrives with explanations — Study Buddy adapts to you.
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12} md={6}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mt: { xs: 4, md: 0 }
          }}
        >
          <Paper
            elevation={8}
            sx={{
              borderRadius: 3,
              overflow: 'hidden',
              maxWidth: 450,
              width: '100%'
            }}
          >
            <Box
              component="img"
              src={studentLearning}
              alt="Learning Styles"
              sx={{
                width: '100%',
                height: { xs: 250, md: 300 },
                objectFit: 'cover',
                display: 'block'
              }}
            />
          </Paper>
        </Box>
      </Grid>
    </Grid>
  </Container>
</Box>


      {/* For Teachers Section */}
      <Box
  sx={{
    background: 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)',
    color: 'white',
    py: { xs: 8, md: 12 },
    minHeight: '80vh',
    display: 'flex',
    alignItems: 'center'
  }}
>
  <Container maxWidth="lg">
    <Grid container spacing={4} alignItems="center">
      <Grid item xs={12} md={6}>
        <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
          <Typography
            variant="h3"
            component="h2"
            sx={{
              fontWeight: 'bold',
              mb: 3,
              fontSize: { xs: '2rem', md: '2.8rem' },
              lineHeight: 1.2
            }}
          >
            Empowering Teachers with Insights
          </Typography>
          <Typography
            variant="h6"
            sx={{
              mb: 4,
              fontSize: { xs: '1.2rem', md: '1.4rem' },
              fontWeight: 300,
              opacity: 0.9
            }}
          >
            Teachers can monitor each student's progress, see areas of
            difficulty, and get smart recommendations on how to help them.
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12} md={6}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mt: { xs: 4, md: 0 }
          }}
        >
          <Paper
            elevation={8}
            sx={{
              borderRadius: 3,
              overflow: 'hidden',
              maxWidth: 950,
              width: '100%'
            }}
          >
            <Box
              component="img"
              src={teacherDashboard}
              alt="Teacher Dashboard"
              sx={{
                width: '100%',
                height: { xs: 250, md: 300 },
                objectFit: 'cover',
                display: 'block'
              }}
            />
          </Paper>
        </Box>
      </Grid>
    </Grid>
  </Container>
</Box>


      {/* Footer */}
      <Box
        sx={{
          bgcolor: '#263238',
          color: 'white',
          py: 6
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h4"
                component="h4"
                sx={{ fontWeight: 'bold', mb: 1 }}
              >
                Study Buddy
              </Typography>
              <Typography
                variant="h6"
                sx={{ color: '#90a4ae', fontWeight: 300 }}
              >
                Adaptive AI Learning Platform for Every Student.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6} sx={{ textAlign: { xs: 'center', md: 'right' } }}>
              <Typography variant="body1" sx={{ mb: 1 }}>
                Contact: support@studybuddy.ai
              </Typography>
              <Typography variant="body2" sx={{ color: '#90a4ae' }}>
                © {new Date().getFullYear()} Study Buddy
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
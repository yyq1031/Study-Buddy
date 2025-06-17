import React from "react";
import { Box, Container, Grid, Typography, Paper } from "@mui/material";
import homeIllustration from "../assets/home-illustration.jpg";
import AIteacher from "../assets/AI-teacher.png";
import traditionalEducation from "../assets/traditional-education.jpg";

const About = () => {
  return (
    <Box sx={{ width: '100%', minHeight: '100vh' }}>
      {/* Problem Section */}
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
                  component="h2"
                  sx={{
                    fontWeight: 'bold',
                    fontSize: { xs: '2.5rem', md: '3rem' },
                    mb: 3,
                    lineHeight: 1.2
                  }}
                >
                  The Problem with Traditional Education
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    mb: 4,
                    fontSize: { xs: '1.25rem', md: '1.5rem' },
                    fontWeight: 300,
                    opacity: 0.9,
                    lineHeight: 1.6
                  }}
                >
                  Traditional education systems often adopt a one-size-fits-all approach, failing to accommodate the diverse learning needs of students. As a result, many fall behind.
                  According to UNESCO, over 280 million students worldwide do not reach minimum proficiency due to inflexible learning methodologies.
                  This system leaves little room for personalized guidance or attention.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: { xs: 4, md: 0 } }}>
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
                    src={traditionalEducation}
                    alt="Traditional Education Problem"
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

      {/* Mission Section */}
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
                  variant="h2"
                  component="h2"
                  sx={{
                    fontWeight: 'bold',
                    fontSize: { xs: '2.5rem', md: '3rem' },
                    mb: 3,
                    lineHeight: 1.2
                  }}
                >
                  Our Mission with Study Buddy
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    mb: 3,
                    fontSize: { xs: '1.25rem', md: '1.5rem' },
                    fontWeight: 300,
                    opacity: 0.9,
                    lineHeight: 1.6
                  }}
                >
                  Study Buddy is an AI-powered adaptive learning platform built to address this challenge. Our mission is to personalize education by recommending
                  the right lessons and quizzes based on each student's performance and learning patterns.
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 'bold',
                    mb: 2
                  }}
                >
                  Our AI evaluates:
                </Typography>
                <Box sx={{ mb: 3, pl: 2 }}>
                  <Typography
                    variant="body1"
                    sx={{
                      mb: 1,
                      fontSize: { xs: '1rem', md: '1.1rem' },
                      opacity: 0.9,
                      '&::before': { content: '"• "', mr: 1 }
                    }}
                  >
                    Mastery and understanding via quiz scores
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      mb: 1,
                      fontSize: { xs: '1rem', md: '1.1rem' },
                      opacity: 0.9,
                      '&::before': { content: '"• "', mr: 1 }
                    }}
                  >
                    Learning satisfaction through emotion and mood analysis
                  </Typography>
                </Box>
                <Typography
                  variant="h5"
                  sx={{
                    fontSize: { xs: '1.2rem', md: '1.4rem' },
                    fontWeight: 300,
                    opacity: 0.9,
                    lineHeight: 1.6
                  }}
                >
                  Based on these insights, Study Buddy recommends whether students should revise, explore advanced topics, or reinforce specific concepts.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: { xs: 4, md: 0 } }}>
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
                    alt="AI Learning Mission"
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

      {/* Teacher Support Section */}
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
                  variant="h2"
                  component="h2"
                  sx={{
                    fontWeight: 'bold',
                    fontSize: { xs: '2.5rem', md: '3rem' },
                    mb: 3,
                    lineHeight: 1.2
                  }}
                >
                  Supporting, Not Replacing Teachers
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    mb: 3,
                    fontSize: { xs: '1.25rem', md: '1.5rem' },
                    fontWeight: 300,
                    opacity: 0.9,
                    lineHeight: 1.6
                  }}
                >
                  Study Buddy is not meant to replace teachers—it is built to support them. Teachers can easily upload and organize their content while the AI helps:
                </Typography>
                <Box sx={{ mb: 3, pl: 2 }}>
                  <Typography
                    variant="body1"
                    sx={{
                      mb: 1,
                      fontSize: { xs: '1rem', md: '1.1rem' },
                      opacity: 0.9,
                      '&::before': { content: '"• "', mr: 1 }
                    }}
                  >
                    Track student progress with interactive dashboards
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      mb: 1,
                      fontSize: { xs: '1rem', md: '1.1rem' },
                      opacity: 0.9,
                      '&::before': { content: '"• "', mr: 1 }
                    }}
                  >
                    Provide visual insights to tailor lessons
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      mb: 1,
                      fontSize: { xs: '1rem', md: '1.1rem' },
                      opacity: 0.9,
                      '&::before': { content: '"• "', mr: 1 }
                    }}
                  >
                    Identify learning gaps needing attention
                  </Typography>
                </Box>
                <Typography
                  variant="h5"
                  sx={{
                    fontSize: { xs: '1.2rem', md: '1.4rem' },
                    fontWeight: 300,
                    opacity: 0.9,
                    lineHeight: 1.6
                  }}
                >
                  By adjusting to each student’s pace, Study Buddy empowers teachers to manage diverse classrooms more effectively—ensuring no student is left behind.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: { xs: 4, md: 0 } }}>
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
                    src={AIteacher}
                    alt="Teacher Support Dashboard"
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
    </Box>
  );
};

export default About;

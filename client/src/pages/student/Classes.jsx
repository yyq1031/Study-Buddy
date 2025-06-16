import React from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  LinearProgress,
  Box,
} from '@mui/material';

function Classes({ user }) {
  console.log(user);
  // get classes of user from backend
  user.classes = [
    { id: 1, name: "Math 101", latestLesson: "Derivatives", latestLessonId: "derivatives" },
    { id: 2, name: "Chemistry", latestLesson: "Acids and Bases", latestLessonId: "acids-bases" }
  ]
  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Welcome, {user.name}
      </Typography>
      <Typography variant="h6" gutterBottom>
        Your Enrolled Classes:
      </Typography>
      <Grid container spacing={3}>
        {user.classes.map((cls) => (
          <Grid item xs={12} md={6} key={cls.id}>
            <Card variant="outlined" sx={{ boxShadow: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  <Link to={`/class/${cls.id}`} style={{ textDecoration: 'none', color: '#1976d2' }}>
                    {cls.name}
                  </Link>
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}
                >
                  Continue: <Link to={`/class/${cls.id}/lesson/${cls.latestLessonId}`} style={{ textDecoration: 'none', color: '#1976d2' }}>{cls.latestLesson}</Link>
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2">Progress</Typography>
                  <LinearProgress
                    variant="determinate"
                    value={cls.progress || 0}
                    sx={{ height: 10, borderRadius: 5 }}
                  />
                </Box>
              </CardContent>
              <CardActions>
                <Link to="/quiz" style={{ textDecoration: 'none' }}>
                  <Button size="small" variant="contained">Go to Quiz</Button>
                </Link>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Classes;

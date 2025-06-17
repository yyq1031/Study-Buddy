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
import { useEffect } from 'react';
import { getClasses } from '../../api';

function Classes({ user }) {
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const token = localStorage.getItem('token');
        const classData = await getClasses(token);
        user.classes = classData;
        console.log(user.classes)
        if (classData) setClasses(classData);
      } catch (err) {
        console.error('Failed to fetch classes:', err.message);
      }
    };

    fetchClasses();
  }, [user]);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Welcome, {user.name}
      </Typography>
      <Typography variant="h6" gutterBottom>
        Your Classes:
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
                {/* <Box sx={{ mt: 2 }}>
                  <Typography variant="body2">Progress</Typography>
                  <LinearProgress
                    variant="determinate"
                    value={cls.progress || 0}
                    sx={{ height: 10, borderRadius: 5 }}
                  />
                </Box> */}
              </CardContent>
              <CardActions>
                { user.role == 'teacher' 
                ? <Link to={`/teacherview/${cls.id}`} style={{ textDecoration: 'none' }}>
                  <Button size="small" variant="contained">View Class</Button>
                </Link>
                : <Link to={`/class/${cls.id}`} style={{ textDecoration: 'none' }}>
                  <Button size="small" variant="contained">Study</Button>
                </Link>
                }
                
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Classes;
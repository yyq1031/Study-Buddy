import React, { useState } from 'react';
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
  //const savedUser = JSON.parse(localStorage.getItem('user'));
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const token = localStorage.getItem('token');
        const classData = await getClasses(token);
        
        // console.log(user.classes)
        if (user && classData) {
          user.classes = classData;
          localStorage.setItem('user', user);
          setClasses(classData)
        };
      } catch (err) {
        console.error('Failed to fetch classes:', err.message);
      }
    };

    fetchClasses();
  }, [user]);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Welcome, {user ? user.name: 'user'}
      </Typography>
      <Typography variant="h6" gutterBottom>
        Your Classes:
      </Typography>
      <Grid container spacing={3}>
        {classes.map((cls) => (
          <Grid item xs={12} md={6} key={cls.id}>
            <Card variant="outlined" sx={{ boxShadow: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  <Link to={`/class/${cls.id}`} style={{ textDecoration: 'none', color: '#1976d2' }}>
                    {cls.name}
                  </Link>
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
                { user.role == 'teacher' 
                ? <Link to={`dashboard/teacherview/${cls.id}`} style={{ textDecoration: 'none' }}>
                  <Button size="small" variant="contained">View Class</Button>
                </Link>
                : <Link to={`/class/${cls.id}`} style={{ textDecoration: 'none' }}>
                  <Button size="small" variant="contained">Study</Button>
                </Link>}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Classes;
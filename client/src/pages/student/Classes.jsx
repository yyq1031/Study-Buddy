import React, { useEffect, useState } from 'react';
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
import { getClasses } from '../../api';

function Classes({ user }) {
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const token = localStorage.getItem('token');
        const classData = await getClasses(token);
        if (classData) setClasses(classData);
      } catch (err) {
        console.error('Failed to fetch classes:', err.message);
      }
    };

    fetchClasses();
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Welcome, {user.name}
      </Typography>
      <Typography variant="h6" gutterBottom>
        Your Enrolled Classes:
      </Typography>
      <Grid container spacing={3}>
        {classes.map((cls) => (
          <Grid item xs={12} md={6} key={cls.id}>
            <Card variant="outlined" sx={{ boxShadow: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  <Link to={`/class/${cls.id}/preferences`} style={{ textDecoration: 'none' }}>
                    <Button size="small" variant="contained">Study</Button>
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
                <Link to={`/class/${cls.id}`} style={{ textDecoration: 'none' }}>
                  <Button size="small" variant="contained">Study</Button>
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

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  CardActionArea,
  Container,
  CircularProgress
} from '@mui/material';
import { getClasses } from '../../api';

function TeacherDashboard() {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    getClasses(token).then(data => {
      setClasses(data);
      setLoading(false);
    }).catch(err => {
      console.error("Failed to fetch classes:", err);
      setLoading(false);
    });
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Your Classes
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={3}>
          {classes.map(cls => (
            <Grid item xs={12} sm={6} md={4} key={cls.id}>
              <Card elevation={3}>
                <CardActionArea onClick={() => navigate(`/dashboard/class/${cls.id}`)}>
                  <CardContent>
                    <Typography variant="h6">{cls.name}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      Created at: {new Date(cls.createdAt).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Students Enrolled: {cls.studentIds?.length || 0}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}

export default TeacherDashboard;

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  CardActionArea,
  CardMedia,
} from '@mui/material';

function Subject({ user }) {
  const navigate = useNavigate();
  const { classId } = useParams(); // get classId from URL
  const [classInfo, setClassInfo] = useState(null);

  const [progress, setProgress] = useState(null);
  const [recommended, setRecommended] = useState(null);
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    // Find the class info based on classId
    const foundClass = user?.classes.find(cls => String(cls.id) === classId);
    setClassInfo(foundClass);

    // Dummy values for now; replace with actual fetch logic later
    setProgress({ completed: 5, total: 10 });
    setRecommended({
      type: 'Quiz',
      title: 'Chapter 3: Algebra Practice',
      image: 'https://via.placeholder.com/400x200?text=Lesson+Preview',
      lessonId: foundClass?.latestLessonId,
    });
    setAssignments([
      { title: 'Assignment 1', due: '2025-06-30' },
      { title: 'Assignment 2', due: '2025-07-10' },
    ]);
  }, [classId, user]);

  const progressPercentage = progress ? (progress.completed / progress.total) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50 px-10 py-10">
      <Typography variant="h4" className="font-bold text-gray-800 mb-8">
        {classInfo ? classInfo.name : 'Class'} Dashboard
      </Typography>

      {/* Progress */}
      <div className="w-full mb-10">
        <Card variant="outlined" className="shadow-md w-full">
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Progress
            </Typography>
            {progress && (
              <>
                <Typography>
                  {progress.completed} of {progress.total} lessons completed
                </Typography>
                <Box mt={2}>
                  <LinearProgress variant="determinate" value={progressPercentage} />
                </Box>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Next Activity and Assignments */}
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Recommended Activity */}
        <Card variant="outlined" className="shadow-md w-full lg:w-1/2">
          <CardActionArea
            onClick={() =>
              window.location.href = `/class/${classId}/lesson/${recommended?.lessonId}`
            }
          >
            {recommended && (
              <CardMedia
                component="img"
                height="200"
                image={recommended.image}
                alt="Lesson Preview"
              />
            )}
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Next Recommended Activity
              </Typography>
              {recommended ? (
                <Typography>
                  {recommended.type}: <strong>{recommended.title}</strong>
                </Typography>
              ) : (
                <Typography color="textSecondary">Loading...</Typography>
              )}
            </CardContent>
          </CardActionArea>
        </Card>

        {/* Assignments */}
        <Card variant="outlined" className="shadow-md w-full lg:w-1/2">
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Assignments
            </Typography>
            {assignments.length > 0 ? (
              <List>
                {assignments.map((a, i) => (
                  <ListItem key={i} disablePadding>
                    <ListItemButton onClick={() => navigate(`/class/${classId}/assignment/${a.id}`)}>
  <ListItemText primary={a.title} secondary={`Due: ${a.due}`} />
</ListItemButton>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography>No assignments available</Typography>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Subject;

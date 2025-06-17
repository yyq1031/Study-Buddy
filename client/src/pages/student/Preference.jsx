import React, { useState } from 'react';
import { Container, Typography, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Button, Box } from '@mui/material';
import Transcript from './Transcript';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}
function PreferencePage() {
  const [preference, setPreference] = useState('');
  const { classId, lessonId } = useParams();
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (preference == "video") {
      navigate(`/class/${classId}/lesson/${lessonId}/video`);
    } else if (preference == "text") {
      navigate(`/class/${classId}/lesson/${lessonId}/transcript`);
    } else {
      alert("Please select a preference.");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Typography variant="h4" gutterBottom align="center">
        Choose Your Learning Preference for this Lesson!
      </Typography>
      <FormControl component="fieldset">
        <FormLabel component="legend">I learn best by:</FormLabel>
        <RadioGroup
          value={preference}
          onChange={(e) => setPreference(e.target.value)}
          sx={{ mt: 2 }}
        >
          <FormControlLabel value="video" control={<Radio />} label="Watching a Video" />
          {/* <FormControlLabel value="audio" control={<Radio />} label="Listening to Audio" /> */}
          <FormControlLabel value="text" control={<Radio />} label="Reading Text" />
        </RadioGroup>
      </FormControl>
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Continue
        </Button>
      </Box>
    </Container>
  );
}

export default PreferencePage;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Button, Box } from '@mui/material';
import Transcript from './Transcript';

function PreferencePage() {
  const [preference, setPreference] = useState('');
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (preference) {
      localStorage.setItem('learningPreference', preference);
      // Redirect to the transcript or lesson page 
      navigate('/transcript');
    } else {
      alert("Please select a preference.");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Typography variant="h4" gutterBottom align="center">
        Choose Your Learning Preference
      </Typography>
      <FormControl component="fieldset">
        <FormLabel component="legend">I learn best by:</FormLabel>
        <RadioGroup
          value={preference}
          onChange={(e) => setPreference(e.target.value)}
          sx={{ mt: 2 }}
        >
          <FormControlLabel value="video" control={<Radio />} label="Watching a Video (Visual)" />
          <FormControlLabel value="audio" control={<Radio />} label="Listening to Audio" />
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

import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Checkbox,
  CssBaseline,
  FormControl,
  FormControlLabel,
  FormLabel,
  Link,
  TextField,
  Typography,
  Stack,
  Card,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { signUp } from '../api';

const StyledCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('sm')]: {
    width: '450px',
  },
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
  height: '100vh',
  padding: theme.spacing(2),
  justifyContent: 'center',
  alignItems: 'center',
  backgroundImage:
    'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
  backgroundRepeat: 'no-repeat',
}));

export default function SignUp() {
  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    password: '',
  });

  const validateInputs = () => {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const errors = {};

    if (!name) errors.name = 'Name is required.';
    if (!/\S+@\S+\.\S+/.test(email)) errors.email = 'Please enter a valid email.';
    if (password.length < 6) errors.password = 'Password must be at least 6 characters.';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateInputs()) return;

    const data = new FormData(e.currentTarget);
    const name = data.get('name');
    const email = data.get('email');
    const password = data.get('password');
    if (name && email && password) {
      const {token, userData} = await signUp(name, email, password);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
    }

    alert("Signed up successfully!");
  };

  return (
    <>
      <CssBaseline />
      <SignUpContainer>
        <StyledCard variant="outlined">
          <Typography variant="h4" component="h1" align="center">
            Sign up
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl>
              <FormLabel htmlFor="name">Full Name</FormLabel>
              <TextField
                required
                fullWidth
                id="name"
                name="name"
                placeholder="Jon Snow"
                error={!!formErrors.name}
                helperText={formErrors.name}
              />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                required
                fullWidth
                id="email"
                name="email"
                placeholder="your@email.com"
                type="email"
                error={!!formErrors.email}
                helperText={formErrors.email}
              />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField
                required
                fullWidth
                id="password"
                name="password"
                type="password"
                placeholder="••••••"
                error={!!formErrors.password}
                helperText={formErrors.password}
              />
            </FormControl>

            <FormControlLabel
              control={<Checkbox value="agreeToEmails" color="primary" />}
              label="I want to receive updates via email."
            />

            <Button type="submit" variant="contained" fullWidth>
              Sign up
            </Button>
          </Box>

          <Typography variant="body2" align="center">
            Already have an account?{' '}
            <Link href="/signin" underline="hover">
              Sign in
            </Link>
          </Typography>
        </StyledCard>
      </SignUpContainer>
    </>
  );
}

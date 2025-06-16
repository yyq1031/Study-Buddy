import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar, Button, TextField, FormControlLabel, Checkbox, Link,
  Grid, Box, Typography, Container, CssBaseline
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme();

export default function SignIn({ onSignIn }) {
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get("email");
    const password = data.get("password");

    if (email && password) {
      // use email to determine role
      const role = email.includes("student") ? "student" : "teacher";

      const userData = {
        name: role === "student" ? "Alice" : "Prof. Smith",
        email,
        role,
        classes: role === "student" ? [
          { id: 1, name: "Math 101", latestLesson: "Derivatives", latestLessonId: "derivatives" },
          { id: 2, name: "Chemistry", latestLesson: "Acids and Bases", latestLessonId: "acids-bases" }
        ] : []
      };

      onSignIn(userData); 

      navigate(role === "student" ? "/classes" : "/account"); // change to teacher dashboard
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box sx={{
          marginTop: 8, display: "flex", flexDirection: "column",
          alignItems: "center", backgroundColor: "#f5f5f5",
          padding: 4, borderRadius: 2, boxShadow: 3,
        }}>
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">Sign in</Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField margin="normal" required fullWidth id="email" label="Email Address"
              name="email" autoComplete="email" autoFocus />
            <TextField margin="normal" required fullWidth name="password" label="Password"
              type="password" id="password" autoComplete="current-password" />
            <FormControlLabel control={<Checkbox value="remember" color="primary" />}
              label="Remember me" />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Sign In
            </Button>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Link href="#" variant="body2">Forgot password?</Link>
              </Grid>
              <Grid item xs={12}>
                <Link href="/signup" variant="body2">{"Don't have an account? Sign Up"}</Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

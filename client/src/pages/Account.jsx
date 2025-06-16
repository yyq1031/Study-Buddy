import { Typography, Container, Box } from "@mui/material";

export default function AccountPage() {
  return (
    <Container>
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4">Welcome to your account!</Typography>
        <Typography variant="body1">This is your dashboard or profile page.</Typography>
      </Box>
    </Container>
  );
}

require('dotenv').config();
const express = require("express");
const cors = require("cors");
const loginRoutes = require('./auth.js');

const app = express();
const PORT = process.env.PORT || 5001;

// CORS config must come before routes or middleware!
const corsOptions = {
  origin: '*',
  credentials: true, // needed if using cookies or sessions
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

// Parse JSON body
app.use(express.json());

// Your routes
app.use('/api', loginRoutes);

app.get('/api/hello', (req, res) => {
  res.json({ message: "hihi" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

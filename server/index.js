require('dotenv').config();
const express = require("express");
const cors = require("cors");
const { exec } = require('child_process');
const multer = require('multer');
const path = require('path');
const loginRoutes = require('./auth.js');

const app = express();
const PORT = process.env.PORT || 5001;

// CORS config must come before routes or middleware!
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true, // needed if using cookies or sessions
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

// Parse JSON body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const upload = multer({ dest: 'uploads/' });

// Your routes
app.use('/api', loginRoutes);

app.get('/api/hello', (req, res) => {
  res.json({ message: "hihi" });
});

// NOT WORKING!!! :((

app.post('/api/transcript', upload.single('video'), (req, res) => {
  const filePath = path.resolve(__dirname, req.file.path);

  exec(`python3 whisper.py "${filePath}"`, (error, stdout, stderr) => {
    if (error) {
      console.error("Whisper Error:", stderr);
      return res.status(500).json({ error: 'Failed to transcribe' });
    }
    res.json({ transcript: stdout });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

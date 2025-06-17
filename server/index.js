require('dotenv').config();
const express = require("express");
const cors = require("cors");
const { exec } = require('child_process');
// const multer = require('multer');
const path = require('path');
const { AssemblyAI } = require("assemblyai");
const loginRoutes = require('./auth.js');

const app = express();
const PORT = process.env.PORT || 5001;

// CORS config
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const upload = multer({ dest: 'uploads/' });

// Routes
app.use('/api', loginRoutes);

app.get('/api/hello', (req, res) => {
  res.json({ message: "hihi" });
});


// Local Whisper Python script
// app.post('/api/transcript', upload.single('video'), (req, res) => {
//   const filePath = path.resolve(__dirname, req.file.path);
//   exec(`python3 whisper.py "${filePath}"`, (error, stdout, stderr) => {
//     if (error) {
//       console.error("Whisper Error:", stderr);
//       return res.status(500).json({ error: 'Failed to transcribe' });
//     }
//     res.json({ transcript: stdout });
//   });
// });

// AssemblyAI API 
const client = new AssemblyAI({ apiKey: process.env.ASSEMBLYAI_API_KEY });

await fetch("http://localhost:5001/api/transcript-url", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ audioUrl: "https://your-public-audio-url.mp3" })
});


// Start server

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

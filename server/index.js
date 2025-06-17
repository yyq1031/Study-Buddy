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

app.post('/api/transcript-dynamic', async (req, res) => {
  console.log("Received request body:", req.body);
  const { classId, lessonId } = req.body;

  try {
    const lesson = await ClassModel.findOne({
      classId,
      lessonId,
      type: "lesson"
    });

    const audioUrl = lesson?.content || "https://storage.googleapis.com/aai-web-samples/espn-bears.mp3";

    const transcript = await client.transcripts.transcribe({
      audio: audioUrl,
      speech_model: "universal"
    });

    res.json({ transcript: transcript.text, sourceUrl: audioUrl });
  } catch (err) {
    console.error("Dynamic transcription error:", err);
    res.status(500).json({ error: "Failed to transcribe dynamic lesson" });
  }
});


// Start server

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

require('dotenv').config();
const express = require("express");
const cors = require("cors");
const { exec } = require('child_process');
const multer = require('multer');
const path = require('path');
const { AssemblyAI } = require("assemblyai");
const admin = require("firebase-admin");
const loginRoutes = require('./auth.js');

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const upload = multer({ dest: 'uploads/' });

// Auth routes
app.use('/api', loginRoutes);

app.get('/api/hello', (req, res) => {
  res.json({ message: "hihi" });
});

// AssemblyAI API 
const client = new AssemblyAI({ apiKey: process.env.ASSEMBLYAI_API_KEY });

app.post("/api/transcript-url", async (req, res) => {
  const { audioUrl } = req.body;

  if (!audioUrl || typeof audioUrl !== "string") {
    return res.status(400).json({ error: "Invalid audioUrl" });
  }

  try {
    const transcript = await client.transcripts.transcribe({
      audio: audioUrl,
      speech_model: "universal"
    });

    res.json({ transcript: transcript.text });
  } catch (err) {
    console.error("Transcription error:", err);
    res.status(500).json({ error: "Failed to transcribe" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

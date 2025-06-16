import React, { useRef, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as faceapi from 'face-api.js';
import { Button } from '@mui/material';

function LessonPage() {
  const { classId, lessonId } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef();
  const webcamRef = useRef();
  const [isDistracted, setIsDistracted] = useState(false);
  const [expression, setExpression] = useState('');
  const [expressionLog, setExpressionLog] = useState([]);
  //const [videoFinished, setVideoFinished] = useState(false);
  const distractionCounter = useRef(0);
  const intervalId = useRef(null);

  useEffect(() => {
    const loadModelsAndStart = async () => {
      const MODEL_URL = '/models';
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
        console.log("Models loaded");
        startWebcam();
      } catch (err) {
        console.error("Model loading error:", err);
      }
    };

    loadModelsAndStart();

    return () => clearInterval(intervalId.current);
  }, []);

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (webcamRef.current) {
        webcamRef.current.srcObject = stream;
        webcamRef.current.onloadedmetadata = () => {
          startMonitoring();
        };
      }
    } catch (err) {
      console.error("Error accessing webcam:", err);
    }
  };

  const startMonitoring = () => {
    intervalId.current = setInterval(async () => {
      if (!webcamRef.current) return;
      const detection = await faceapi
        .detectSingleFace(webcamRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      if (!detection) {
        setIsDistracted(true);
        distractionCounter.current += 1;
        if (distractionCounter.current >= 3 && videoRef.current && !videoRef.current.paused) {
          videoRef.current.pause();
        }
      } else {
        setIsDistracted(false);
        distractionCounter.current = 0;

        const expressions = detection.expressions;
        console.log("Raw Expressions:", expressions);

        const sorted = Object.entries(expressions)
          .filter(([_, val]) => val > 0.1)
          .sort((a, b) => b[1] - a[1]);

        if (sorted.length > 0) {
          const top = sorted[0][0];
          setExpression(top);
          setExpressionLog((prev) => [...prev, top]);
        }
      }
    }, 2000);
  };

  const handleVideoEnded = () => {
    setVideoFinished(true);
    const summary = expressionLog.reduce((acc, exp) => {
      acc[exp] = (acc[exp] || 0) + 1;
      return acc;
    }, {});

    console.log("Final expression log:", expressionLog);
    alert("Lesson complete! Expression summary:\n" + JSON.stringify(summary, null, 2));

    navigate(`/quiz/${classId}/${lessonId}`, { state: { emotionSummary: summary } });
  };

  const goToQuiz = () => {
    const summary = expressionLog.reduce((acc, exp) => {
      acc[exp] = (acc[exp] || 0) + 1;
      return acc;
    }, {});

    navigate(`/quiz/${classId}/${lessonId}`, { state: { emotionSummary: summary } });
  };

  return (
    <div style={{ padding: '20px', position: 'relative', minHeight: '100vh' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2>Lesson: {lessonId} (Class {classId})</h2>
        <Button
          variant="contained"
          color="primary"
          onClick={goToQuiz}
          disabled={!videoFinished}
          sx={{ ml: 2 }}
        >
        Go to Quiz
        </Button>
      </div>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        <div>
          <h3>Lecture Video</h3>
          <video
            ref={videoRef}
            controls
            width="500"
            src="https://www.w3schools.com/html/mov_bbb.mp4"
            onEnded={handleVideoEnded}
          />
        </div>

        <div>
          <h3>Your Webcam (Live)</h3>
          <video
            ref={webcamRef}
            autoPlay
            muted
            width="300"
            style={{ border: '2px solid #ccc', borderRadius: '8px' }}
          />
          <p style={{ color: isDistracted ? 'red' : 'green' }}>
            {isDistracted ? 'You seem distracted!' : 'Focus detected!'}
          </p>
          {expression && !isDistracted && (
            <p><strong>Detected Emotion:</strong> {expression}</p>
          )}
        </div>
      </div>

    </div>
  );
}

export default LessonPage;
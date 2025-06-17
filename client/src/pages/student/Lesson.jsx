import React, { useRef, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as faceapi from 'face-api.js';

function LessonPage() {
  const { classId, lessonId } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef();
  const webcamRef = useRef();
  const [isDistracted, setIsDistracted] = useState(false);
  const [expression, setExpression] = useState('');
  const [expressionLog, setExpressionLog] = useState([]);
  const [videoFinished, setVideoFinished] = useState(false);
  const [webcamStream, setWebcamStream] = useState(null);
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
      setWebcamStream(stream);
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

  const stopWebcam = () => {
    if (webcamStream) {
      webcamStream.getTracks().forEach(track => track.stop());
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

    //Added this so that expressionLog can be accessed in Quiz
    localStorage.setItem('expressionLog', JSON.stringify(expressionLog));
    console.log("Final expression log:", expressionLog);
    alert("Lesson complete! Expression summary:\n" + JSON.stringify(summary, null, 2));
  };

  const buttonStyle = {
    padding: "10px 24px",
    minWidth: "120px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "16px",
    textAlign: "center"
  };

  const greenButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#28a745"
  };

  const disabledButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#ccc",
    cursor: "not-allowed"
  };

  return (
    <div style={{ padding: '20px' }}>
      <div>
        <h2 style={{ display: 'inline-block', marginRight: '20px' }}>Lesson: {lessonId} (Class {classId})</h2>
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

          <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", marginTop: "20px" }}>
            <button
              onClick={() => {
                stopWebcam();
                alert("Previous clicked");
              }}
              style={buttonStyle}
            >
              Previous
            </button>

            <button
              onClick={() => {
                stopWebcam();
                navigate(`/quiz/${classId}/${lessonId}`);
              }}
              style={videoFinished ? greenButtonStyle : disabledButtonStyle}
              disabled={!videoFinished}
            >
              Take Quiz
            </button>

            <button
              onClick={() => {
                stopWebcam();
                alert("Next clicked");
              }}
              style={videoFinished ? buttonStyle : disabledButtonStyle}
              disabled={!videoFinished}
            >
              Next
            </button>
          </div>
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
import React, { useRef, useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';

function Transcript() {
  const videoRef = useRef();
  const webcamRef = useRef();
  const [expression, setExpression] = useState('');
  const [expressionLog, setExpressionLog] = useState([]);
  const [webcamStream, setWebcamStream] = useState(null);
  const [transcript, setTranscript] = useState('');
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

      if (detection) {
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
// double check
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('video', file);

    try {
      const response = await fetch('http://localhost:5001/api/transcript', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      setTranscript(data.text);
    } catch (err) {
      console.error("Transcription error:", err);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Transcribe & Emotion Detection Page</h2>
      <div style={{ marginTop: '20px' }}>
        <input type="file" accept="audio/*,video/*" onChange={handleUpload} />
      </div>
      <div style={{ marginTop: '20px' }}>
        <h3>Transcript:</h3>
        <p style={{ whiteSpace: 'pre-wrap', background: '#f1f1f1', padding: '10px', borderRadius: '5px' }}>{transcript}</p>
      </div>

      <div style={{ marginTop: '30px' }}>
        <h3>Live Emotion Detection</h3>
        <video
          ref={webcamRef}
          autoPlay
          muted
          width="300"
          style={{ border: '2px solid #ccc', borderRadius: '8px' }}
        />
        {expression && (
          <p><strong>Detected Emotion:</strong> {expression}</p>
        )}
      </div>
    </div>
  );
}

export default Transcript;
import React, { useRef, useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';

function Transcript() {
  const webcamRef = useRef();
  const [expression, setExpression] = useState('');
  const [expressionLog, setExpressionLog] = useState([]);
  const [webcamStream, setWebcamStream] = useState(null);
  const [transcript, setTranscript] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
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

  const handleSubmitUrl = async () => {
    if (!audioUrl) {
      alert("Please enter an audio/video URL.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5001/api/transcript-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ audioUrl })
      });

      const data = await response.json();
      if (data.transcript) {
        setTranscript(data.transcript);
      } else {
        alert("Transcription failed. Please check your URL or try again.");
      }
    } catch (err) {
      console.error("Transcription error:", err);
      alert("Something went wrong while fetching the transcript.");
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Transcription + Emotion Detection</h2>

      <div style={{ marginTop: '20px' }}>
        <label>
          Paste Audio/Video URL:
          <input
            type="text"
            value={audioUrl}
            onChange={(e) => setAudioUrl(e.target.value)}
            placeholder="https://storage.googleapis.com/aai-web-samples/espn-bears.m4a"
            style={{ width: '100%', padding: '10px', marginTop: '10px' }}
          />
        </label>
        <button
          onClick={handleSubmitUrl}
          style={{
            marginTop: '15px',
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Transcribe
        </button>
      </div>

      <div style={{ marginTop: '30px' }}>
        <h3>Transcript:</h3>
        <p style={{ whiteSpace: 'pre-wrap', background: '#f1f1f1', padding: '10px', borderRadius: '5px' }}>
          {transcript}
        </p>
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

        <div style={{ marginTop: '20px' }}>
          <h4>Emotion Log (Recent)</h4>
          <ul style={{
            maxHeight: '150px',
            overflowY: 'auto',
            background: '#fafafa',
            padding: '10px',
            borderRadius: '5px'
          }}>
            {expressionLog.slice(-10).reverse().map((exp, idx) => (
              <li key={idx}>{exp}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Transcript;

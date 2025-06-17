import React, { useRef, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as faceapi from 'face-api.js';

function Transcript() {
  const { classId, lessonId } = useParams();
  const webcamRef = useRef();
  const [expression, setExpression] = useState('');
  const [expressionLog, setExpressionLog] = useState([]);
  const [webcamStream, setWebcamStream] = useState(null);
  const [transcript, setTranscript] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);
  const [transcriptionComplete, setTranscriptionComplete] = useState(false);
  const navigate = useNavigate();
  const intervalId = useRef(null);

  useEffect(() => {
    const MODEL_URL = '/models';
    const loadModels = async () => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
        console.log("Models loaded");
        startWebcam();
      } catch (err) {
        console.error("Model loading error:", err);
      }
    };

    loadModels();

    const onScroll = () => {
      const atBottom = window.innerHeight + window.scrollY >= document.body.scrollHeight - 20;
      setIsScrolledToBottom(atBottom);
    };
    window.addEventListener('scroll', onScroll);

    return () => {
      clearInterval(intervalId.current);
      window.removeEventListener('scroll', onScroll);
    };
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
          setExpressionLog(prev => [...prev, top]);
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ audioUrl })
      });

      const data = await response.json();
      if (data.transcript) {
        setTranscript(data.transcript);
        setTranscriptionComplete(true);
      } else {
        alert("Transcription failed. Please check your URL or try again.");
      }
    } catch (err) {
      console.error("Transcription error:", err);
      alert("Something went wrong while fetching the transcript.");
    }
  };

  const canProceed = transcriptionComplete && isScrolledToBottom;

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
      <h2>Lesson Transcription</h2>

      <div style={{ marginTop: '20px' }}>
        <label>
          Paste Audio/Video URL: https://drive.google.com/uc?export=download&id=14wxETmr3sToystahOpmWa5Rh5M6n_2TL
          <input
            type="text"
            value={audioUrl}
            onChange={(e) => setAudioUrl(e.target.value)}
            placeholder="German1"
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
        <div style={{ 
  background: '#f9f9f9',
  padding: '20px',
  borderRadius: '8px',
  lineHeight: '1.7',
  textAlign: 'left',
  fontSize: '16px',
  color: '#333'
}}>
  {transcript
    .split(/\n\s*\n|(?<=[.?!])\s{2,}/)
    .map((para, idx) => (
      <p key={idx} style={{
        marginBottom: '16px',
        textIndent: '2em',
        marginTop: idx === 0 ? 0 : '8px'
      }}>
        {para.trim()}
      </p>
    ))}
</div>

      </div>

      <div style={{ marginTop: '30px' }}>
        <h3>Emotion Detection</h3>
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

      <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", marginTop: "30px" }}>
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
            navigate(`/${classId}/${lessonId}/text`);
          }}
          style={canProceed ? greenButtonStyle : disabledButtonStyle}
          disabled={!canProceed}
        >
          Take Quiz
        </button>

        <button
          onClick={() => {
            stopWebcam();
            alert("Next clicked");
          }}
          style={canProceed ? buttonStyle : disabledButtonStyle}
          disabled={!canProceed}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Transcript;
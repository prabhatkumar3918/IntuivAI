import { Backdrop } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

// Specify the path to the worker script
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@2.15.349/build/pdf.worker.min.js`;

const VideoCallWithAI = () => {
  const applicantVideoRef = useRef(null);
  const [applicantSubtitles, setApplicantSubtitles] = useState("");
  const [responseAudio, setResponseAudio] = useState(null);
  const [recognition, setRecognition] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    // List devices and check for video input devices
    navigator.mediaDevices
      .enumerateDevices()
      .then((deviceInfos) => {
        const videoDevices = deviceInfos.filter(
          (deviceInfo) => deviceInfo.kind === "videoinput"
        );
        if (videoDevices.length > 0) {
          // Use the first video device
          startStream(videoDevices[0].deviceId);
        } else {
          console.error("No video input devices found.");
        }
        setDevices(deviceInfos);
      })
      .catch((err) => console.error("Error enumerating devices:", err));

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [recognition]);

  const startStream = (deviceId) => {
    navigator.mediaDevices
      .getUserMedia({
        video: { deviceId: { exact: deviceId } },
        audio: true,
      })
      .then((stream) => {
        if (applicantVideoRef.current) {
          applicantVideoRef.current.srcObject = stream;
          applicantVideoRef.current.play();
        }
      })
      .catch((err) => console.error("Error accessing webcam:", err));
  };

  const startSpeechRecognition = () => {
    if (window.SpeechRecognition || window.webkitSpeechRecognition) {
      const recog = new (window.SpeechRecognition ||
        window.webkitSpeechRecognition)();
      recog.lang = "en-US";
      recog.interimResults = true;
      recog.continuous = false; // Single interaction

      recog.onresult = (event) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          transcript += result[0].transcript;
        }
        setApplicantSubtitles(transcript);
      };

      recog.onend = () => {
        if (isRecording) {
          recog.start();
        }
      };

      recog.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
      };

      recog.start();
      setRecognition(recog);
      setIsRecording(true);
    } else {
      console.error("Speech recognition not supported");
    }
  };

  const stopSpeechRecognition = () => {
    if (recognition) {
      recognition.stop();
      setIsRecording(false);
    }
  };

  const handleToggleRecording = () => {
    if (isRecording) {
      stopSpeechRecognition();
      sendTranscriptToBackend(applicantSubtitles);
    } else {
      startSpeechRecognition();
    }
  };

  const sendTranscriptToBackend = async (transcript) => {
    try {
      const response = await fetch("/api/convert-speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ transcript }),
      });
      const data = await response.json();
      setResponseAudio(data.audioUrl);
    } catch (error) {
      console.error("Error sending transcript to backend:", error);
    }
  };

  return (
    <div style={styles.container}>
      {/* Full screen video */}
      <div style={styles.videoContainer}>
        {/* PDF Overlay */}
        <div style={styles.pdfOverlay}>
          <iframe
            src="/CV_Himdyuti.pdf#toolbar=0&view=fitV" // Disable PDF toolbar and fit height
            width="100%"
            height="60vh"
            style={styles.pdfIframe}
            title="CV"

            frameBorder="0"
          ></iframe>
        </div>
        <video
          ref={applicantVideoRef}
          style={styles.video}
          autoPlay
          muted
          playsInline
          onError={(e) => console.error("Error loading video:", e)}
        />
        {/* Applicant subtitles */}
        {applicantSubtitles && (
          <div style={styles.subtitles}>{applicantSubtitles}</div>
        )}

        {/* AI Video Placeholder */}
        <div style={styles.aiVideoWrapper}>
          <div style={styles.placeholder}>
            <div style={styles.aibot}>
              AI BOT
            </div>
          </div>
        </div>

        {/* Response audio player */}
        {responseAudio && (
          <audio controls>
            <source src={responseAudio} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        )}

        {/* Button to toggle recording */}
        <button onClick={handleToggleRecording} style={styles.button}>
          {isRecording ? "Stop Listening" : "Start Listening"}
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    flexDirection: "row",
  },
  videoContainer: {
    position: "relative",
    width: "100%",
    height: "100%",
  },
  video: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  pdfOverlay: {
    position: "absolute",
    top: "10%",
    width: "30%",
    marginLeft: "2rem",
    // height: "100%",
    // height: "max-content",
    backgroundColor: "transparent",
    // backgroundColor: "rgba(255, 255, 255, 0.5)", // 50% transparency
    zIndex: 20, // Ensure the PDF overlay is above the video
    // filter: "brightness(1.5)",
    // transform: "scale(1.25)",
  },
  pdfIframe: {
    border: "none",
    width: "100%",
    // height: "100%",
    height: "80vh",
    objectFit: "cover",
    opacity: "0.8",
    filter:"brightness(1)",
  },
  aiVideoWrapper: {
    position: "absolute",
    top: "10%",
    right: "3%",
    width: "20%",
    height: "20%",
    backgroundColor: "#000",
    zIndex: 30, // Ensure the AI video is above the PDF
  },
  placeholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "black",
    color: "white",
    display: "flex",
    // justifyContent: "center",
    alignItems: "end"
  },
  subtitles: {
    position: "absolute",
    bottom: "10px",
    left: "10px",
    color: "white",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    padding: "5px",
    borderRadius: "5px",
    maxWidth: "90%",
    wordWrap: "break-word",
    zIndex: 10, // Ensure subtitles are visible on top of the video
  },
  button: {
    position: "absolute",
    bottom: "20px",
    left: "50%",
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    zIndex: 40, // Ensure the button is always on top
  },
  aibot:{
    
    color: "white",
    fontSize: "20px",
    fontWeight: "bold",
    marginLeft: "5%"
  }
};

export default VideoCallWithAI;

import { Backdrop } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import endCallIcon from "./assets/end-call-icon.png";
import videoOnIcon from "./assets/video-on-icon.png";
import videoOffIcon from "./assets/video-off-icon.png";
import micOnIcon from "./assets/mic-on-icon.png";
import micOffIcon from "./assets/mute.png";
import volumeIcon from "./assets/volume-icon.png";
import Navbar from "./Navbar/Navbar";

// Specify the path to the worker script
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@2.15.349/build/pdf.worker.min.js`;

const VideoCallWithAI = () => {
  const applicantVideoRef = useRef(null);
  const [applicantSubtitles, setApplicantSubtitles] = useState("");
  const [responseAudio, setResponseAudio] = useState(null);
  const [recognition, setRecognition] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [devices, setDevices] = useState([]);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    // List devices and check for video input devices
    navigator.mediaDevices
      .enumerateDevices()
      .then((deviceInfos) => {
        const videoDevices = deviceInfos.filter(
          (deviceInfo) => deviceInfo.kind === "videoinput"
        );
        if (videoDevices.length > 0) {
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
      recog.continuous = false;

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

  const handleEndCall = () => {
    console.log("Call ended.");
    if (applicantVideoRef.current) {
      const stream = applicantVideoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      applicantVideoRef.current.srcObject = null;
    }
  };

  const handleToggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled);
    if (applicantVideoRef.current) {
      const videoTracks = applicantVideoRef.current.srcObject.getVideoTracks();
      videoTracks.forEach((track) => (track.enabled = !isVideoEnabled));
    }
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
    if (applicantVideoRef.current) {
      const audioTracks = applicantVideoRef.current.srcObject.getAudioTracks();
      audioTracks.forEach((track) => (track.enabled = !isMuted));
    }
  };

  return (
    <div style={styles.container}>
      {/* Full screen video */}
      <div style={styles.videoContainer}>
        <div style={styles.logo_text}>Intuiv.ai</div>
        {/* PDF Overlay */}
        <div style={styles.backCV}>
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
            <div style={styles.aibot}>AI BOT</div>
          </div>
        </div>

        {/* Response audio player */}
        {responseAudio && (
          <audio controls>
            <source src={responseAudio} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        )}
        <button onClick={handleToggleRecording} style={styles.hiddenButton}>
          {isRecording ? "Stop Listening" : "Start Listening"}
        </button>

        <div style={styles.controlButtons}>
          <button onClick={handleEndCall} style={styles.controlButton}>
            <img src={endCallIcon} alt="End Call" style={styles.icon} />
          </button>
          <button onClick={handleToggleVideo} style={styles.controlButton}>
            <img
              src={isVideoEnabled ? videoOnIcon : videoOffIcon}
              alt="Toggle Video"
              style={styles.icon}
            />
          </button>
          <button onClick={handleToggleMute} style={styles.controlButton}>
            <img
              src={isMuted ? micOffIcon : micOnIcon}
              alt="Toggle Mute"
              style={styles.icon}
            />
          </button>
          <button style={styles.controlButton}>
            <img src={volumeIcon} alt="Volume" style={styles.icon} />
          </button>
        </div>
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
    filter: "brightness(1)",
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
    alignItems: "end",
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
  aibot: {
    color: "white",
    fontSize: "20px",
    fontWeight: "bold",
    marginLeft: "5%",
  },
  hiddenButton: {
    display: "none",
  },
  controlButtons: {
    position: "absolute",
    bottom: "10px",
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: "10px",
    padding: "5px",
    width: "25%",

    zIndex: 10,
  },
  controlButton: {
    padding: "10px",
    margin: "0 5px",
    border: "none",
    borderRadius: "50%",
    cursor: "pointer",
    backgroundColor: "transparent",
    color: "#fff",
  },
  icon: {
    width: "24px",
    height: "24px",
  },
  logo_text: {
    marginLeft: "2%",
    marginTop: "1%",
    backgroundColor: "transparent",
    position: "absolute",
    fontSize: "29px",
    lineHeight: "1.4",
    fontWeight: "bold",
  },
};

export default VideoCallWithAI;

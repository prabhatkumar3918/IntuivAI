import React, { useEffect, useRef } from 'react';

const VideoCallWithAI = () => {
  const applicantVideoRef = useRef(null);
  const pdfUrl = '/CV_Himdyuti.pdf'; // Ensure this path is correct

  useEffect(() => {
    // Access the user's webcam
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        if (applicantVideoRef.current) {
          applicantVideoRef.current.srcObject = stream;
        }
      })
      .catch(err => console.error('Error accessing webcam:', err));
  }, []);

  return (
    <div style={styles.container}>
      {/* Left 30%: PDF viewer for CV */}
      <div style={styles.pdfContainer}>
        <iframe
          src={pdfUrl}
          width="100%"
        //   height="100%"
          style={styles.pdfIframe}
          title="CV"
          frameBorder="0"
        ></iframe>
      </div>

      {/* Right 70%: Video streams */}
      <div style={styles.videoContainer}>
        <div style={styles.applicantVideoWrapper}>
          <video
            ref={applicantVideoRef}
            style={styles.video}
            autoPlay
            muted
          />
        </div>
        <div style={styles.aiVideoWrapper}>
          {/* Black placeholder for AI video */}
          <div style={styles.placeholder}></div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    height: '100vh',
  },
  pdfContainer: {
    width: '40%',
    backgroundColor: '#f0f0f0',
    padding: '10px',
    position: 'relative',
  },
  pdfIframe: {
    border: 'none',
    width: '100%',
    height: '100%',
    objectFit: 'contain', // Ensure the PDF fits within the container
  },
  videoContainer: {
    width: '60%',
    position: 'relative',
  },
  applicantVideoWrapper: {
    width: '100%',
    height: '100%',
  },
  video: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  aiVideoWrapper: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    width: '20%',
    height: '20%',
    backgroundColor: '#000',
  },
  placeholder: {
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
  },
};

export default VideoCallWithAI;

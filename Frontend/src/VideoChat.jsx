import React, { useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import { Worker, Viewer } from '@react-pdf-viewer/core'; // Import the Viewer component
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import cv from './21MA25002_PARTH SINHA.pdf';

const VideoChat = () => {
    const [participantSubtitle, setParticipantSubtitle] = useState('');
    const [aiSubtitle, setAiSubtitle] = useState('');
    const [recognition, setRecognition] = useState(null);
    const [isListening, setIsListening] = useState(false);

    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    useEffect(() => {
        if ('webkitSpeechRecognition' in window) {
            const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
            const recognitionInstance = new SpeechRecognition();
            recognitionInstance.continuous = true;
            recognitionInstance.interimResults = true;

            recognitionInstance.onresult = (event) => {
                let transcript = '';
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    transcript += event.results[i][0].transcript;
                }
                setParticipantSubtitle(transcript);
                // handleSend(transcript);
            };

            recognitionInstance.onend = () => {
                setIsListening(false);
            };

            setRecognition(recognitionInstance);
        } else {
            console.error("Speech recognition is not supported by this browser.");
        }
    }, []);

    useEffect(() => {
        if (isListening && recognition) {
            recognition.start();
        } else if (recognition) {
            recognition.stop();
        }
    }, [isListening, recognition]);

    const handleSend = (text) => {
        // Simulate sending the transcript to the backend and getting AI response
        fetch('YOUR_BACKEND_API_ENDPOINT', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        })
        .then(response => response.json())
        .then(data => {
            setAiSubtitle(data.responseText); // Set AI subtitle with response
        })
        .catch(error => {
            console.error('Error sending message:', error);
        });
    };

    return (
        <div style={{ display: 'flex', height: '100vh', width: '100%' }}>
            {/* CV PDF Viewer */}
            <div style={{ width: '30%', height: '100%', overflow: 'auto' }}>
                <Worker workerUrl={`https://unpkg.com/pdfjs-dist@2.9.359/build/pdf.worker.min.js`}>
                    <div style={{ height: '100%' }}>
                        <Viewer
                            fileUrl={cv}
                            plugins={[defaultLayoutPluginInstance]}
                        />
                    </div>
                </Worker>
            </div>

            {/* Main Video Area */}
            <div style={{ width: '70%', position: 'relative' }}>
                {/* Full Screen Video (Participant's Video) */}
                <Webcam
                    audio={false}
                    style={{ 
                        position: 'absolute', 
                        top: 0, 
                        left: 0, 
                        height: '100%', 
                        width: '100%', 
                        objectFit: 'cover', 
                        zIndex: 1 
                    }}
                />
                {/* AI Video Overlay */}
                <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    height: '150px',
                    width: '200px',
                    backgroundColor: 'black', 
                    zIndex: 2 
                }}></div>

                {/* Subtitles Display */}
                <div style={{
                    position: 'absolute',
                    bottom: '10px',
                    left: '0',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 3, 
                    padding: '10px',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
                    color: 'white',
                    fontSize: '16px',
                    textAlign: 'center'
                }}>
                    <div>
                        <strong>Participant:</strong> {participantSubtitle}
                    </div>
                    <div>
                        <strong>AI:</strong> {aiSubtitle}
                    </div>
                </div>

                {/* Button to toggle listening */}
                <button 
                    onClick={() => setIsListening(!isListening)}
                    style={{ position: 'absolute', bottom: '10px', right: '10px' }}
                >
                    {isListening ? 'Stop Listening' : 'Start Listening'}
                </button>
            </div>
        </div>
    );
};

export default VideoChat;

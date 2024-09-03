import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {  VisionUIControllerProvider } from './context'


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <VisionUIControllerProvider>
  <App />
</VisionUIControllerProvider>
);

reportWebVitals();

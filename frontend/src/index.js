import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import FlagSubmission from './pages/flagSubmission';

// Create a root and render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <FlagSubmission />
  </React.StrictMode>
);

import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import FlagSubmission from './pages/flagSubmission';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/flag-submission" replace />} />
        <Route path="/flag-submission" element={<FlagSubmission />} />
      </Routes>
    </Router>
  );
}

export default App;
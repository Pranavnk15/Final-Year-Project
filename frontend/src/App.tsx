import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AnalyzerPage from './pages/AnalyzerPage';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/analyzer" element={<AnalyzerPage />} />
      </Routes>
    </Router>
  );
}

export default App;
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Auth from './pages/Auth';
import MergePdf from './pages/MergePdf';
import CompressPdf from './pages/CompressPdf';

const App = () => {
  return (
    <Router>
      <div className="bg-white min-h-screen text-gray-900 transition-colors duration-300 pt-24">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/merge" element={<MergePdf />} />
          <Route path="/compress" element={<CompressPdf />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
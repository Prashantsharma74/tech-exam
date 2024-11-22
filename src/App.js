import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import Home from './pages/home'
import SignUp from './pages/Signup';
import Success from './pages/success';

function App() {
  return (
    <div className="App">
      <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/information" element={<SignUp />} />
            <Route path="/success" element={<Success />} />
           
           
          </Routes>
      </Router>
    </div>
  );
}

export default App;

// tutorlink-frontend/src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Import your pages
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import TutorDashboard from './pages/TutorDashboard';
import TutorSearch from './pages/TutorSearch';
import SessionHistory from './pages/SessionHistory';
// Import ProtectedRoute if you have it
// import ProtectedRoute from './components/ProtectedRoute';

// Import your existing CSS files
import './styles/TL_index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/student" element={<HomePage />} />
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/search" element={<TutorSearch />} />
            <Route path="/student/history" element={<SessionHistory />} />
            <Route path="/student/schedule" element={<StudentDashboard />} /> {/* For now, redirects to dashboard */}
            <Route path="/tutor" element={<TutorDashboard />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
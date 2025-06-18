import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StudentDashboard from "./pages/StudentDashboard";
import HomePage from "./pages/HomePage"; // Uncomment if you have this
import TutorDashboard from "./pages/TutorDashboard";
import Login from "./pages/Login";
import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {
  const clientId = "209053853003-aekcjsklke994e971pa0fs8p6rk928e9.apps.googleusercontent.com"; // Replace with your actual Google Client ID

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/tutor" element={<TutorDashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<div>404 - Page Not Found</div>} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;

// src/pages/HomePage.jsx
import React from "react";
import { Link } from "react-router-dom";
import "../styles/TL_index.css";

const HomePage = () => {
  return (
    <div>
      {/* Header */}
      <header className="header">
        <nav className="nav">
          <div className="logo">TutorLink</div>
          <ul className="nav-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/student">Find a Tutor</Link></li>
            <li><Link to="/student/dashboard">Student Dashboard</Link></li>
            <li><Link to="/tutor">Tutor Dashboard</Link></li>
            <li><Link to="/login" className="btn btn-login">Login</Link></li>
          </ul>
        </nav>
      </header>

      <div className="container">
        {/* Hero Section */}
        <div className="page active">
          <div className="hero">
            <h1>TutorLink</h1>
            <h2>College Tutoring Made Simple</h2>
            <p>
              Connect with fellow students and graduate tutors for academic
              support in any subject
            </p>
            <div className="cta-buttons">
              <Link to="/student" className="btn btn-primary">Find a Tutor</Link>
              <Link to="/tutor" className="btn btn-secondary">Tutor Dashboard</Link>
            </div>
          </div>

          {/* Features */}
          <div className="features">
            <div className="feature">
              <h3>Peer-to-Peer Learning</h3>
              <p>
                Connect with students who excel in subjects you're struggling
                with.
              </p>
            </div>
            <div className="feature">
              <h3>College-Focused</h3>
              <p>
                All tutors understand college-level coursework and academic
                expectations.
              </p>
            </div>
            <div className="feature">
              <h3>Flexible & Affordable</h3>
              <p>
                Study sessions that fit around your class schedule and budget.
              </p>
            </div>
          </div>

          {/* How It Works */}
          <div className="about-section">
            <h2>How TutorLink Works</h2>
            <div className="steps">
              <div className="step">
                <div className="step-number">1</div>
                <h4>Create Your Profile</h4>
                <p>
                  Sign up as a student seeking help or as a tutor offering your
                  expertise
                </p>
              </div>
              <div className="step">
                <div className="step-number">2</div>
                <h4>Find Your Match</h4>
                <p>Browse available tutors or manage your tutoring requests</p>
              </div>
              <div className="step">
                <div className="step-number">3</div>
                <h4>Start Learning</h4>
                <p>Schedule sessions and start improving your grades</p>
              </div>
            </div>
          </div>

          {/* Subjects Section */}
          <div className="subjects-section">
            <h2>Popular Subjects</h2>
            <div className="subjects-grid">
              <div className="subject-card">
                <h4>Mathematics</h4>
                <p>Calculus, Statistics, Linear Algebra</p>
              </div>
              <div className="subject-card">
                <h4>Sciences</h4>
                <p>Chemistry, Physics, Biology</p>
              </div>
              <div className="subject-card">
                <h4>Computer Science</h4>
                <p>Programming, Data Structures</p>
              </div>
              <div className="subject-card">
                <h4>Business</h4>
                <p>Economics, Accounting, Finance</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <p>&copy; 2025 TutorLink - College Tutoring Platform</p>
            <div className="footer-links">
              <a href="#">About</a>
              <a href="#">Help</a>
              <a href="#">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
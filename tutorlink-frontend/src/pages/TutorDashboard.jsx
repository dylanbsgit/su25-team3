import React, { useEffect, useState } from "react";
import "../styles/TL_tutor.css";

const TutorDashboard = () => {
  const [tutor, setTutor] = useState(null);

  useEffect(() => {
    const fetchTutorProfile = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/tutors/test");
        if (!response.ok) throw new Error("Failed to fetch tutor profile");
        const data = await response.json();
        setTutor(data);
      } catch (error) {
        console.error("Error loading tutor data:", error);
      }
    };

    fetchTutorProfile();
  }, []);

  if (!tutor) return <div>Loading Tutor Dashboard...</div>;

  return (
    <div>
      <header className="header">
        <nav className="nav">
          <div className="logo">TutorLink</div>
          <ul className="nav-links">
            <li><a href="/">Home</a></li>
            <li><a href="/student">Find a Tutor</a></li>
            <li><a href="/student/dashboard">Student Dashboard</a></li>
            <li><a href="/tutor">Tutor Dashboard</a></li>
            <li><a href="#">Messages</a></li>
          </ul>
        </nav>
      </header>

      <div className="container">
        <div className="page active">
          <div className="dashboard-header">
            <h1>Welcome, {tutor.name}!</h1>
            <p>{tutor.subject} Tutor • {tutor.education}</p>
            <button className="btn btn-secondary">Edit Profile</button>
          </div>

          <div className="tutor-stats">
            <div className="stat-card"><h3>{tutor.stats.students}</h3><p>Active Students</p></div>
            <div className="stat-card"><h3>{tutor.stats.rating}</h3><p>Average Rating</p></div>
            <div className="stat-card"><h3>{tutor.stats.earnings}</h3><p>This Month</p></div>
            <div className="stat-card"><h3>{tutor.stats.reviews}</h3><p>Total Reviews</p></div>
          </div>

          <div className="dashboard-content">
            <div className="dashboard-section">
              <h2>New Tutoring Requests</h2>
              <div className="request-list">
                {tutor.requests.map((req, idx) => (
                  <div className="request-item" key={idx}>
                    <div className="request-info">
                      <strong>{req.name}</strong>
                      <span>{req.year}</span>
                      <p>{req.topic}</p>
                      <small>Requested {req.time}</small>
                    </div>
                    <div className="request-actions">
                      <button className="btn btn-primary btn-small">Accept</button>
                      <button className="btn btn-secondary btn-small">Decline</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="dashboard-section">
              <h2>Upcoming Appointments</h2>
              <div className="appointment-list">
                {tutor.appointments.map((appt, idx) => (
                  <div className="appointment-item" key={idx}>
                    <div className="appointment-time">
                      <div className="date">{appt.date}</div>
                      <div className="time">{appt.time}</div>
                    </div>
                    <div className="appointment-details">
                      <strong>{appt.name}</strong>
                      <p>{appt.topic}</p>
                      <span className="location">{appt.location}</span>
                    </div>
                    <div className="appointment-actions">
                      <button className="btn btn-small btn-primary">Message</button>
                      <button className="btn btn-small btn-secondary">Reschedule</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="dashboard-section">
              <h2>Quick Actions</h2>
              <div className="quick-actions">
                <button className="action-card">
                  <div className="action-icon">📅</div>
                  <h4>Set Availability</h4>
                  <p>Update your available hours</p>
                </button>
                <button className="action-card">
                  <div className="action-icon">💰</div>
                  <h4>Update Rates</h4>
                  <p>Change your hourly pricing</p>
                </button>
                <button className="action-card">
                  <div className="action-icon">📚</div>
                  <h4>Add Subjects</h4>
                  <p>Expand your tutoring areas</p>
                </button>
                <button className="action-card">
                  <div className="action-icon">📊</div>
                  <h4>View Analytics</h4>
                  <p>See detailed performance stats</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

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

export default TutorDashboard;
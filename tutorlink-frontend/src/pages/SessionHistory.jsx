// tutorlink-frontend/src/pages/SessionHistory.jsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ApiService from '../services/ApiService';
import '../styles/TL_student_dash.css';

const SessionHistory = () => {
  const { user, role, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, paid, unpaid

  useEffect(() => {
    if (!isAuthenticated || role !== 'student') {
      navigate('/login');
      return;
    }

    fetchAppointments();
  }, [isAuthenticated, role, navigate, user?.id]);

  const fetchAppointments = async () => {
    try {
      const appointmentsData = await ApiService.getAllAppointments();
      // Filter for current student's completed appointments
      const studentAppointments = (appointmentsData || [])
        .filter(apt => apt.student?.id === user.id && apt.status === 'COMPLETED')
        .sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime)); // Most recent first
      
      setAppointments(studentAppointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter appointments based on payment status
  const filteredAppointments = appointments.filter(apt => {
    if (filter === 'all') return true;
    if (filter === 'paid') return apt.isPaid; // You'll need to add this field to your backend
    if (filter === 'unpaid') return !apt.isPaid;
    return true;
  });

  // Calculate totals
  const totalSessions = appointments.length;
  const totalSpent = appointments.filter(apt => apt.isPaid).length * 25; // Assuming $25/session
  const unpaidAmount = appointments.filter(apt => !apt.isPaid).length * 25;

  if (loading) return <div>Loading session history...</div>;

  return (
    <div>
      <header className="header">
        <nav className="nav">
          <div className="logo">TutorLink</div>
          <ul className="nav-links">
            <li><a href="/student/search">Find New Tutor</a></li>
            <li><a href="/student/dashboard">Student Dashboard</a></li>
            <li>
              <button 
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="btn btn-secondary"
              >
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </header>

      <div className="container">
        <div className="page active">
          <div className="dashboard-header">
            <h1>Session History</h1>
            <p>Track your completed sessions and payments</p>
          </div>

          {/* Summary Stats */}
          <div className="tutor-stats" style={{ marginBottom: '2rem' }}>
            <div className="stat-card">
              <h3>{totalSessions}</h3>
              <p>Total Sessions</p>
            </div>
            <div className="stat-card">
              <h3>${totalSpent}</h3>
              <p>Total Paid</p>
            </div>
            <div className="stat-card" style={{ background: unpaidAmount > 0 ? '#dc3545' : '#28a745' }}>
              <h3>${unpaidAmount}</h3>
              <p>Unpaid Amount</p>
            </div>
          </div>

          {/* Filter Section */}
          <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
            <button
              className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilter('all')}
            >
              All Sessions ({appointments.length})
            </button>
            <button
              className={`btn ${filter === 'paid' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilter('paid')}
            >
              Paid ({appointments.filter(apt => apt.isPaid).length})
            </button>
            <button
              className={`btn ${filter === 'unpaid' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilter('unpaid')}
            >
              Unpaid ({appointments.filter(apt => !apt.isPaid).length})
            </button>
          </div>

          {/* Sessions List */}
          <div className="dashboard-section">
            <h2>Completed Sessions</h2>
            {filteredAppointments.length === 0 ? (
              <p>No sessions found for the selected filter.</p>
            ) : (
              <div className="appointment-list">
                {filteredAppointments.map(appointment => (
                  <div key={appointment.apptID} className="appointment-item" style={{
                    borderLeft: `4px solid ${appointment.isPaid ? '#28a745' : '#dc3545'}`
                  }}>
                    <div className="appointment-time">
                      <div className="date">{new Date(appointment.dateTime).toLocaleDateString()}</div>
                      <div className="time">{new Date(appointment.dateTime).toLocaleTimeString()}</div>
                    </div>
                    <div className="appointment-details" style={{ flex: 1 }}>
                      <strong>{appointment.tutor?.name}</strong>
                      <p>{appointment.subject?.name}</p>
                      <span className="location">📍 {appointment.location}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ 
                        fontSize: '1.2rem', 
                        fontWeight: 'bold',
                        color: '#333',
                        marginBottom: '0.5rem'
                      }}>
                        $25.00
                      </div>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '4px',
                        fontSize: '0.9rem',
                        backgroundColor: appointment.isPaid ? '#d4edda' : '#f8d7da',
                        color: appointment.isPaid ? '#155724' : '#721c24'
                      }}>
                        {appointment.isPaid ? 'Paid' : 'Unpaid'}
                      </span>
                    </div>
                    {!appointment.isPaid && (
                      <div style={{ marginLeft: '1rem' }}>
                        <button className="btn btn-primary btn-small">
                          Pay Now
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <button 
              className="btn btn-secondary"
              onClick={() => navigate('/student/dashboard')}
            >
              Back to Dashboard
            </button>
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

export default SessionHistory;
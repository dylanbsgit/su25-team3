// tutorlink-frontend/src/pages/TutorDashboard.jsx

import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import ApiService from "../services/ApiService";
import SetAvailability from "../components/SetAvailability";
import UpdateRates from "../components/UpdateRates";
import AddSubjects from "../components/AddSubjects";
import ViewAnalytics from "../components/ViewAnalytics";
import EditProfile from "../components/EditProfile";
import "../styles/TL_tutor.css";

const TutorDashboard = () => {
  const { user, role, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRequests: 0,
    averageRating: 0,
    monthlyEarnings: 0,
    completedSessions: 0
  });
  
  // Modal states
  const [showAvailability, setShowAvailability] = useState(false);
  const [showRates, setShowRates] = useState(false);
  const [showSubjects, setShowSubjects] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || role !== 'tutor') {
      navigate('/login');
      return;
    }

    fetchData();
  }, [user?.id, isAuthenticated, role, navigate]);

  const fetchData = async () => {
    try {
      const [appointmentsData, subjectsData, analyticsData] = await Promise.all([
        ApiService.getAllAppointments(),
        ApiService.getAllSubjects(),
        ApiService.getTutorAnalytics(user.id)
      ]);
      
      setSubjects(subjectsData || []);
      
      // Filter appointments for current tutor
      const tutorAppointments = (appointmentsData || []).filter(apt => apt.tutor?.id === user.id);
      setAppointments(tutorAppointments);
      
      // Update stats from analytics data
      setStats({
        totalRequests: analyticsData.totalSessions || 0,
        averageRating: user.rating || 0,
        monthlyEarnings: calculateMonthlyEarnings(tutorAppointments),
        completedSessions: analyticsData.completedSessions || 0
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateMonthlyEarnings = (appointments) => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyAppointments = appointments.filter(apt => {
      const aptDate = new Date(apt.dateTime);
      return apt.status === 'COMPLETED' && 
             aptDate.getMonth() === currentMonth && 
             aptDate.getFullYear() === currentYear;
    });
    
    return monthlyAppointments.length * 25;
  };

  const handleAppointmentAction = async (appointmentId, action) => {
    try {
      let newStatus;
      switch (action) {
        case 'accept':
          newStatus = 'ACCEPTED';
          break;
        case 'decline':
          newStatus = 'CANCELLED';
          break;
        case 'complete':
          newStatus = 'COMPLETED';
          break;
        case 'reschedule':
          // For reschedule, we'll keep it as ACCEPTED but you might want to add a flag
          alert('Please contact the student to arrange a new time.');
          return;
        default:
          return;
      }

      await ApiService.updateAppointmentStatus(appointmentId, newStatus);
      await fetchData();
      
      if (action === 'complete') {
        alert('Session marked as completed! The student can now leave a review.');
      } else {
        alert(`Appointment ${action}ed successfully!`);
      }
    } catch (error) {
      alert(`Failed to ${action} appointment: ` + error.message);
    }
  };

  if (loading) return <div>Loading Tutor Dashboard...</div>;

  const pendingRequests = appointments.filter(apt => apt.status === 'PENDING');
  const upcomingAppointments = appointments.filter(apt => apt.status === 'ACCEPTED');
  
  // Check if appointments need attention (past due or student requested reschedule)
  const needsAttention = (appointment) => {
    const aptDate = new Date(appointment.dateTime);
    const now = new Date();
    return aptDate < now && appointment.status === 'ACCEPTED';
  };

  return (
    <div>
      <header className="header">
        <nav className="nav">
          <div className="logo">TutorLink</div>
          <ul className="nav-links">
            <li><a href="/tutor">Tutor Dashboard</a></li>
            <li>
              <button 
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="btn btn-secondary"
              >
                Log out
              </button>
            </li>
          </ul>
        </nav>
      </header>

      <div className="container">
        <div className="page active">
          <div className="dashboard-header">
            <h1>Welcome, {user.name}!</h1>
            <p>{user.subject} Tutor • College Tutor</p>
            <button 
              className="btn btn-secondary"
              onClick={() => setShowEditProfile(true)}
            >
              Edit Profile
            </button>
          </div>

          <div className="tutor-stats">
            <div className="stat-card">
              <h3>{stats.totalRequests}</h3>
              <p>Total Requests</p>
            </div>
            <div className="stat-card">
              <h3>{stats.averageRating || 'N/A'}</h3>
              <p>Average Rating</p>
            </div>
            <div className="stat-card">
              <h3>${stats.monthlyEarnings}</h3>
              <p>This Month</p>
            </div>
            <div className="stat-card">
              <h3>{stats.completedSessions}</h3>
              <p>Completed Sessions</p>
            </div>
          </div>

          <div className="dashboard-content">
            <div className="dashboard-section">
              <h2>New Tutoring Requests</h2>
              <div className="request-list">
                {pendingRequests.length === 0 ? (
                  <p>No pending requests</p>
                ) : (
                  pendingRequests.map(appointment => (
                    <div 
                      className="request-item" 
                      key={appointment.apptID}
                      style={{
                        borderLeft: appointment.status === 'PENDING' && appointment.message?.includes('reschedule') 
                          ? '4px solid #ffc107' 
                          : 'none'
                      }}
                    >
                      <div className="request-info">
                        <strong>{appointment.student?.name}</strong>
                        <span>{appointment.student?.major || 'Student'}</span>
                        <p>Needs help with {appointment.subject?.name}</p>
                        <small>Requested for {new Date(appointment.dateTime).toLocaleDateString()}</small>
                        {appointment.message?.includes('reschedule') && (
                          <small style={{ color: '#ffc107', fontWeight: 'bold' }}>
                            ⚠️ Student requested reschedule
                          </small>
                        )}
                      </div>
                      <div className="request-actions">
                        <button 
                          className="btn btn-primary btn-small"
                          onClick={() => handleAppointmentAction(appointment.apptID, 'accept')}
                        >
                          Accept
                        </button>
                        <button 
                          className="btn btn-secondary btn-small"
                          onClick={() => handleAppointmentAction(appointment.apptID, 'decline')}
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="dashboard-section">
              <h2>Upcoming Appointments</h2>
              <div className="appointment-list">
                {upcomingAppointments.length === 0 ? (
                  <p>No upcoming sessions</p>
                ) : (
                  upcomingAppointments.map(appointment => (
                    <div 
                      className="appointment-item" 
                      key={appointment.apptID}
                      style={{
                        borderLeft: needsAttention(appointment) ? '4px solid #dc3545' : 'none',
                        backgroundColor: needsAttention(appointment) ? '#fff5f5' : 'white'
                      }}
                    >
                      <div className="appointment-time">
                        <div className="date">{new Date(appointment.dateTime).toLocaleDateString()}</div>
                        <div className="time">{new Date(appointment.dateTime).toLocaleTimeString()}</div>
                        {needsAttention(appointment) && (
                          <small style={{ color: '#dc3545', fontWeight: 'bold' }}>Past Due!</small>
                        )}
                      </div>
                      <div className="appointment-details">
                        <strong>{appointment.student?.name}</strong>
                        <p>{appointment.subject?.name}</p>
                        <span className="location">📍 {appointment.location}</span>
                      </div>
                      <div className="appointment-actions">
                        <button 
                          className="btn btn-small btn-primary"
                          onClick={() => handleAppointmentAction(appointment.apptID, 'complete')}
                        >
                          Mark Complete
                        </button>
                        <button 
                          className="btn btn-small btn-secondary"
                          onClick={() => handleAppointmentAction(appointment.apptID, 'reschedule')}
                        >
                          Reschedule
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="dashboard-section">
              <h2>Quick Actions</h2>
              <div className="quick-actions">
                <button 
                  className="action-card"
                  onClick={() => setShowAvailability(true)}
                >
                  <div className="action-icon">📅</div>
                  <h4>Set Availability</h4>
                  <p>Update your available hours</p>
                </button>
                <button 
                  className="action-card"
                  onClick={() => setShowRates(true)}
                >
                  <div className="action-icon">💰</div>
                  <h4>Update Rates</h4>
                  <p>Change your hourly pricing</p>
                </button>
                <button 
                  className="action-card"
                  onClick={() => setShowSubjects(true)}
                >
                  <div className="action-icon">📚</div>
                  <h4>Add Subjects</h4>
                  <p>Expand your tutoring areas</p>
                </button>
                <button 
                  className="action-card"
                  onClick={() => setShowAnalytics(true)}
                >
                  <div className="action-icon">📊</div>
                  <h4>View Analytics</h4>
                  <p>See detailed performance stats</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showAvailability && (
        <SetAvailability 
          onClose={() => setShowAvailability(false)} 
          onUpdate={fetchData} 
        />
      )}
      {showRates && (
        <UpdateRates 
          onClose={() => setShowRates(false)} 
          onUpdate={fetchData} 
        />
      )}
      {showSubjects && (
        <AddSubjects 
          onClose={() => setShowSubjects(false)} 
          onUpdate={fetchData} 
        />
      )}
      {showAnalytics && (
        <ViewAnalytics 
          onClose={() => setShowAnalytics(false)} 
        />
      )}
      {showEditProfile && (
        <EditProfile
          onClose={() => setShowEditProfile(false)}
          onUpdate={fetchData}
        />
      )}

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

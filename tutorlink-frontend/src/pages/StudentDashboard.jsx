// tutorlink-frontend/src/pages/StudentDashboard.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import ApiService from "../services/ApiService";
import BookingModal from "../components/BookingModal";
import EditProfile from "../components/EditProfile";
import "../styles/TL_student_dash.css";

function StudentDashboard() {
  const { user, role, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [tutors, setTutors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [pendingReschedules, setPendingReschedules] = useState(new Set());
  const [showEditProfile, setShowEditProfile] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || role !== 'student') {
      navigate('/login');
      return;
    }

    fetchData();
  }, [user?.id, isAuthenticated, role, navigate]);

  const fetchData = async () => {
    try {
      const [tutorsData, appointmentsData, subjectsData] = await Promise.all([
        ApiService.getAllTutors(),
        ApiService.getAllAppointments(),
        ApiService.getAllSubjects(),
      ]);
      
      setTutors(tutorsData || []);
      setSubjects(subjectsData || []);
      // Filter appointments for current student
      setAppointments((appointmentsData || []).filter(apt => apt.student?.id === user.id));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookClick = (tutor) => {
    setSelectedTutor(tutor);
    setShowBookingModal(true);
  };

  const handleBookAppointment = async (tutorId, subjectId, dateTime, location) => {
    try {
      await ApiService.createAppointment(
        user.id,
        tutorId,
        subjectId,
        dateTime,
        location
      );
      
      await fetchData();
      alert('Appointment requested successfully!');
    } catch (error) {
      alert('Failed to book appointment: ' + error.message);
    }
  };

  const handleAppointmentAction = async (appointmentId, action, appointment = null) => {
    try {
      if (action === 'cancel') {
        if (window.confirm('Are you sure you want to cancel this appointment?')) {
          await ApiService.updateAppointmentStatus(appointmentId, 'CANCELLED');
          alert('Appointment cancelled. The tutor has been notified.');
          await fetchData();
        }
      } else if (action === 'reschedule') {
        setSelectedAppointment(appointment);
        setShowRescheduleModal(true);
      }
    } catch (error) {
      alert(`Failed to ${action} appointment: ` + error.message);
    }
  };

  const handleRescheduleSubmit = async (newDateTime) => {
    try {
      // In a real app, you'd send the new datetime to the backend
      // For now, we'll mark it as pending and store locally
      await ApiService.updateAppointmentStatus(selectedAppointment.apptID, 'PENDING');
      setPendingReschedules(prev => new Set(prev).add(selectedAppointment.apptID));
      
      setShowRescheduleModal(false);
      setSelectedAppointment(null);
      alert('Reschedule request sent to tutor. You will be notified once they confirm the new time.');
      await fetchData();
    } catch (error) {
      alert('Failed to send reschedule request: ' + error.message);
    }
  };

  if (loading) return <div>Loading Student Dashboard...</div>;

  // Get unique tutors from past completed sessions
  const pastTutors = [...new Map(
    appointments
      .filter(apt => apt.status === 'COMPLETED')
      .map(apt => [apt.tutor.id, apt.tutor])
  ).values()];

  return (
    <div>
      <header className="header">
        <nav className="nav">
          <div className="logo">TutorLink</div>
          <ul className="nav-links">
            <li><Link to="/student/search">Find New Tutor</Link></li>
            <li>
              <span style={{ color: 'white' }}>
                {user?.name || 'Student'}
              </span>
            </li>
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
            <h1>Welcome back, {user.name}!</h1>
            <p>Major: {user.major} • Student</p>
            <button 
              className="btn btn-secondary"
              onClick={() => setShowEditProfile(true)}
            >
              Edit Profile
            </button>
          </div>

          {/* Stats */}
          <div className="tutor-stats">
            <div className="stat-card">
              <h3>{appointments.length}</h3>
              <p>Total Appointments</p>
            </div>
            <div className="stat-card">
              <h3>{appointments.filter(apt => apt.status === 'COMPLETED').length}</h3>
              <p>Completed Sessions</p>
            </div>
            <div className="stat-card">
              <h3>{tutors.length}</h3>
              <p>Available Tutors</p>
            </div>
          </div>

          <div className="dashboard-content">
            {/* Upcoming Appointments */}
            <div className="dashboard-section">
              <h2>Upcoming Tutoring Sessions</h2>
              <div className="appointment-list">
                {appointments.filter(apt => apt.status === 'ACCEPTED' || apt.status === 'PENDING').length === 0 ? (
                  <p>No upcoming appointments</p>
                ) : (
                  appointments
                    .filter(apt => apt.status === 'ACCEPTED' || apt.status === 'PENDING')
                    .map(appointment => (
                      <div 
                        key={appointment.apptID} 
                        className="appointment-item"
                        style={{
                          borderLeft: pendingReschedules.has(appointment.apptID) ? '4px solid #ffc107' : 'none',
                          backgroundColor: pendingReschedules.has(appointment.apptID) ? '#fffbf0' : 'white'
                        }}
                      >
                        <div className="appointment-time">
                          <div className="date">{new Date(appointment.dateTime).toLocaleDateString()}</div>
                          <div className="time">{new Date(appointment.dateTime).toLocaleTimeString()}</div>
                          {pendingReschedules.has(appointment.apptID) && (
                            <small style={{ color: '#ffc107', fontWeight: 'bold' }}>
                              Reschedule Pending
                            </small>
                          )}
                        </div>
                        <div className="appointment-details">
                          <strong>{appointment.tutor?.name} - {appointment.subject?.name}</strong>
                          <p>{appointment.subject?.name}</p>
                          <span className="location">📍 {appointment.location}</span>
                          {pendingReschedules.has(appointment.apptID) && (
                            <p style={{ color: '#856404', fontSize: '0.9rem', marginTop: '5px' }}>
                              ⏳ Waiting for tutor to confirm new time
                            </p>
                          )}
                        </div>
                        <div className="appointment-actions">
                          <button 
                            className="btn btn-small btn-primary"
                            onClick={() => handleAppointmentAction(appointment.apptID, 'reschedule', appointment)}
                            disabled={pendingReschedules.has(appointment.apptID)}
                          >
                            Reschedule
                          </button>
                          <button 
                            className="btn btn-small btn-secondary"
                            onClick={() => handleAppointmentAction(appointment.apptID, 'cancel')}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>

            {/* My Tutors - Only shows tutors from past sessions */}
            <div className="dashboard-section">
              <h2>My Tutors</h2>
              {pastTutors.length === 0 ? (
                <p>
                  You haven't completed any sessions yet. 
                  <Link to="/student/search" style={{ marginLeft: '5px', color: '#4a90e2' }}>
                    Find your first tutor!
                  </Link>
                </p>
              ) : (
                <div className="tutors-grid">
                  {pastTutors.map(tutor => (
                    <div key={tutor.id} className="tutor-card">
                      <div className="tutor-avatar">{tutor.name?.charAt(0)}</div>
                      <h3>{tutor.name}</h3>
                      <div className="tutor-subject">{tutor.subject}</div>
                      <div className="tutor-info">
                        <span>⭐ {tutor.rating || 'New'}/5</span>
                        <span className="price">$25/hour</span>
                      </div>
                      <div className="tutor-details">
                        <p>Email: {tutor.email}</p>
                        <p>Sessions completed: {
                          appointments.filter(apt => 
                            apt.tutor.id === tutor.id && 
                            apt.status === 'COMPLETED'
                          ).length
                        }</p>
                      </div>
                      <button
                        onClick={() => handleBookClick(tutor)}
                        className="btn btn-primary full-width"
                        style={{ marginBottom: '8px' }}
                      >
                        Book Again
                      </button>
                      <button
                        onClick={() => alert('Review feature coming soon!')}
                        className="btn btn-secondary full-width"
                      >
                        Leave Review
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="dashboard-section">
              <h2>Quick Actions</h2>
              <div className="quick-actions">
                <div 
                  className="action-card"
                  onClick={() => navigate('/student/search')}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="action-icon">🔍</div>
                  <h4>Find a Tutor</h4>
                  <p>Browse available tutors</p>
                </div>
                <div 
                  className="action-card"
                  onClick={() => navigate('/student/schedule')}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="action-icon">📅</div>
                  <h4>Schedule Session</h4>
                  <p>Book with your past tutors</p>
                </div>
                <div 
                  className="action-card"
                  onClick={() => navigate('/student/history')}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="action-icon">📋</div>
                  <h4>History</h4>
                  <p>View past sessions & payments</p>
                </div>
                <div className="action-card" style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                  <div className="action-icon">⭐</div>
                  <h4>Rate & Review</h4>
                  <p>Coming soon</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showBookingModal && selectedTutor && (
        <BookingModal
          tutor={selectedTutor}
          subjects={subjects}
          onClose={() => setShowBookingModal(false)}
          onBook={handleBookAppointment}
        />
      )}

      {showRescheduleModal && selectedAppointment && (
        <RescheduleModal
          appointment={selectedAppointment}
          onClose={() => {
            setShowRescheduleModal(false);
            setSelectedAppointment(null);
          }}
          onSubmit={handleRescheduleSubmit}
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
}

// RescheduleModal component (inline since it's specific to this dashboard)
const RescheduleModal = ({ appointment, onClose, onSubmit }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const newDateTime = `${selectedDate}T${selectedTime}:00`;
      await onSubmit(newDateTime, reason);
    } catch (error) {
      alert('Failed to submit reschedule request');
    } finally {
      setLoading(false);
    }
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour < 18; hour++) {
      const time = `${hour.toString().padStart(2, '0')}:00`;
      slots.push(time);
    }
    return slots;
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        width: '90%',
        maxWidth: '500px',
        maxHeight: '80vh',
        overflow: 'auto'
      }}>
        <h2 style={{ marginBottom: '1.5rem' }}>Request Reschedule</h2>
        
        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '1.5rem'
        }}>
          <h4 style={{ margin: 0, marginBottom: '0.5rem' }}>Current Appointment</h4>
          <p style={{ margin: '0.25rem 0' }}>
            <strong>Tutor:</strong> {appointment.tutor?.name}
          </p>
          <p style={{ margin: '0.25rem 0' }}>
            <strong>Subject:</strong> {appointment.subject?.name}
          </p>
          <p style={{ margin: '0.25rem 0' }}>
            <strong>Date:</strong> {new Date(appointment.dateTime).toLocaleDateString()}
          </p>
          <p style={{ margin: '0.25rem 0' }}>
            <strong>Time:</strong> {new Date(appointment.dateTime).toLocaleTimeString()}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Select New Date:
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={minDate}
              required
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Select New Time:
            </label>
            <select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem'
              }}
            >
              <option value="">Choose a time...</option>
              {generateTimeSlots().map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Reason for Rescheduling (optional):
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Let your tutor know why you need to reschedule..."
              rows={3}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem',
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{ 
            backgroundColor: '#fff3cd',
            border: '1px solid #ffeaa7',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1.5rem'
          }}>
            <p style={{ margin: 0, color: '#856404' }}>
              <strong>Note:</strong> Your tutor will need to confirm the new date and time. 
              You'll receive a notification once they respond.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 20px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                backgroundColor: '#f8f9fa',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !selectedDate || !selectedTime}
              style={{
                padding: '10px 20px',
                border: 'none',
                borderRadius: '4px',
                backgroundColor: '#4a90e2',
                color: 'white',
                cursor: (loading || !selectedDate || !selectedTime) ? 'not-allowed' : 'pointer',
                opacity: (loading || !selectedDate || !selectedTime) ? 0.7 : 1
              }}
            >
              {loading ? 'Sending...' : 'Send Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentDashboard;
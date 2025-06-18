// tutorlink-frontend/src/pages/TutorSearch.jsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import ApiService from '../services/ApiService';
import BookingModal from '../components/BookingModal';
import '../styles/TL_student.css';

const TutorSearch = () => {
  const { user, role, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [tutors, setTutors] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState(null);

  useEffect(() => {
    if (!isAuthenticated || role !== 'student') {
      navigate('/login');
      return;
    }

    fetchData();
  }, [isAuthenticated, role, navigate]);

  const fetchData = async () => {
    try {
      const [tutorsData, subjectsData] = await Promise.all([
        ApiService.getAllTutors(),
        ApiService.getAllSubjects()
      ]);
      setTutors(tutorsData || []);
      setSubjects(subjectsData || []);
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
      alert('Appointment requested successfully!');
    } catch (error) {
      alert('Failed to book appointment: ' + error.message);
    }
  };

  // Fixed filter logic with null checks
  const filteredTutors = tutors.filter(tutor => {
    // Ensure tutor object exists and has required properties
    if (!tutor) return false;
    
    // Get tutor name and subject with fallbacks
    const tutorName = tutor.name || '';
    const tutorSubject = tutor.subject || '';
    const searchTermLower = searchTerm.toLowerCase();
    
    // Check if search term matches name or subject
    const matchesSearch = searchTermLower === '' || 
                         tutorName.toLowerCase().includes(searchTermLower) ||
                         tutorSubject.toLowerCase().includes(searchTermLower);
    
    // Check if selected subject matches
    const matchesSubject = !selectedSubject || 
                          selectedSubject === '' || 
                          tutorSubject.toLowerCase().includes(selectedSubject.toLowerCase());
    
    return matchesSearch && matchesSubject;
  });

  if (loading) return <div>Loading tutors...</div>;

  return (
    <div>
      <header className="header">
        <nav className="nav">
          <div className="logo">TutorLink</div>
          <ul className="nav-links">
            <li><Link to="/student/search">Find New Tutor</Link></li>
            <li><Link to="/student/dashboard">Student Dashboard</Link></li>
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
            <h1>Find Your Perfect Tutor</h1>
            <p>Browse {tutors.length} available tutors</p>
          </div>

          {/* Search and Filter Section */}
          <div className="search-section" style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <input
                type="text"
                placeholder="Search by name or subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  flex: '1',
                  minWidth: '250px',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem'
                }}
              />
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                style={{
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem'
                }}
              >
                <option value="">All Subjects</option>
                {subjects.map(subject => (
                  <option key={subject.subjectID} value={subject.name}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Count */}
          <p style={{ marginBottom: '1rem', color: '#666' }}>
            Showing {filteredTutors.length} tutors
          </p>

          {/* Tutors Grid */}
          <div className="tutors-grid">
            {filteredTutors.length === 0 ? (
              <p>No tutors found matching your criteria.</p>
            ) : (
              filteredTutors.map(tutor => (
                <div key={tutor.id} className="tutor-card">
                  <div className="tutor-avatar">
                    {tutor.name ? tutor.name.charAt(0).toUpperCase() : '?'}
                  </div>
                  <h3>{tutor.name || 'Unknown Tutor'}</h3>
                  <div className="tutor-subject">{tutor.subject || 'No subject specified'}</div>
                  <div className="tutor-info">
                    <span>⭐ {tutor.rating || 'New'}/5</span>
                    <span className="price">${tutor.hourlyRate || 25}/hour</span>
                  </div>
                  <div className="tutor-details">
                    <p>Email: {tutor.email || 'No email provided'}</p>
                    <p>Availability: {tutor.availability || 'Check with tutor'}</p>
                  </div>
                  <button
                    onClick={() => handleBookClick(tutor)}
                    className="btn btn-primary full-width"
                  >
                    Book Session
                  </button>
                </div>
              ))
            )}
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

export default TutorSearch;
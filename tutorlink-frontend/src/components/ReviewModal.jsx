// tutorlink-frontend/src/components/ReviewModal.jsx
import React, { useState } from 'react';
import ApiService from '../services/ApiService';

const ReviewModal = ({ tutor, student, appointment, onClose, onSubmit }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const reviewData = {
        studentId: student.id,
        tutorId: tutor.id,
        appointmentId: appointment.apptID,
        rating,
        comment
      };

      await ApiService.createReview(reviewData);
      onSubmit();
      alert('Review submitted successfully!');
      onClose();
    } catch (error) {
      alert('Failed to submit review: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const StarRating = () => {
    return (
      <div style={{ display: 'flex', gap: '5px', fontSize: '2rem' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            style={{
              cursor: 'pointer',
              color: (hoveredRating || rating) >= star ? '#ffc107' : '#e4e5e9',
              transition: 'color 0.2s'
            }}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
          >
            ★
          </span>
        ))}
      </div>
    );
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
        <h2 style={{ marginBottom: '1.5rem' }}>Review Your Session</h2>
        
        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '1.5rem'
        }}>
          <h4 style={{ margin: 0, marginBottom: '0.5rem' }}>Session Details</h4>
          <p style={{ margin: '0.25rem 0' }}>
            <strong>Tutor:</strong> {tutor.name}
          </p>
          <p style={{ margin: '0.25rem 0' }}>
            <strong>Subject:</strong> {appointment.subject?.name || tutor.subject}
          </p>
          <p style={{ margin: '0.25rem 0' }}>
            <strong>Date:</strong> {new Date(appointment.dateTime).toLocaleDateString()}
          </p>
          <p style={{ margin: '0.25rem 0' }}>
            <strong>Time:</strong> {new Date(appointment.dateTime).toLocaleTimeString()}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Rating:
            </label>
            <StarRating />
            <p style={{ marginTop: '0.5rem', color: '#666', fontSize: '0.9rem' }}>
              {rating === 5 && "Excellent! 🌟"}
              {rating === 4 && "Very Good 👍"}
              {rating === 3 && "Good 👌"}
              {rating === 2 && "Fair 😐"}
              {rating === 1 && "Poor 👎"}
            </p>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Your Review:
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this tutor..."
              rows={5}
              required
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem',
                resize: 'vertical'
              }}
            />
            <p style={{ marginTop: '0.5rem', color: '#666', fontSize: '0.85rem' }}>
              Minimum 20 characters ({comment.length}/20)
            </p>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ marginBottom: '0.5rem' }}>Review Guidelines:</h4>
            <ul style={{ color: '#666', fontSize: '0.9rem', paddingLeft: '1.5rem' }}>
              <li>Be specific about what you learned</li>
              <li>Mention the tutor's teaching style</li>
              <li>Share how they helped you improve</li>
              <li>Be respectful and constructive</li>
            </ul>
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
              disabled={loading || comment.length < 20}
              style={{
                padding: '10px 20px',
                border: 'none',
                borderRadius: '4px',
                backgroundColor: '#4a90e2',
                color: 'white',
                cursor: (loading || comment.length < 20) ? 'not-allowed' : 'pointer',
                opacity: (loading || comment.length < 20) ? 0.7 : 1
              }}
            >
              {loading ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;

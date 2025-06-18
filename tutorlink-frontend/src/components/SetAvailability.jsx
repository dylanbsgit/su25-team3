// tutorlink-frontend/src/components/SetAvailability.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ApiService from '../services/ApiService';

const SetAvailability = ({ onClose, onUpdate }) => {
  const { user } = useAuth();
  const [selectedSlots, setSelectedSlots] = useState(
    user.availability ? user.availability.split(', ') : []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const timeSlots = [
    // Monday
    'Monday 9:00 AM - 10:00 AM',
    'Monday 10:00 AM - 11:00 AM',
    'Monday 11:00 AM - 12:00 PM',
    'Monday 12:00 PM - 1:00 PM',
    'Monday 1:00 PM - 2:00 PM',
    'Monday 2:00 PM - 3:00 PM',
    'Monday 3:00 PM - 4:00 PM',
    'Monday 4:00 PM - 5:00 PM',
    // Tuesday
    'Tuesday 9:00 AM - 10:00 AM',
    'Tuesday 10:00 AM - 11:00 AM',
    'Tuesday 11:00 AM - 12:00 PM',
    'Tuesday 12:00 PM - 1:00 PM',
    'Tuesday 1:00 PM - 2:00 PM',
    'Tuesday 2:00 PM - 3:00 PM',
    'Tuesday 3:00 PM - 4:00 PM',
    'Tuesday 4:00 PM - 5:00 PM',
    // Wednesday
    'Wednesday 9:00 AM - 10:00 AM',
    'Wednesday 10:00 AM - 11:00 AM',
    'Wednesday 11:00 AM - 12:00 PM',
    'Wednesday 12:00 PM - 1:00 PM',
    'Wednesday 1:00 PM - 2:00 PM',
    'Wednesday 2:00 PM - 3:00 PM',
    'Wednesday 3:00 PM - 4:00 PM',
    'Wednesday 4:00 PM - 5:00 PM',
    // Thursday
    'Thursday 9:00 AM - 10:00 AM',
    'Thursday 10:00 AM - 11:00 AM',
    'Thursday 11:00 AM - 12:00 PM',
    'Thursday 12:00 PM - 1:00 PM',
    'Thursday 1:00 PM - 2:00 PM',
    'Thursday 2:00 PM - 3:00 PM',
    'Thursday 3:00 PM - 4:00 PM',
    'Thursday 4:00 PM - 5:00 PM',
    // Friday
    'Friday 9:00 AM - 10:00 AM',
    'Friday 10:00 AM - 11:00 AM',
    'Friday 11:00 AM - 12:00 PM',
    'Friday 12:00 PM - 1:00 PM',
    'Friday 1:00 PM - 2:00 PM',
    'Friday 2:00 PM - 3:00 PM',
    'Friday 3:00 PM - 4:00 PM',
    'Friday 4:00 PM - 5:00 PM',
    // Saturday
    'Saturday 9:00 AM - 10:00 AM',
    'Saturday 10:00 AM - 11:00 AM',
    'Saturday 11:00 AM - 12:00 PM',
    'Saturday 12:00 PM - 1:00 PM',
    'Saturday 1:00 PM - 2:00 PM',
    'Saturday 2:00 PM - 3:00 PM',
    'Saturday 3:00 PM - 4:00 PM',
    'Saturday 4:00 PM - 5:00 PM'
  ];

  const handleSlotToggle = (slot) => {
    setSelectedSlots(prev => {
      if (prev.includes(slot)) {
        return prev.filter(s => s !== slot);
      } else {
        return [...prev, slot];
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedSlots.length === 0) {
      setError('Please select at least one time slot');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Join selected slots with comma and space
      const availabilityString = selectedSlots.join(', ');
      await ApiService.updateTutorAvailability(user.id, availabilityString);
      
      // Update the user object in local storage
      const updatedUser = { ...user, availability: availabilityString };
      localStorage.setItem('tutorlink_user', JSON.stringify(updatedUser));
      
      onUpdate();
      onClose();
      alert('Availability updated successfully!');
    } catch (error) {
      setError('Failed to update availability: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Group slots by day
  const slotsByDay = timeSlots.reduce((acc, slot) => {
    const day = slot.split(' ')[0];
    if (!acc[day]) acc[day] = [];
    acc[day].push(slot);
    return acc;
  }, {});

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
        maxWidth: '600px',
        maxHeight: '80vh',
        overflow: 'auto'
      }}>
        <h2 style={{ marginBottom: '1rem' }}>Set Your Availability</h2>
        
        {error && (
          <div style={{ 
            backgroundColor: '#fee', 
            border: '1px solid #fcc', 
            color: '#c33', 
            padding: '10px', 
            borderRadius: '4px', 
            marginBottom: '15px' 
          }}>
            {error}
          </div>
        )}

        <p style={{ marginBottom: '1rem', color: '#666' }}>
          Select all time slots when you're available for tutoring. 
          You can select multiple slots.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            {Object.entries(slotsByDay).map(([day, slots]) => (
              <div key={day} style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ 
                  marginBottom: '0.75rem', 
                  color: '#333',
                  borderBottom: '1px solid #eee',
                  paddingBottom: '0.5rem'
                }}>
                  {day}
                </h4>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '0.5rem'
                }}>
                  {slots.map((slot) => (
                    <label
                      key={slot}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0.5rem',
                        backgroundColor: selectedSlots.includes(slot) ? '#e7f3ff' : '#f8f9fa',
                        border: `2px solid ${selectedSlots.includes(slot) ? '#4a90e2' : '#e9ecef'}`,
                        borderRadius: '4px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedSlots.includes(slot)}
                        onChange={() => handleSlotToggle(slot)}
                        style={{ marginRight: '0.5rem' }}
                      />
                      <span style={{ fontSize: '0.9rem' }}>
                        {slot.replace(day + ' ', '')}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{ 
            backgroundColor: '#f0f7ff',
            padding: '1rem',
            borderRadius: '4px',
            marginBottom: '1.5rem'
          }}>
            <strong>Selected Time Slots: </strong>
            {selectedSlots.length === 0 ? (
              <span style={{ color: '#999' }}>None selected</span>
            ) : (
              <span>{selectedSlots.length} slot(s) selected</span>
            )}
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
              disabled={loading || selectedSlots.length === 0}
              style={{
                padding: '10px 20px',
                border: 'none',
                borderRadius: '4px',
                backgroundColor: '#4a90e2',
                color: 'white',
                cursor: (loading || selectedSlots.length === 0) ? 'not-allowed' : 'pointer',
                opacity: (loading || selectedSlots.length === 0) ? 0.7 : 1
              }}
            >
              {loading ? 'Updating...' : 'Update Availability'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SetAvailability;

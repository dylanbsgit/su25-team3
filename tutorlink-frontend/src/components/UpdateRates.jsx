// tutorlink-frontend/src/components/UpdateRates.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ApiService from '../services/ApiService';

const UpdateRates = ({ onClose, onUpdate }) => {
  const { user } = useAuth();
  const [rate, setRate] = useState('25');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await ApiService.updateTutorRates(user.id, rate);
      onUpdate();
      onClose();
      alert('Rate updated successfully!');
    } catch (error) {
      setError('Failed to update rate: ' + error.message);
    } finally {
      setLoading(false);
    }
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
        maxWidth: '400px'
      }}>
        <h2 style={{ marginBottom: '1rem' }}>Update Your Hourly Rate</h2>
        
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

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Hourly Rate ($):
            </label>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '8px', fontSize: '1.2rem' }}>$</span>
              <input
                type="number"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                min="10"
                max="100"
                step="5"
                style={{ 
                  flex: 1,
                  padding: '8px', 
                  border: '1px solid #ddd', 
                  borderRadius: '4px',
                  fontSize: '1rem'
                }}
                required
              />
              <span style={{ marginLeft: '8px', color: '#666' }}>/hour</span>
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <div style={{ 
              backgroundColor: '#f8f9fa', 
              padding: '1rem', 
              borderRadius: '4px',
              border: '1px solid #e9ecef'
            }}>
              <h4 style={{ margin: 0, marginBottom: '0.5rem' }}>Rate Guidelines:</h4>
              <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
                <li>Undergraduate: $15-25/hour</li>
                <li>Graduate Student: $25-35/hour</li>
                <li>Advanced/Specialized: $35-50/hour</li>
              </ul>
            </div>
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
              disabled={loading}
              style={{
                padding: '10px 20px',
                border: 'none',
                borderRadius: '4px',
                backgroundColor: '#4a90e2',
                color: 'white',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'Updating...' : 'Update Rate'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateRates;

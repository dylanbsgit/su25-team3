// tutorlink-frontend/src/components/ViewAnalytics.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import ApiService from '../services/ApiService';

const ViewAnalytics = ({ onClose }) => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await ApiService.getTutorAnalytics(user.id);
        setAnalytics(data);
      } catch (error) {
        setError('Failed to load analytics: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [user.id]);

  if (loading) {
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
          textAlign: 'center'
        }}>
          Loading analytics...
        </div>
      </div>
    );
  }

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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0 }}>Your Performance Analytics</h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: '#999'
            }}
          >
            ×
          </button>
        </div>

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

        {analytics && (
          <div>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(2, 1fr)', 
              gap: '1rem', 
              marginBottom: '2rem' 
            }}>
              <div style={{ 
                backgroundColor: '#4a90e2', 
                color: 'white', 
                padding: '1.5rem', 
                borderRadius: '8px', 
                textAlign: 'center' 
              }}>
                <h3 style={{ fontSize: '2rem', margin: 0 }}>{analytics.totalSessions}</h3>
                <p style={{ margin: 0 }}>Total Sessions</p>
              </div>
              <div style={{ 
                backgroundColor: '#28a745', 
                color: 'white', 
                padding: '1.5rem', 
                borderRadius: '8px', 
                textAlign: 'center' 
              }}>
                <h3 style={{ fontSize: '2rem', margin: 0 }}>{analytics.completedSessions}</h3>
                <p style={{ margin: 0 }}>Completed</p>
              </div>
              <div style={{ 
                backgroundColor: '#ffc107', 
                color: 'white', 
                padding: '1.5rem', 
                borderRadius: '8px', 
                textAlign: 'center' 
              }}>
                <h3 style={{ fontSize: '2rem', margin: 0 }}>{analytics.pendingSessions}</h3>
                <p style={{ margin: 0 }}>Pending</p>
              </div>
              <div style={{ 
                backgroundColor: '#dc3545', 
                color: 'white', 
                padding: '1.5rem', 
                borderRadius: '8px', 
                textAlign: 'center' 
              }}>
                <h3 style={{ fontSize: '2rem', margin: 0 }}>{analytics.cancelledSessions}</h3>
                <p style={{ margin: 0 }}>Cancelled</p>
              </div>
            </div>

            <div style={{ 
              backgroundColor: '#f8f9fa', 
              padding: '1.5rem', 
              borderRadius: '8px',
              border: '1px solid #e9ecef'
            }}>
              <h4 style={{ margin: 0, marginBottom: '1rem' }}>Performance Summary</h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Success Rate:</span>
                <strong>
                  {analytics.totalSessions > 0 
                    ? Math.round((analytics.completedSessions / analytics.totalSessions) * 100) 
                    : 0}%
                </strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Subject:</span>
                <strong>{user.subject}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Current Rating:</span>
                <strong>{user.rating || 'Not rated yet'}</strong>
              </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
              <button
                onClick={onClose}
                style={{
                  padding: '10px 30px',
                  border: 'none',
                  borderRadius: '4px',
                  backgroundColor: '#4a90e2',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewAnalytics;
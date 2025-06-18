// tutorlink-frontend/src/components/PayPalPaymentModal.jsx
import React, { useEffect, useRef, useState } from 'react';

const PayPalPaymentModal = ({ appointment, onClose, onSuccess }) => {
  const paypalRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Calculate amount - use hourly rate or default to $25
  const amount = appointment.tutor?.hourlyRate || 25;
  
  useEffect(() => {
    // Load PayPal script dynamically
    const loadPayPalScript = () => {
      if (window.paypal) {
        renderPayPalButtons();
        return;
      }

      const script = document.createElement('script');
      // Use sandbox for testing - replace with production client ID when ready
      script.src = "https://www.paypal.com/sdk/js?client-id=AYidhGMELvFvCW4NS8p9cHaJ_Hw0dHzWq7ldXMc1GmNZw_2nXfeim3Q7VNmh2XmM3PNCLfFX8YMfK0JG&currency=USD";
      script.addEventListener('load', renderPayPalButtons);
      script.addEventListener('error', () => {
        setError('Failed to load PayPal. Please try again.');
        setLoading(false);
      });
      document.body.appendChild(script);
    };

    const renderPayPalButtons = () => {
      setLoading(false);
      
      window.paypal.Buttons({
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [{
              description: `Tutoring Session - ${appointment.subject?.name} with ${appointment.tutor?.name}`,
              amount: {
                currency_code: "USD",
                value: amount.toFixed(2)
              },
              custom_id: appointment.apptID // Track appointment ID
            }]
          });
        },
        onApprove: async (data, actions) => {
          try {
            const order = await actions.order.capture();
            console.log('Payment successful:', order);
            
            // Call success handler with payment details
            onSuccess({
              appointmentId: appointment.apptID,
              paymentId: order.id,
              amount: amount,
              payerEmail: order.payer.email_address,
              status: order.status
            });
            
          } catch (err) {
            setError('Payment processing failed. Please try again.');
            console.error('PayPal error:', err);
          }
        },
        onError: (err) => {
          setError('Payment failed. Please try again.');
          console.error('PayPal error:', err);
        },
        onCancel: () => {
          console.log('Payment cancelled by user');
        }
      }).render(paypalRef.current);
    };

    loadPayPalScript();

    // Cleanup
    return () => {
      // Remove PayPal script if needed
    };
  }, [amount, appointment, onSuccess]);

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
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '1.5rem'
        }}>
          <h2 style={{ margin: 0 }}>Complete Payment</h2>
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

        {/* Payment Details */}
        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '1.5rem'
        }}>
          <h4 style={{ margin: 0, marginBottom: '0.5rem' }}>Session Details</h4>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
            <span>Tutor:</span>
            <strong>{appointment.tutor?.name}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
            <span>Subject:</span>
            <strong>{appointment.subject?.name}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
            <span>Date:</span>
            <strong>{new Date(appointment.dateTime).toLocaleDateString()}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
            <span>Duration:</span>
            <strong>1 hour</strong>
          </div>
          <hr style={{ margin: '0.5rem 0', border: 'none', borderTop: '1px solid #dee2e6' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem' }}>
            <strong>Total Amount:</strong>
            <strong style={{ color: '#28a745' }}>${amount.toFixed(2)}</strong>
          </div>
        </div>

        {/* Payment Instructions */}
        <div style={{
          backgroundColor: '#e7f3ff',
          border: '1px solid #b3d7ff',
          borderRadius: '8px',
          padding: '1rem',
          marginBottom: '1.5rem'
        }}>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            <strong>Secure Payment:</strong> Your payment information is processed securely through PayPal. 
            You can pay with your PayPal account or credit/debit card.
          </p>
        </div>

        {/* Error Message */}
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

        {/* PayPal Button Container */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>Loading PayPal...</p>
          </div>
        ) : (
          <div ref={paypalRef} style={{ minHeight: '150px' }}></div>
        )}

        {/* Alternative Payment Note */}
        <div style={{ 
          textAlign: 'center', 
          marginTop: '1rem',
          paddingTop: '1rem',
          borderTop: '1px solid #e9ecef'
        }}>
          <p style={{ color: '#666', fontSize: '0.9rem', margin: 0 }}>
            Having issues? Contact support at support@tutorlink.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default PayPalPaymentModal;
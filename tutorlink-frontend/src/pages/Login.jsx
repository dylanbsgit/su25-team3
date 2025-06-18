// src/pages/Login.jsx
// ==================================================

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Login.css";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [selectedRole, setSelectedRole] = useState('student');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, register } = useAuth();
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    major: '',
    subject: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await login(formData.email, formData.password, selectedRole);
      } else {
        const registerData = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: selectedRole,
          ...(selectedRole === 'student' && { major: formData.major }),
          ...(selectedRole === 'tutor' && { subject: formData.subject })
        };
        await register(registerData);
      }
      
      // Navigate based on role
      if (selectedRole === 'student') {
        navigate('/student/dashboard');
      } else {
        navigate('/tutor');
      }
    } catch (error) {
      setError(error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      major: '',
      subject: ''
    });
    setError('');
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  return (
    <div className="login-container">
      <button className="btn btn-secondary" onClick={() => navigate("/")}>
        &larr; Back to Home
      </button>
      
      <h2>{isLogin ? 'Sign In' : 'Create Account'}</h2>
      
      <p>
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <button
          onClick={toggleMode}
          className="btn-link"
          style={{ background: 'none', border: 'none', color: '#4a90e2', textDecoration: 'underline', cursor: 'pointer' }}
        >
          {isLogin ? 'Sign up' : 'Sign in'}
        </button>
      </p>

      {error && (
        <div style={{ background: '#fee', border: '1px solid #fcc', color: '#c33', padding: '10px', borderRadius: '4px', marginBottom: '15px' }}>
          {error}
        </div>
      )}

      {/* Role Selection */}
      <div style={{ marginBottom: '20px' }}>
        <p><strong>I am a:</strong></p>
        <div>
          <label style={{ display: 'block', marginBottom: '8px' }}>
            <input
              type="radio"
              value="student"
              checked={selectedRole === 'student'}
              onChange={(e) => setSelectedRole(e.target.value)}
              style={{ marginRight: '8px' }}
            />
            Student - Looking for tutoring help
          </label>
          <label style={{ display: 'block' }}>
            <input
              type="radio"
              value="tutor"
              checked={selectedRole === 'tutor'}
              onChange={(e) => setSelectedRole(e.target.value)}
              style={{ marginRight: '8px' }}
            />
            Tutor - Offering tutoring services
          </label>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {!isLogin && (
          <div>
            <label>Full Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required={!isLogin}
              style={{ width: '100%', padding: '8px', marginTop: '4px' }}
            />
          </div>
        )}

        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
          />
        </div>

        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
          />
        </div>

        {!isLogin && selectedRole === 'student' && (
          <div>
            <label>Major:</label>
            <input
              type="text"
              name="major"
              value={formData.major}
              onChange={handleInputChange}
              required={!isLogin && selectedRole === 'student'}
              placeholder="e.g., Computer Science"
              style={{ width: '100%', padding: '8px', marginTop: '4px' }}
            />
          </div>
        )}

        {!isLogin && selectedRole === 'tutor' && (
          <div>
            <label>Subject Expertise:</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              required={!isLogin && selectedRole === 'tutor'}
              placeholder="e.g., Mathematics"
              style={{ width: '100%', padding: '8px', marginTop: '4px' }}
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary"
          style={{ marginTop: '10px' }}
        >
          {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
        </button>
      </form>
    </div>
  );
};

export default Login;

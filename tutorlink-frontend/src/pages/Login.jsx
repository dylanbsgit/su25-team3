// src/pages/Login.jsx
import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

const Login = () => {
  const [role, setRole] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:8080/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: credentialResponse.credential,
          role: role,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (data.role === "student") {
        navigate("/student");
      } else if (data.role === "tutor") {
        navigate("/tutor");
      } else {
        setError("Unexpected role received from server.");
      }
    } catch (err) {
      setLoading(false);
      setError("Login failed. Please try again.");
      console.error("Login error:", err);
    }
  };

  const handleError = () => {
    setError("Google login failed. Please try again.");
    console.error("Login Failed");
  };

  return (
    <div className="login-container">
      <button className="btn btn-secondary" onClick={() => navigate("/")}>
        &larr; Back to Home
      </button>
      <h2>Login to TutorLink</h2>

      {!role && (
        <div className="role-select">
          <p>Select your role:</p>
          <button className="btn btn-primary" onClick={() => setRole("student")}>I'm a Student</button>
          <button className="btn btn-secondary" onClick={() => setRole("tutor")}>I'm a Tutor</button>
        </div>
      )}

      {role && (
        <div>
          <p>You selected: <strong>{role}</strong></p>
          <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
          <button className="btn btn-secondary" onClick={() => setRole(null)}>
            Change Role
          </button>
          {loading && <p>Loading...</p>}
          {error && <p className="error-message">{error}</p>}
        </div>
      )}
    </div>
  );
};

export default Login;
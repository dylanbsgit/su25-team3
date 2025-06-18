// src/pages/StudentDashboard.jsx
import React, { useEffect, useState } from "react";
import "../styles/TL_student_dash.css";
import "../styles/TL_student.css";
import axios from "axios";

function StudentDashboard() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8080/students")
      .then(response => setStudents(response.data))
      .catch(error => console.error("Error fetching students:", error));
  }, []);

  return (
    <div className="student-dashboard">
      <div className="topnav">
        <a className="active" href="#home">Home</a>
        <a href="#appointments">Appointments</a>
        <a href="#settings">Settings</a>
      </div>

      <header>
        <h1>Welcome Student!</h1>
        <p>Check your appointments and subjects here.</p>
      </header>

      <section className="dashboard-content">
        <h2>Your Profile</h2>
        {students.length > 0 ? (
          students.map(student => (
            <div key={student.id} className="card">
              <h3>{student.name}</h3>
              <p><strong>Email:</strong> {student.email}</p>
              <p><strong>Education Level:</strong> {student.educationLevel}</p>
              {/* Add more student attributes if available */}
            </div>
          ))
        ) : (
          <p>Loading student data...</p>
        )}
      </section>
    </div>
  );
}

export default StudentDashboard;
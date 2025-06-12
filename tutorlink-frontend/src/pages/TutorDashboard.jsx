// src/pages/TutorDashboard.jsx
import React, { useEffect, useState } from "react";
import "../styles/TL_tutor.css";

function TutorDashboard() {
  const [tutor, setTutor] = useState(null);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    // Example: Get tutor with ID 1
    fetch("http://localhost:8080/tutors/1")
      .then((res) => res.json())
      .then((data) => setTutor(data))
      .catch((err) => console.error("Failed to fetch tutor:", err));

    // Get appointments for this tutor (adjust endpoint as needed)
    fetch("http://localhost:8080/appointments?tutorId=1")
      .then((res) => res.json())
      .then((data) => setAppointments(data))
      .catch((err) => console.error("Failed to fetch appointments:", err));
  }, []);

  if (!tutor) return <div>Loading Tutor Dashboard...</div>;

  return (
    <div className="dashboard">
      <header>
        <h1>Welcome, {tutor.name}</h1>
        <p>Subjects: {tutor.subjects.map((s) => s.name).join(", ")}</p>
        <p>Education Level: {tutor.educationLevel}</p>
      </header>

      <section className="appointments">
        <h2>Upcoming Appointments</h2>
        {appointments.length > 0 ? (
          <ul>
            {appointments.map((appt) => (
              <li key={appt.id}>
                Student: {appt.student.name},
                Subject: {appt.subject.name},
                Date: {new Date(appt.dateTime).toLocaleString()},
                Status: {appt.status}
              </li>
            ))}
          </ul>
        ) : (
          <p>No upcoming appointments.</p>
        )}
      </section>
    </div>
  );
}

export default TutorDashboard;
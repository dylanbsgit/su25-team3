package com.tutorlink.backend.appointment;

import com.tutorlink.backend.subject.Subject;
import com.tutorlink.backend.tutor.Tutor;
import com.tutorlink.backend.student.Student;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long apptID;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private Student student;

    @ManyToOne
    @JoinColumn(name = "tutor_id")
    private Tutor tutor;

    @ManyToOne
    @JoinColumn(name = "subject_id")
    private Subject subject;

    private LocalDateTime dateTime;

    private String location;

    @Enumerated(EnumType.STRING)
    private AppointmentStatus status;

    public Appointment() {}

    public Appointment(Student student, Tutor tutor, Subject subject, LocalDateTime dateTime, String location, AppointmentStatus status) {
        this.student = student;
        this.tutor = tutor;
        this.subject = subject;
        this.dateTime = dateTime;
        this.location = location;
        this.status = status;
    }

    // Getters and Setters

    public Long getApptID() {
        return apptID;
    }

    public void setApptID(Long apptID) {
        this.apptID = apptID;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public Tutor getTutor() {
        return tutor;
    }

    public void setTutor(Tutor tutor) {
        this.tutor = tutor;
    }

    public Subject getSubject() {
        return subject;
    }

    public void setSubject(Subject subject) {
        this.subject = subject;
    }

    public LocalDateTime getDateTime() {
        return dateTime;
    }

    public void setDateTime(LocalDateTime dateTime) {
        this.dateTime = dateTime;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public AppointmentStatus getStatus() {
        return status;
    }

    public void setStatus(AppointmentStatus status) {
        this.status = status;
    }
}
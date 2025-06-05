package com.tutorlink.backend.tutorsubject;

import com.tutorlink.backend.tutor.Tutor;
import com.tutorlink.backend.subject.Subject;
import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "tutor_subject")
public class TutorSubject {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "tutor_id", nullable = false)
    @JsonIgnore  // Prevent infinite recursion during JSON serialization
    private Tutor tutor;

    @ManyToOne
    @JoinColumn(name = "subject_id", nullable = false)
    private Subject subject;

    public TutorSubject() {}

    public TutorSubject(Tutor tutor, Subject subject) {
        this.tutor = tutor;
        this.subject = subject;
    }

    // Getters
    public Long getId() { return id; }

    public Tutor getTutor() { return tutor; }

    public Subject getSubject() { return subject; }

    // Setters
    public void setId(Long id) { this.id = id; }

    public void setTutor(Tutor tutor) { this.tutor = tutor; }

    public void setSubject(Subject subject) { this.subject = subject; }
}
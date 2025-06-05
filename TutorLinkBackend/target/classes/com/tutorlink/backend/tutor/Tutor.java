package com.tutorlink.backend.tutor;

import com.tutorlink.backend.tutorsubject.TutorSubject;
import jakarta.persistence.*;

import java.util.List;

@Entity
public class Tutor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String email;

    // For quick display or old systems that still use a string
    private String subject;

    private double rating;

    @OneToMany(mappedBy = "tutor", fetch = FetchType.LAZY) // REMOVE cascade & orphanRemoval
    private List<TutorSubject> subjects;

    public Tutor() {}

    public Tutor(String name, String email, String subject) {
        this.name = name;
        this.email = email;
        this.subject = subject;
    }

    // Getters and setters

    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }

    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }

    public void setEmail(String email) { this.email = email; }

    public String getSubject() { return subject; }

    public void setSubject(String subject) { this.subject = subject; }

    public double getRating() { return rating; }

    public void setRating(double rating) { this.rating = rating; }

    public List<TutorSubject> getSubjects() { return subjects; }

    public void setSubjects(List<TutorSubject> subjects) {
        this.subjects = subjects;
        if (subjects != null) {
            for (TutorSubject ts : subjects) {
                ts.setTutor(this); // Maintain bi-directional link
            }
        }
    }
}
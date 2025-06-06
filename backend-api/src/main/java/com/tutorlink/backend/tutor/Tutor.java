package com.tutorlink.backend.tutor;

import jakarta.persistence.*;

@Entity
public class Tutor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String subject;

    public Tutor() {}

    public Tutor(String name, String email, String subject) {
        this.name = name;
        this.email = email;
        this.subject = subject;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }
}
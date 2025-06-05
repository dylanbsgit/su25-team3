package com.tutorlink.backend.subject;

import jakarta.persistence.*;

@Entity
public class Subject {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Enumerated(EnumType.STRING)
    private SubjectCategory category;

    @Enumerated(EnumType.STRING)
    private EducationLevel level;

    public Subject() {}

    public Subject(String name, SubjectCategory category, EducationLevel level) {
        this.name = name;
        this.category = category;
        this.level = level;
    }

    // Getters and setters

    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }

    public void setName(String name) { this.name = name; }

    public SubjectCategory getCategory() { return category; }

    public void setCategory(SubjectCategory category) { this.category = category; }

    public EducationLevel getLevel() { return level; }

    public void setLevel(EducationLevel level) { this.level = level; }
}
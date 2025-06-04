package com.tutorlink.backend.subject;

import jakarta.persistence.*;

@Entity
public class Subject {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int subjectID;

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

    public int getSubjectID() { return subjectID; }
    public void setSubjectID(int subjectID) { this.subjectID = subjectID; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public SubjectCategory getCategory() { return category; }
    public void setCategory(SubjectCategory category) { this.category = category; }

    public EducationLevel getLevel() { return level; }
    public void setLevel(EducationLevel level) { this.level = level; }
}
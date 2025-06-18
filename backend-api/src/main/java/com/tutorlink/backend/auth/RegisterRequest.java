package com.tutorlink.backend.auth;

public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private String role; // "student" or "tutor"
    private String major; // For students
    private String subject; // For tutors

    public RegisterRequest() {}

    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getMajor() { return major; }
    public void setMajor(String major) { this.major = major; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }
}
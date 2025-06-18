package com.tutorlink.backend.auth;

public class AuthResponse {
    private String token;
    private String role;
    private Object user; // Can be Student or Tutor
    private String message;

    public AuthResponse() {}

    public AuthResponse(String token, String role, Object user) {
        this.token = token;
        this.role = role;
        this.user = user;
        this.message = "Authentication successful";
    }

    public AuthResponse(String message) {
        this.message = message;
    }

    // Getters and Setters
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public Object getUser() { return user; }
    public void setUser(Object user) { this.user = user; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
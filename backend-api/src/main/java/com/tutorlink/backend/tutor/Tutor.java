// backend-api/src/main/java/com/tutorlink/backend/tutor/Tutor.java

package com.tutorlink.backend.tutor;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
public class Tutor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    
    @Column(unique = true)
    private String email;
    
    private String password;
    
    private String subject;
    private Double rating;
    private String availability;
    
    // ADD THESE NEW FIELDS
    private BigDecimal hourlyRate; // Store hourly rate properly
    private String profilePhotoUrl; // Store profile photo URL
    
    public Tutor() {}

    public Tutor(String name, String email, String password, String subject) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.subject = subject;
        this.rating = 0.0;
        this.hourlyRate = new BigDecimal("25.00"); // Default rate
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }
    
    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }
    
    public String getAvailability() { return availability; }
    public void setAvailability(String availability) { this.availability = availability; }
    
    public BigDecimal getHourlyRate() { return hourlyRate; }
    public void setHourlyRate(BigDecimal hourlyRate) { this.hourlyRate = hourlyRate; }
    
    public String getProfilePhotoUrl() { return profilePhotoUrl; }
    public void setProfilePhotoUrl(String profilePhotoUrl) { this.profilePhotoUrl = profilePhotoUrl; }
}

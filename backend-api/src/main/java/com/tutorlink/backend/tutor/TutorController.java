package com.tutorlink.backend.tutor;

import com.tutorlink.backend.appointment.Appointment;
import com.tutorlink.backend.appointment.AppointmentRepository;
import com.tutorlink.backend.appointment.AppointmentStatus;
import com.tutorlink.backend.tutorsubject.TutorSubject;
import com.tutorlink.backend.tutorsubject.TutorSubjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/tutors")
public class TutorController {

    @Autowired
    private TutorRepository tutorRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;
    
    @Autowired
    private TutorSubjectRepository tutorSubjectRepository;

    // Existing methods...
    @GetMapping
    public List<Tutor> getAllTutors() {
        return tutorRepository.findAll();
    }

    @PostMapping
    public Tutor createTutor(@RequestBody Tutor tutor) {
        return tutorRepository.save(tutor);
    }

    @GetMapping("/test")
    public Tutor getTestTutor() {
        Tutor tutor = new Tutor();
        tutor.setName("Test Tutor");
        tutor.setSubject("Algebra");
        return tutor;
    }

    // UPDATED: Fix availability update to actually work
    @PutMapping("/{id}/availability")
    public Tutor updateAvailability(@PathVariable Long id, @RequestBody Map<String, String> request) {
        return tutorRepository.findById(id).map(tutor -> {
            String availability = request.get("availability");
            if (availability != null && !availability.trim().isEmpty()) {
                tutor.setAvailability(availability);
                return tutorRepository.save(tutor);
            }
            throw new RuntimeException("Availability cannot be empty");
        }).orElseThrow(() -> new RuntimeException("Tutor not found"));
    }

    // UPDATED: Use proper hourlyRate field instead of appending to subject
    @PutMapping("/{id}/rates")
    public Tutor updateRates(@PathVariable Long id, @RequestBody Map<String, String> request) {
        return tutorRepository.findById(id).map(tutor -> {
            String rate = request.get("rate");
            try {
                BigDecimal hourlyRate = new BigDecimal(rate);
                tutor.setHourlyRate(hourlyRate);
                return tutorRepository.save(tutor);
            } catch (NumberFormatException e) {
                throw new RuntimeException("Invalid rate format");
            }
        }).orElseThrow(() -> new RuntimeException("Tutor not found"));
    }

    // UPDATED: Return more comprehensive analytics
    @GetMapping("/{id}/analytics")
    public Map<String, Object> getTutorAnalytics(@PathVariable Long id) {
        Map<String, Object> analytics = new HashMap<>();
        
        // Get appointments for this tutor
        List<Appointment> appointments = appointmentRepository.findAll().stream()
                .filter(apt -> apt.getTutor() != null && apt.getTutor().getId().equals(id))
                .collect(Collectors.toList());
        
        analytics.put("totalSessions", appointments.size());
        analytics.put("completedSessions", appointments.stream()
                .filter(apt -> apt.getStatus() == AppointmentStatus.COMPLETED)
                .count());
        analytics.put("pendingSessions", appointments.stream()
                .filter(apt -> apt.getStatus() == AppointmentStatus.PENDING)
                .count());
        analytics.put("cancelledSessions", appointments.stream()
                .filter(apt -> apt.getStatus() == AppointmentStatus.CANCELLED)
                .count());
        analytics.put("acceptedSessions", appointments.stream()
                .filter(apt -> apt.getStatus() == AppointmentStatus.ACCEPTED)
                .count());
        
        return analytics;
    }
    
    // ADD: Update tutor profile (name, photo URL, etc.)
    @PutMapping("/{id}")
    public Tutor updateTutor(@PathVariable Long id, @RequestBody Tutor updatedTutor) {
        return tutorRepository.findById(id).map(tutor -> {
            if (updatedTutor.getName() != null) {
                tutor.setName(updatedTutor.getName());
            }
            if (updatedTutor.getSubject() != null) {
                tutor.setSubject(updatedTutor.getSubject());
            }
            if (updatedTutor.getProfilePhotoUrl() != null) {
                tutor.setProfilePhotoUrl(updatedTutor.getProfilePhotoUrl());
            }
            return tutorRepository.save(tutor);
        }).orElseThrow(() -> new RuntimeException("Tutor not found"));
    }
    
    // ADD: Get subjects for a specific tutor
    @GetMapping("/{id}/subjects")
    public List<TutorSubject> getTutorSubjects(@PathVariable Long id) {
        return tutorSubjectRepository.findAll().stream()
                .filter(ts -> ts.getTutor().getId().equals(id))
                .collect(Collectors.toList());
    }
}

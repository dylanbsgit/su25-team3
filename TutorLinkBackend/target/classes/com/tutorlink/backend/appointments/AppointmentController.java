package com.tutorlink.backend.appointment;

import com.tutorlink.backend.student.Student;
import com.tutorlink.backend.student.StudentRepository;
import com.tutorlink.backend.subject.Subject;
import com.tutorlink.backend.subject.SubjectRepository;
import com.tutorlink.backend.tutor.Tutor;
import com.tutorlink.backend.tutor.TutorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/appointments")
public class AppointmentController {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private TutorRepository tutorRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    // ✅ GET - all appointments (and auto-complete old accepted ones)
    @GetMapping
    public List<Appointment> getAllAppointments() {
        List<Appointment> appointments = appointmentRepository.findAll();

        for (Appointment appt : appointments) {
            if (appt.getStatus() == AppointmentStatus.ACCEPTED &&
                appt.getDateTime().isBefore(LocalDateTime.now())) {
                appt.setStatus(AppointmentStatus.COMPLETED);
                appointmentRepository.save(appt);
            }
        }

        return appointments;
    }

    // ✅ POST - create new appointment
    @PostMapping
    public Appointment createAppointment(@RequestParam Long studentId,
                                         @RequestParam Long tutorId,
                                         @RequestParam Long subjectId,
                                         @RequestParam String dateTime,
                                         @RequestParam String location) {

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found with ID: " + studentId));

        Tutor tutor = tutorRepository.findById(tutorId)
                .orElseThrow(() -> new RuntimeException("Tutor not found with ID: " + tutorId));

        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new RuntimeException("Subject not found with ID: " + subjectId));

        LocalDateTime parsedDateTime = LocalDateTime.parse(dateTime);

        Appointment appointment = new Appointment(
                student,
                tutor,
                subject,
                parsedDateTime,
                location,
                AppointmentStatus.PENDING
        );

        return appointmentRepository.save(appointment);
    }

    // ✅ PUT - update appointment status
    @PutMapping("/{id}/status")
    public Appointment updateStatus(@PathVariable Long id, @RequestParam AppointmentStatus newStatus) {
        return appointmentRepository.findById(id).map(appt -> {
            appt.setStatus(newStatus);
            return appointmentRepository.save(appt);
        }).orElseThrow(() -> new RuntimeException("Appointment not found with ID: " + id));
    }

    // ✅ PUT - reschedule appointment
    @PutMapping("/{id}/reschedule")
    public Appointment rescheduleAppointment(@PathVariable Long id,
                                             @RequestParam String newDateTime,
                                             @RequestParam(required = false) String newLocation) {
        return appointmentRepository.findById(id).map(appt -> {
            appt.setDateTime(LocalDateTime.parse(newDateTime));
            if (newLocation != null && !newLocation.isBlank()) {
                appt.setLocation(newLocation);
            }
            return appointmentRepository.save(appt);
        }).orElseThrow(() -> new RuntimeException("Appointment not found with ID: " + id));
    }

    // ✅ DELETE - conditional delete logic
    @DeleteMapping("/{id}")
    public void deleteAppointment(@PathVariable Long id, @RequestParam String role) {
        Appointment appt = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found with ID: " + id));

        if (role.equalsIgnoreCase("student") || role.equalsIgnoreCase("tutor")) {
            if (appt.getStatus() == AppointmentStatus.COMPLETED) {
                appointmentRepository.deleteById(id);
            } else if (role.equalsIgnoreCase("tutor") && appt.getStatus() == AppointmentStatus.CANCELLED) {
                appointmentRepository.deleteById(id);
            } else {
                throw new RuntimeException("Only completed appointments or tutor-cancelled ones can be deleted.");
            }
        } else {
            throw new RuntimeException("Invalid role. Must be 'student' or 'tutor'.");
        }
    }
}
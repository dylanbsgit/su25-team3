package com.tutorlink.backend.rating;

import com.tutorlink.backend.student.Student;
import com.tutorlink.backend.student.StudentRepository;
import com.tutorlink.backend.tutor.Tutor;
import com.tutorlink.backend.tutor.TutorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/ratings")
public class RatingController {

    @Autowired
    private RatingRepository ratingRepository;

    @Autowired
    private TutorRepository tutorRepository;

    @Autowired
    private StudentRepository studentRepository;

    // POST: Leave a new rating and update tutor's average
    @PostMapping
    public Rating leaveRating(@RequestParam Long tutorId,
                              @RequestParam Long studentId,
                              @RequestParam double rating,
                              @RequestParam(required = false) String comment) {

        Tutor tutor = tutorRepository.findById(tutorId)
                .orElseThrow(() -> new RuntimeException("Tutor not found"));

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Rating newRating = new Rating(tutor, student, rating, comment, LocalDateTime.now());
        ratingRepository.save(newRating);

        // Auto-update tutor average rating (rounded to 2 decimal places)
        Double avg = ratingRepository.findAverageRatingByTutorId(tutorId);
        if (avg != null) {
            tutor.setRating(Math.round(avg * 100.0) / 100.0);
            tutorRepository.save(tutor);
        }

        return newRating;
    }

    // GET: List all ratings for a specific tutor
    @GetMapping("/tutor/{tutorId}")
    public List<Rating> getTutorRatings(@PathVariable Long tutorId) {
        return ratingRepository.findByTutor_Id(tutorId);
    }
}

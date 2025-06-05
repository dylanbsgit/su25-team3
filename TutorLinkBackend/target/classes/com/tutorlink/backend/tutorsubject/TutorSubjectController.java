package com.tutorlink.backend.tutorsubject;

import com.tutorlink.backend.subject.Subject;
import com.tutorlink.backend.subject.SubjectRepository;
import com.tutorlink.backend.tutor.Tutor;
import com.tutorlink.backend.tutor.TutorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tutor-subjects")
public class TutorSubjectController {

    @Autowired
    private TutorRepository tutorRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private TutorSubjectRepository tutorSubjectRepository;

    // Link a tutor to a subject
    @PostMapping("/{tutorId}/{subjectId}")
    public TutorSubject linkTutorToSubject(@PathVariable Long tutorId, @PathVariable Long subjectId) {
        Tutor tutor = tutorRepository.findById(tutorId)
                .orElseThrow(() -> new RuntimeException("Tutor not found with ID: " + tutorId));
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new RuntimeException("Subject not found with ID: " + subjectId));

        TutorSubject tutorSubject = new TutorSubject(tutor, subject);
        return tutorSubjectRepository.save(tutorSubject);
    }

    // Get all tutor-subject links
    @GetMapping
    public List<TutorSubject> getAllLinks() {
        return tutorSubjectRepository.findAll();
    }

    // Optional: Delete a tutor-subject link by its ID
    @DeleteMapping("/{id}")
    public void deleteTutorSubjectLink(@PathVariable Long id) {
        tutorSubjectRepository.deleteById(id);
    }
}
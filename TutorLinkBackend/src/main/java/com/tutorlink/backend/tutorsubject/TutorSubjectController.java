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

    @PostMapping("/{tutorId}/{subjectId}")
    public TutorSubject linkTutorToSubject(@PathVariable Long tutorId, @PathVariable int subjectId) {
        Tutor tutor = tutorRepository.findById(tutorId)
                .orElseThrow(() -> new RuntimeException("Tutor not found"));
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new RuntimeException("Subject not found"));

        TutorSubject tutorSubject = new TutorSubject(tutor, subject);
        return tutorSubjectRepository.save(tutorSubject);
    }

    @GetMapping
    public List<TutorSubject> getAllLinks() {
        return tutorSubjectRepository.findAll();
    }
}
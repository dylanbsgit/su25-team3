package com.tutorlink.backend.tutor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/tutors")
public class TutorController {

    @Autowired
    private TutorRepository tutorRepository;

    @GetMapping
    public List<Tutor> getAllTutors() {
        return tutorRepository.findAll();
    }

    @PostMapping
    public Tutor createTutor(@RequestBody Tutor tutor) {
        return tutorRepository.save(tutor);
    }

    @GetMapping("/{id}")
    public Tutor getTutorById(@PathVariable Long id) {
        return tutorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tutor not found with id: " + id));
    }

    @PutMapping("/{id}")
    public Tutor updateTutor(@PathVariable Long id, @RequestBody Tutor updatedTutor) {
        return tutorRepository.findById(id).map(tutor -> {
            tutor.setName(updatedTutor.getName());
            tutor.setEmail(updatedTutor.getEmail());
            tutor.setSubjects(updatedTutor.getSubjects());
            return tutorRepository.save(tutor);
        }).orElseThrow(() -> new RuntimeException("Tutor not found with id: " + id));
    }

    @DeleteMapping("/{id}")
    public void deleteTutor(@PathVariable Long id) {
        tutorRepository.deleteById(id);
    }

    @GetMapping("/search")
    public List<Tutor> searchTutorsBySubject(@RequestParam Long subjectId) {
        return tutorRepository.findBySubjects_Subject_Id(subjectId);
    }
}
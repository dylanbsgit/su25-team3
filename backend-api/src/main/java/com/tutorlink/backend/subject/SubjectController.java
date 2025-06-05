package com.tutorlink.backend.subject;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/subjects")
public class SubjectController {

    @Autowired
    private SubjectRepository subjectRepository;

    @GetMapping
    public List<Subject> getAllSubjects() {
        return subjectRepository.findAll();
    }

    @PostMapping
    public Subject createSubject(@RequestBody Subject subject) {
        return subjectRepository.save(subject);
    }

    @PutMapping("/{id}")
public Subject updateSubject(@PathVariable int id, @RequestBody Subject updatedSubject) {
    return subjectRepository.findById(id).map(subject -> {
        subject.setName(updatedSubject.getName());
        subject.setCategory(updatedSubject.getCategory());
        subject.setLevel(updatedSubject.getLevel());
        return subjectRepository.save(subject);
    }).orElseThrow(() -> new RuntimeException("Subject not found"));
}

@DeleteMapping("/{id}")
public void deleteSubject(@PathVariable int id) {
    subjectRepository.deleteById(id);
}

}
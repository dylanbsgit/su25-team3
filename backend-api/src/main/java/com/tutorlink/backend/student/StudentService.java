package com.tutorlink.backend.student;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    public Student findOrCreateByEmail(String email, String name) {
        return studentRepository.findByEmail(email)
                .orElseGet(() -> {
                    Student student = new Student();
                    student.setEmail(email);
                    student.setName(name);
                    return studentRepository.save(student);
                });
    }
}
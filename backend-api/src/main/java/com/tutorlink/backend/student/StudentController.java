package com.tutorlink.backend.student;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/students")
public class StudentController {

    @Autowired
    private StudentRepository studentRepository;

    @GetMapping
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    @PostMapping
    public Student createStudent(@RequestBody Student student) {
        return studentRepository.save(student);
    }

@PutMapping("/{id}")
public Student updateStudent(@PathVariable Long id, @RequestBody Student updatedStudent) {
    return studentRepository.findById(id).map(student -> {
        student.setName(updatedStudent.getName());
        student.setEmail(updatedStudent.getEmail());
        return studentRepository.save(student);
    }).orElseThrow(() -> new RuntimeException("Student not found"));
}

@DeleteMapping("/{id}")
public void deleteStudent(@PathVariable Long id) {
    studentRepository.deleteById(id);
}

}